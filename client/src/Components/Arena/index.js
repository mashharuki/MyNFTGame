import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../artifacts/contracts/MyEpicGame.sol/MyEpicGame.json";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator";

/**
 * Arenaコンポーネント
 * @param {*} param0 NFTのメタデータ
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // ステート変数
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 副作用フック
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(contract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  // 副作用フック
  useEffect(() => {
    // ボスのデータを取得する。
    const fetchBoss = async () => {
        const bossTxn = await gameContract.getBisBoss();
        console.log("Boss:", bossTxn);
        setBoss(transformCharacterData(bossTxn));
    };

    // イベントリスナーを受信した時のコールバック関数
    const onAttackComplete = (newBossHp, newPlayerHp) => {
        // ボスとプレイヤーの更新後のHPを取得する。
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();
        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);
    
        // NFT キャラクターとボスのHPを更新します。
        setBoss((prevState) => {
          return { ...prevState, hp: bossHp };
        });
        setCharacterNFT((prevState) => {
          return { ...prevState, hp: playerHp };
        });
    };

    if (gameContract) {
        fetchBoss();
        // イベントリスナー設定
        gameContract.on("AttackComplete", onAttackComplete);
    }
    return () => {
        if (gameContract) {
            // リスナー終了
            gameContract.off("AttackComplete", onAttackComplete);
        }
    };
  }, [gameContract]);

  /**
   * 攻撃アクションを実行するためのメソッド
   */
  const runAttackAction = async () => {
    try {
        if (gameContract) {
            // attackState の状態を attacking に設定する。
            setAttackState("attacking");
            console.log("Attacking boss...");
            // attackBossメソッドを呼び出す。
            const attackTxn = await gameContract.attackBoss();
            await attackTxn.wait();
            console.log("attackTxn:", attackTxn);
      
            // attackState の状態を hit に設定する。
            setAttackState("hit");

            setShowToast(true);
            // 5秒後に非表示にする。
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
          }
    } catch (error) {
        console.error("Error attacking boss:", error);
        setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}
      {boss && (
        <div className="boss-container">
            <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
                <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
                </div>
            </div>
            </div>
            <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
                {`💥 Attack ${boss.name}`}
            </button>
            </div>
            {attackState === "attacking" && (
              <div className="loading-indicator">
                <LoadingIndicator />
                <p>Attacking ⚔️</p>
              </div>
            )}
        </div>
        )}
        {characterNFT && (
            <div className="players-container">
                <div className="player-container">
                <h2>Your Character</h2>
                <div className="player">
                    <div className="image-content">
                    <h2>{characterNFT.name}</h2>
                    <img
                        src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                    />
                    <div className="health-bar">
                        <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                        <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                    </div>
                    </div>
                    <div className="stats">
                    <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                    </div>
                </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Arena;