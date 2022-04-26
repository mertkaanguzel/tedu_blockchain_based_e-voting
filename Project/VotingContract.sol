// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract VotingContract {
    
    address public admin;

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
<<<<<<< HEAD
        require(caller.canVote);
=======
        require(!caller.canVote);
>>>>>>> 835b9104d28698e8dc0689382f743c0d11df1cce
        require(!caller.votingState);
        caller.votingState = true;
        caller.votedParty = partyIndex;
        parties[partyIndex].numberOfVotes += 1; 
    }

    function declareWinner() external view
        returns(string memory winner){
            //require to be admin ekle
        require(
<<<<<<< HEAD
            msg.sender == admin
=======
            msg.sender == admin;
>>>>>>> 835b9104d28698e8dc0689382f743c0d11df1cce
        );
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

    function makeEligibleToVote(address voterUser) external {
        require(
            msg.sender == admin
        );
        require(
            !voters[voterUser].votingState 
        );
        if(!voters[voterUser].canVote) {
            voters[voterUser].canVote = true;
        }   
    } 

}