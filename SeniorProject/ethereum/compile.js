const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
 
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); //remove build directory if it already exists
 
const votingPath = path.resolve(__dirname, 'contracts', 'VotingContract.sol');
const source = fs.readFileSync(votingPath, 'utf8');
 
const input = {
    language: 'Solidity',
    sources: {
      'VotingContract.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
};
 
output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'VotingContract.sol'
];
 
fs.ensureDirSync(buildPath); //create build directory if it does not exist yet
 
for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}