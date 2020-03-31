# Branch Bulk Link Creator

1. Install node.js
2. Check node is working from Terminal by typing `node --version`, you should see something like `v13.11.0`
3. Run `npm install` from the root folder of the project - this will install all of your dependencies
4. Install `ts-node`
5. Add replace `BRANCH_KEY` in `index.ts` so that it looks like the following:
  `const branchKey = 'key_live_gpQjWaEAt2OYhaCRUV6vvjeeAxxxxx'`
6. Add the link data for the links you would like to generate to the `bulk-link.csv`
7. From the project root run: `ts-node index.ts readFile`

Your file should appear in `output.csv` should everything have worked correctly.