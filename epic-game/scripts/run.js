/**
 * テスト用のスクリプト
 */
const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
    const gameContract = await gameContractFactory.deploy(
        ["ZORO", "NAMI", "USOPP"], 
        ["https://i.imgur.com/TZEhCTX.png",  "https://i.imgur.com/WVAaMPA.png", "https://i.imgur.com/pCMZeiM.png",],
        [100, 200, 300], 
        [100, 50, 25] ,
        "CROCODILE",
        "https://i.imgur.com/BehawOh.png",
        10000,
        50
    );
    const nftGame = await gameContract.deployed();

    console.log("Contract deployed to:", nftGame.address);

    // キャラクターNFTを発行していく
    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    // トランザクションブロードキャスト
    await txn.wait();
    // URIを取得する。
    let returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);

    // 1回目の攻撃
    txn = await gameContract.attackBoss();
    await txn.wait();
    // 2回目の攻撃
    txn = await gameContract.attackBoss();
    await txn.wait();

    // デフォルトで選べるキャラクターを追加する。
    txn = await gameContract.addChracterData("test", "https://i.imgur.com/TZEhCTX.png", 100, 50);
    await txn.wait();
    // キャラクターNFTを発行していく(4番目)
    txn = await gameContract.mintCharacterNFT(3);
    // トランザクションブロードキャスト
    await txn.wait();
    // URIを取得する。
    returnedTokenUri = await gameContract.tokenURI(4);
    console.log("Token URI:", returnedTokenUri);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();