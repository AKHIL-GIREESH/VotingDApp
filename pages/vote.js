import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import {VOTINGSYSTEM_CONTRACT_ADDRESS,abi} from '../constants'
import styles from '../styles/Home.module.css'

export default function Vote(){

    const [walletConnected, setWalletConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [preference,setPreference] = useState("");
    const web3ModalRef = useRef();

    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
        window.alert("Change the network to Goerli");
        throw new Error("Change network to Goerli");
        }

        if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
        }
        return web3Provider;
    };

    const casteVote = async (prop) => {
      try{
        checkWhetherVoted()
        if (!hasVoted){
        const signer = await getProviderOrSigner(true);
        const votingSystemContract = new Contract(
          VOTINGSYSTEM_CONTRACT_ADDRESS,
          abi,
          signer
        );

        const tx = await votingSystemContract.vote(prop);
        setLoading(true);

        await tx.wait();
        setLoading(false);
        setHasVoted(true);
      }
      updateScores()
      } catch (err) {
        console.error(err);
      }
    }

    async function checkWhetherVoted(){
        try {
          const signer = await getProviderOrSigner(true);
          const votingSystemContract = new Contract(
            VOTINGSYSTEM_CONTRACT_ADDRESS,
            abi,
            signer
          );
          const address = await signer.getAddress();
          const votingStatus = await votingSystemContract.voterMap(
            address
          );
          console.log(votingStatus.voted)
          setHasVoted(votingStatus.voted);
        } catch (err) {
          console.error(err);
        }
      };
    
    async function updateScores(){
      try {
        const signer = await getProviderOrSigner(true);
        const votingSystemContract = new Contract(
          VOTINGSYSTEM_CONTRACT_ADDRESS,
          abi,
          signer
        );

        redScore= await votingSystemContract.choiceMap("red")
        greenScore = await votingSystemContract.choiceMap("green")
        blueScore = await votingSystemContract.choiceMap("blue")

        console.log(redScore.toNumber())
        console.log(greenScore.toNumber())
        console.log(blueScore.toNumber())
      }catch (err) {
        console.error(err);
      }
    }


    const connectWallet = async () => {
        try {
          await getProviderOrSigner();
          setWalletConnected(true);
          checkWhetherVoted();
          updateScores();

        } catch (err) {
          console.error(err);
        }
      };
    
    const renderButton = () => {
    if (walletConnected) {
      if (hasVoted) {
        return (
          <div className={styles.description}>
            Your Vote has been Recorded 
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={casteVote} className={styles.button}>
            Vote
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

    return(
    
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.buttonContainer}>
          <button onClick={()=> setPreference("red") } className={preference === "red"?styles.optionsYR:styles.optionsNR} name="red">RED</button>
          <button onClick={()=> setPreference("green") } className={preference === "green"?styles.optionsYG:styles.optionsNG} name="green">GREEN</button>
          <button onClick={()=> setPreference("blue")} className={preference === "blue"?styles.optionsYB:styles.optionsNB} name="blue">BLUE</button>
        </div>
        <div className={styles.renderButton}>
        {renderButton()}
        </div>
      </div>
      <div className={styles.biggestCircle}></div>
      <div className={styles.smallCircle1}></div>
      <div className={styles.smallCircle2}></div>
    </div>
    )
}


 