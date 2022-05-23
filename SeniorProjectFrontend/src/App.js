import { useEffect, useRef, useState } from "react";
import initWeb3 from "./utils/web3";
import "./App.css";
const {abi, contractAddress} = require('./utils/Voting');
//const { abi, evm } = require('./utils/VotingContract.json');
//const contractAddress = "0x75403a404817480E44CA9F5887A32e79479BC117";
const { ethereum } = window;

function App() {
  const VotingContract = useRef(null);
  const [web3, setWeb3] = useState(null);
  const [doneCheckingForMetaMask, setDoneCheckingForMetaMask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isRinkebyChain, setIsRinkebyChain] = useState(false);

  const [manager, setManager] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState("");
  const [ballot, setBallot] = useState([]);
  const [winner, setWinner] = useState("");
  const [message, setMessage] = useState("");
  const [adress, setAddress] = useState("");

  const [enteringVoting, setEnteringVoting] = useState(false);
  const [pickingWinner, setPickingWinner] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initWeb3WithProvider() {
      if (web3 === null) {
        if (!cancelled) {
          setDoneCheckingForMetaMask(false);
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);

          // Transactions done in this app must be done on the Rinkeby test network.
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          if (chainId === "0x4") {
            setIsRinkebyChain(true);
          }

          setDoneCheckingForMetaMask(true);

          if (web3Instance !== null) {
            // Create Contract JS object.
            VotingContract.current = new web3Instance.eth.Contract(abi, contractAddress);

            // Check to see if user is already connected.
            try {
              const accounts = await ethereum.request({ method: "eth_accounts" });
              //const ballot = await VotingContract.current.methods.getDeployedCampaigns().call();
              //setBallot(ballot);
              if (accounts.length > 0 && ethereum.isConnected()) {
                setConnected(true);
                setAccounts(accounts);
              }
            } catch (error) {
              console.error(error);
            }

            // Implement `accountsChanged` event handler.
            ethereum.on("accountsChanged", handleAccountsChanged);
          }
        }
      }
    }

    initWeb3WithProvider();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (connected) {
      async function handler() {
        const manager = await VotingContract.current.methods.admin().call();
        //const ballot = await VotingContract.current.methods.getResults().call();
        if (!cancelled) {
          setManager(manager);
          //SetBallot(ballot);
          await updatePlayersListAndBalance();
        }
      }
      handler();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const getAccount = async (_event) => {
    setConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {}
    setConnecting(false);
  };

  const handleAccountsChanged = (_accounts) => {
    window.location.reload();
  };

  /**
   * Define a function to update players list and balance in the page view
   * without the user having to perform a manual page reload.
   */
  
  const updatePlayersListAndBalance = async () => {
    //const players = await VotingContract.current.methods.getPlayers().call();
    //setPlayers(players);
    const balance = await web3.eth.getBalance(VotingContract.current.options.address);
    setBalance(balance);
    //const ballot = await VotingContract.current.methods.getResults().call();
    //setBallot(ballot);
    let candidates = [];
    for(let i=0;i<3;i++){
      candidates.push(await VotingContract.current.methods.parties(i).call());
    }
    setBallot(candidates);

    let winner = await VotingContract.current.methods.winner().call();
    setWinner(winner);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setEnteringVoting(true);
    //const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    /*
    await VotingContract.current.methods.makeEligibleToVote().send({
      from: accounts[0],
      value: adress
    });
    */
    giveRighttoVote(adress);
    showMessage("The address has right to vote!");
    updatePlayersListAndBalance();
    setEnteringVoting(false);
  };

  const pickWinner = async (event) => {
    event.preventDefault();
    setPickingWinner(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await VotingContract.current.methods.declareWinner().send({
      from: accounts[0]
    });
    showMessage("A winner has been picked!");
    updatePlayersListAndBalance();
    setPickingWinner(false);
  };

  const showMessage = async (msg) => {
    setMessage(msg);
  };


const vote = async (index) =>{
  //giveRighttoVote(accounts[0]);
  await VotingContract.current.methods.giveVote(index).send({
     from: accounts[0]
  })
  updatePlayersListAndBalance();
}

const giveRighttoVote = async(address) =>{
  await VotingContract.current.methods.makeEligibleToVote(address).send({
    from: accounts[0]
  })
}


  return (
    <div className="App">

      {web3 === null && !doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert info">
            <h1 className="no-margin-top">Voting Contract</h1>
            <p className="no-margin">Checking for MetaMask Ethereum Provider...</p>
          </div>
        </div>
      )}

      {web3 === null && doneCheckingForMetaMask && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Voting Contract</h1>
            <p className="no-margin">
              MetaMask is required to run this app! Please install MetaMask and then refresh this
              page.
            </p>
          </div>
        </div>
      )}

      {web3 !== null && doneCheckingForMetaMask && !isRinkebyChain && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Voting Contract</h1>
            <p className="no-margin">
              You must be connected to the <strong>Rinkeby test network</strong> for Ether
              transactions made via this app.
            </p>
          </div>
        </div>
      )}

      {web3 !== null && !connected && isRinkebyChain && (
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Voting Contract</h1>
            <p>
              Test
            </p>
            <div className="center">
              <button
                className="btn primaryBtn"
                type="button"
                onClick={getAccount}
                disabled={connecting}
              >
                Connect with MetaMask
              </button>
            </div>
          </section>
        </div>
      )}

      {web3 !== null && connected && isRinkebyChain && (
        /*
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Voting Contract</h1>
            <p>
              This contract is managed by {manager}.
            </p>
            <p>
              The balance is {typeof ballot}.
            </p>
          </section>
          <h4>proposal:</h4>
   {ballot.map((party, index) => {
    const name = party.partyName;
    const voteCount = party.numberOfVotes._hex;
    return (
     <div key={index} style={{ padding: '1rem 0' }}>
      🗳 {name} - {Number(voteCount)}
      <button
       style={{ marginLeft: '2em' }}>
       Vote
      </button>
     </div>
    );
   })}
        </div>
        */
        <div style={{ padding: '3rem 5rem' }}>
        <h1>Blockchain Voting System</h1>
        <div>
        <h4>Candidates</h4>
        {ballot.map((party, index) => {
    const name = party.partyName;
    const voteCount = party.numberOfVotes;
    return (
     <div key={index} style={{ padding: '1rem 0' }}>
       {name} - {Number(voteCount)}
      <button
       style={{ marginLeft: '2em' }}
            onClick={() => vote(index)}>
            Vote
           </button>
          </div>
         );
        })}
       </div>
       
       {manager.toLowerCase() === ethereum.selectedAddress && (
              <>
                <hr />

                <form onSubmit={onSubmit}>
              <h4>Give Someone Right to Vote </h4>
              
                <label>Address of the User:</label>{" "}
                <input value={adress} onChange={(event) => setAddress(event.target.value)} />{" "}
                <button className="btn primaryBtn" type="submit" disabled={enteringVoting}>
                  Enter
                </button>
              
            </form>

                <h4>End the Voting</h4>
                <button
                  className="btn primaryBtn"
                  type="button"
                  onClick={pickWinner}
                  disabled={pickingWinner}
                >
                  Get the result
                </button>
              </>
            )}

<h2>{message}</h2>
<h2>{winner}</h2>

      </div>

        

      )}
    </div>
  );
}

export default App;
