const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledContract = require('./build/VotingContract.json');

const provider = new HDWalletProvider(
    'light trial fashion island dignity identify tone acquire unfold view airport trip',
    'https://rinkeby.infura.io/v3/c445534b73a7416eb7583e01212643f1'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();


  console.log('Trying to make deployment from the account', accounts[0]);

  const result = await new web3.eth.Contract(compiledContract.abi)
    .deploy({ data: compiledContract.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract is deployed to', result.options.address);
};
deploy();