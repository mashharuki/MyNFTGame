/**
 * テスト用のスクリプト
 */
 const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
    const gameContract = await gameContractFactory.deploy(
        ["ZORO", "NAMI", "USOPP"], 
        [
            "QmQ59urX6G91McKCha59vL7j9JsACCx9ofZKWJ5CT5cEYd",  
            "QmNSa7MR5hcbJS1sHzx5AJ3HhHubChMYJhGGve7kJupii3", 
            "QmQ59urX6G91McKCha59vL7j9JsACCx9ofZKWJ5CT5cEYd",
        ],
        [100, 200, 300], 
        [100, 50, 25] ,
        "CROCODILE",
        "https://i.imgur.com/BehawOh.png",
        10000,
        50
    );
    const nftGame = await gameContract.deployed();

    console.log("nftGame.address:", nftGame.address);

    // キャラクターNFTを発行していく
    let txn;
    /*
    txn = await gameContract.mintCharacterNFT(0);
    // トランザクションブロードキャスト
    await txn.wait();
    console.log("Minted NFT #1");

    txn = await gameContract.mintCharacterNFT(1);
    // トランザクションブロードキャスト
    await txn.wait();
    console.log("Minted NFT #2");
       

    txn = await gameContract.mintCharacterNFT(2);
    // トランザクションブロードキャスト
    await txn.wait();
    console.log("Minted NFT #3");

    // 1回目の攻撃
    txn = await gameContract.attackBoss();
    await txn.wait();
    // 2回目の攻撃
    txn = await gameContract.attackBoss();
    await txn.wait();

    console.log("Done deploying and minting and attack!");
     */
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