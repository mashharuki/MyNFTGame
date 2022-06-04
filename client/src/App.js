import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import Arena from "./Components/Arena";
import SelectCharacter from "./Components/SelectCharacter";
import myEpicGame from "./artifacts/contracts/MyEpicGame.sol/MyEpicGame.json";
import { 
  CONTRACT_ADDRESS, 
  TWITTER_HANDLE, 
  TWITTER_LINK, 
  transformCharacterData 
} from "./constants";
import { ethers } from "ethers";
import LoadingIndicator from "./Components/LoadingIndicator";

/**
 * Appコンポーネント
 */
const App = () => {
  // ステート変数
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // check network DI
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        alert("Rinkeby Test Network に接続してください!");
      } else {
        console.log("Rinkeby に接続されています.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check user have metamask
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    try {
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        // MetaMaskのアカウント情報を取得する。
        const accounts = await ethereum.request({ method: "eth_accounts" });
          
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            // ステート変数を格納する。
            setCurrentAccount(account);
          } else {
            console.log("No authorized account found");
          }
      }
    } catch(error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  /**
   * Connect Walletボタン
   */
   const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please download MetaMask!");
        return;
      }
      checkIfWalletIsConnected();
      // ウォレットアドレスに対してアクセスをリクエストしています。
      const accounts = await ethereum.request({method: "eth_requestAccounts",});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      checkNetwork();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * ログイン状態によってConnect Walletボタンを表示を切り替えるメソッド
   */
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    // ウォレットのログイン状態を確認する。
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://i.imgur.com/yMocj5x.png" alt="Pikachu" />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet to Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  // NFTのデータを取得する副作用フック
  useEffect(() => {
    const fetchNFTMetadata = async() => {
      console.log("Checking for Character NFT on address:", currentAccount);
      // コントラクト機能を使うための準備
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      // checkIfUserHasNFTメソッドを呼び出す。
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
      // ローディング状態をfalseにする。
      setIsLoading(false);
    };
    // アカウントが接続されている時のみNFTデータを取得する。
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
        <p className="header gradient-text">⚡️ METAVERSE GAME ⚡️</p>
          <p className="sub-text">複数のキャラクターを駆使してボスを倒そう✨</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
