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

    console.log("Done deploying and minting!");
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