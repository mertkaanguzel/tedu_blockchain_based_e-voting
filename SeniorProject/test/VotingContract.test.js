const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledContract = require("../ethereum/build/VotingContract.json");

let accounts;
let contractAddress;
let contract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
        .deploy({ data: compiledContract.bytecode, arguments: ['party1', 'party2'] })
        .send({ from: accounts[0], gas: "1000000" });

    ///...arguments??    
});

describe("VotingContract", () => {
 it("deploys a contract", () => {
        assert.ok(contract.options.address);
      });

 it('marks caller as the admin of the contract', async () => {
        const admin = await contract.methods.admin().call();
        assert.equal(accounts[0], admin);    
      });

  it('has initial parties', async () => {
        
      });

  it('allows an admin to make a user eligible to vote', async () => {
        await contract.methods.makeEligibleToVote(accounts[1]).send({ 
            from: accounts[0], 
            gas: "1000000" 
        });   
        
        const voter = await contract.methods.voters(accounts[1]).call();
        //assert.equal(voter.canVote, true);
        assert(voter.canVote);
      });

  it('allows user to vote(vote count)', async () => {
        
      });

  it('allows admin to select a winner(processes voting)', async () => {
        
      });


  //it('allows an admin to add parties', async () => { await contract.methods.});


});