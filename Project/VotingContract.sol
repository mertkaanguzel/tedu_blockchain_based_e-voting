<<<<<<< Updated upstream
=======
// SPDX-License-Identifier: GPL-3.0

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        for(uint i = 0; i < partyName.length; i++) {
=======
        for(uint i = 0; i < partyNames.length; i++) {
>>>>>>> Stashed changes
            parties.push(Party({
                partyName: partyNames[i],
                numberOfVotes: 0
            }));
        }
    }

    function giveVote(uint partyIndex) external {
        VoterUser storage caller = voters[msg.sender];
        require(!caller.canVote);
        require(!caller.votingState);
        caller.votingState = true;
        caller.votedParty = partyIndex;
        parties[partyIndex].numberOfVotes += 1; 
    }

    function declareWinner() external view
<<<<<<< Updated upstream
        returns(string winner)
    {
=======
        returns(string memory winner){
>>>>>>> Stashed changes
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

    function makeEligibleToVote(address VoterUser) external {
        require(
<<<<<<< Updated upstream
            msg.sender == admin;
=======
            msg.sender == admin
>>>>>>> Stashed changes
        );
        require(
            !voters[VoterUser].votingState 
        );
        if(!voters[VoterUser].canVote) {
            voters[VoterUser].canVote = true;
        }   
    } 

}