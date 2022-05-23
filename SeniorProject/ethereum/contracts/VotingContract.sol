// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract VotingContract {
    
    address public admin;
    string public winner;

    struct Party {
        string partyName;
        uint numberOfVotes;
        // string url;
    }   

    struct VoterUser {
        uint votedParty;
        bool votingState; //if false didn't vote if true voted
        bool canVote;
    }

    mapping (address => VoterUser) public voters;

    Party[] public parties;

    constructor(string[] memory partyNames) {
        admin = msg.sender;

        for(uint i = 0; i < partyNames.length; i++) {
            parties.push(Party({
                partyName: partyNames[i],
                numberOfVotes: 0
            }));
        }
    }

    function giveVote(uint partyIndex) external {
        VoterUser storage caller = voters[msg.sender];
        require(caller.canVote);
        require(!caller.votingState);
        caller.votingState = true;
        caller.votedParty = partyIndex;
        parties[partyIndex].numberOfVotes += 1; 
    }

    function declareWinner() external onlyAdmin {
        uint winningIndex;
        uint voteCounter = 0;
        for(uint i = 0; i < parties.length; i++) {
            if(parties[i].numberOfVotes > voteCounter) {
                voteCounter = parties[i].numberOfVotes;
                winningIndex = i;
            }
        }

        winner = parties[winningIndex].partyName; 
    }

    function makeEligibleToVote(address voterUser) external onlyAdmin {
        require(
            !voters[voterUser].votingState 
        );
        if(!voters[voterUser].canVote) {
            voters[voterUser].canVote = true;
        }   
    }

 function getPartyNumber() external view  returns(uint) {
        return parties.length;
 }
    //function addParty(string memory party) external onlyAdmin { }

    modifier onlyAdmin {
        require(
            msg.sender == admin
        );
        _;
    }



}