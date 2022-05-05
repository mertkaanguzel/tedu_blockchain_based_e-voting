const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./build/VotingContract.json');

const provider = new HDWalletProvider(
  'endorse give match worry mesh eager organ solar pet destroy company sustain',
  'https://rinkeby.infura.io/v3/1c441c37e1cc49d38be059fcdfb8ca61'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const parties = await web3.eth.

  console.log('Trying to make deployment from the account', accounts[0]);

  const contract = await new web3.eth.Contract(abi)
  const deploy = contract.deploy({ data: '0x' + evm.bytecode.object,
  arguments: [['protest','Party1','Party2']]
});
  const VotingContract = await deploy.send({ gas: '1000000', from: accounts[0] });

  console.log('Contract is deployed to', VotingContract.options.address);

  provider.engine.stop();
};
deploy();