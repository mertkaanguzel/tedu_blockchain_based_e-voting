const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
 
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); //remove build directory if it already exists
 
const votingPath = path.resolve(__dirname, 'contracts', 'VotingContract.sol');
const source = fs.readFileSync(votingPath, 'utf8');
 
const input = {
  language: "Solidity",
  sources: {},
  settings: {
    metadata: {
      useLiteralContent: true,
    },
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};


input.sources['VotingContract.sol'] = {
  content: source,
};
 
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts['VotingContract.sol'];

fs.ensureDirSync(buildPath); //create build directory if it does not exist yet
 
for(let contract in contracts) {
    //fs.outputJsonSync(
       // path.resolve(buildPath, `${contract}.json`),
      //  contracts[contract]
   // );
    if (contracts.hasOwnProperty(contract)) {
      fs.outputJsonSync(path.resolve(buildPath, `${contract}.json`), contracts[contract]);
    }
}