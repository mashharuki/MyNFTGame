// アプリで使用する定数を定義したファイル

const CONTRACT_ADDRESS = "0xeb7431F22868544E2f7AbfbD2Ac6bd691942045D";
const TWITTER_HANDLE = 'HARUKI05758694';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// NFTデータをフロントエンド側でも扱える様なオブジェクトに変換する。
const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };

export { CONTRACT_ADDRESS, TWITTER_LINK, TWITTER_HANDLE, transformCharacterData };