import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../artifacts/contracts/MyEpicGame.sol/MyEpicGame.json";
import LoadingIndicator from "../LoadingIndicator";

/**
 * SelectCharacterコンポーネント
 * @param {*} param0 
 */
const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);

    /**
     * 副作用フック
     */
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
          // コントラクトの情報をセットする。
          setGameContract(contract); 
        } else {
            console.log("Ethereum object not found");
        }
    }, []);

    /**
     * コントラクトの情報が更新されたらキャラクターNFTのデータを読み込む
     */
    useEffect(() => {
        // キャラクターNFTを取得するメソッド
        const getCharacters = async () => {
            try {
              console.log("Getting contract characters to mint");
              // ミント可能な全NFTキャラクターを取得する。
              const charactersTxn = await gameContract.getAllDefaultCharacters();
              console.log("charactersTxn:", charactersTxn);
        
              // フロントエンド側で扱いやすいオブジェクトに変換する。
              const nftCharacters = charactersTxn.map((characterData) =>
                transformCharacterData(characterData)
              );
        
              // console.log("chracters:", nftCharacters);
              // ミント可能なすべてのNFTキャラクターの状態を設定します。
              setCharacters(nftCharacters);
            } catch (error) {
              console.error("Something went wrong fetching characters:", error);
            }
          };

          // イベントをキャッチした時に実行する。
          const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`);
            
            if (gameContract) {
                // NFTする。
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log("CharacterNFT: ", characterNFT);
                // データ構造を変換する。
                setCharacterNFT(transformCharacterData(characterNFT));
                alert(
                    `NFT キャラクーが Mint されました -- リンクはこちらです: https://rinkeby.rarible.com/token/${
                        gameContract.address
                    }:${tokenId.toNumber()}?tab=details`
                );
            }
          };

          // コントラクトがセットされている場合のみ実行
          if (gameContract) {
            getCharacters();
            // リスナーの設定
            gameContract.on("CharacterNFTMinted", onCharacterMint);
          }
          return () => {
            // コンポーネントがマウントされたら、リスナーを停止する。
            if (gameContract) {
              gameContract.off("CharacterNFTMinted", onCharacterMint);
            }
          };
    }, [gameContract]);

    // キャラクターNFTのデータを表示するメソッド
    const renderChracters = () => 
        characters.map((character, index) => (
            <div className="character-item" key={character.name}>
              <div className="name-container">
                <p>{character.name}</p>
              </div>
              <img src={character.imageURI} alt={character.name} />
              <button
                type="button"
                className="character-mint-button"
                onClick={mintCharacterNFTAction(index)}
              >{`Mint ${character.name}`}</button>
            </div>
        ));
     

    // キャラクターNFTを発行するためのメソッド
    const mintCharacterNFTAction = (characterId) => async () => {
        try {
          if (gameContract) {
            setMintingCharacter(true);
            console.log("Minting character in progress...");
            // mintCharacterNFTメソッドを呼び出す。
            const mintTxn = await gameContract.mintCharacterNFT(characterId);
            await mintTxn.wait();
            console.log("mintTxn:", mintTxn);
            setMintingCharacter(false);
          }
        } catch (error) {
          console.warn("MintCharacterAction Error:", error);
          setMintingCharacter(false);
        }
    };

    return (
        <div className="select-character-container">
            <h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
            {characters.length > 0 && (
                <div className="character-grid">
                    {renderChracters()}
                </div>
            )}
            {mintingCharacter && (
              <div className="loading">
                <div className="indicator">
                  <LoadingIndicator />
                  <p>Minting In Progress...</p>
                </div>
              </div>
            )}
        </div>
    );
};

export default SelectCharacter;