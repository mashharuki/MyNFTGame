/**
 * デフォルトのキャラクターデータを追加するためのスクリプトファイル(修正中)
 * 事前にMyEpicGameコントラクトをデプロイしておくこと。
 */
const main = async () => {
    // コントラクトのアドレス
    const CONTRACT_ADDRESS = "0xAaC6Fb5809049Ca288CFA6644c8ef959E861a7AE";
    const gameContract = await hre.ethers.getContractAt("MyEpicGame", CONTRACT_ADDRESS);
    /**
     * キャラクターデータを追加します。
     * キャラクター名、イメージデータ(CIDにすること)
     */
    let txn = await gameContract.addChracterData(
        "NAMI2", 
        "QmNSa7MR5hcbJS1sHzx5AJ3HhHubChMYJhGGve7kJupii3",
        500,
        200,
        { gasLimit: 30000000 }
    );
    await txn.wait();
    console.log("add character data!!");
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