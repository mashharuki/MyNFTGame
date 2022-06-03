/**
 * デフォルトのキャラクターデータを追加するためのスクリプトファイル
 * 事前にMyEpicGameコントラクトをデプロイしておくこと。
 */
const main = async () => {
    // コントラクトのアドレス
    const CONTRACT_ADDRESS = "0xAaC6Fb5809049Ca288CFA6644c8ef959E861a7AE";
    const gameContract = await hre.ethers.getContractAt("MyEpicGame", CONTRACT_ADDRESS);
    // URIを取得する。
    let returnedTokenUri = await gameContract.tokenURI(2);
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