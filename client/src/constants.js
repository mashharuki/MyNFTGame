// アプリで使用する定数を定義したファイル

const CONTRACT_ADDRESS = "0xEa75F140619dDD31aa104a5a7F277dF7d5dF680D";
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