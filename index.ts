
import axios from 'axios'
import { StringStream } from 'scramjet'
import * as fs from 'fs'
import path from 'path'

const branchKey = 'BRANCH_KEY'

async function bulkCreate(rows: Row[]): Promise<String[]> {
  console.log(`Creating: ${rows.length} links...`)
  const api = axios.create({
    baseURL: `https://api2.branch.io/v1/url/`
  })
  const requestBody = rows.map(row => {
    return {...row}
  })
  try {
    const response = await api.post(`bulk/${branchKey}`, requestBody)
    //@ts-ignore
    return response.data.map(value => {
      return value.url
    })
  } catch (error) {
    console.error(`Errors loading links from api: ${error}`)
    throw error
  }
}

async function readFile(filename: string) {
  const stream = fs.createReadStream(path.join(__dirname, filename))
  const writeStream = fs.createWriteStream(path.join(__dirname, 'output.csv'))
  var counter = 0
  await StringStream.from(stream, { maxParallel: 2 })
    .CSVParse({
      delimiter: ',',
      header: true,
      skipEmptyLines: true,
      worker: true
    })
    .batch(200)
    .map(async function(rows: Array<Row>) {
      const filtered = rows.filter(row => {return !!row.campaign}).map( row => {delete row.alias; return row})
      console.debug(`results loaded: ${filtered.length}`)
      counter = counter + filtered.length
      const output = await bulkCreate(filtered)
      return output
    })
    .catch((e: { stack: any }) => {
      console.error(`Error uploading events: ${e.stack} counter: ${counter}`)
      throw e
    })
    .toStringStream()
    .append("\n")
    .split(',')
    .append("\n")
    .pipe(writeStream)
}

readFile('bulk-link.csv')

interface Row {
  campaign?: string,
  channel?: string,
  feature?: string,
  tags?: string[],
  alias?: string,
  data?: JSON
}
