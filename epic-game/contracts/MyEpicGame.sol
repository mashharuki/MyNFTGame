// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import "./libraries/Base64.sol";

contract MyEpicGame is ERC721 {

    // struct for character data
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    // struct for Boss
    struct BigBoss {
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    CharacterAttributes[] defaultCharacters;
    BigBoss public bigBoss;

    // token ID
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // map for token ID & attrbutes
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    // map for address & token ID
    mapping(address => uint256) public nftHolders;

    // events
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackComplete(uint newBossHp, uint newPlayerHp);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint bossHp,
        uint bossAttackDamage
    ) ERC721("OnePiece", "ONEPIECE") {
        // set Boss param
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });

        console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

        // set default data
        for(uint i = 0; i < characterNames.length; i += 1) {
            // create array
            defaultCharacters.push(CharacterAttributes({
                                        characterIndex: i,
                                        name: characterNames[i],
                                        imageURI: characterImageURIs[i],
                                        hp: characterHp[i],
                                        maxHp: characterHp[i],
                                        attackDamage: characterAttackDmg[i]
                                    }));

            CharacterAttributes memory character = defaultCharacters[i];
            // show character params
            console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
        }
        _tokenIds.increment();
    }

    // mint function
    function mintCharacterNFT(uint _characterIndex) external {
        uint256 newItemId = _tokenIds.current();
        // mint
        _safeMint(msg.sender, newItemId);
        // create attribute data
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
        // mapping address & ID
        nftHolders[msg.sender] = newItemId;
        _tokenIds.increment();
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    // get tokenURI function
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        // get attribute for tokenID
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
        // convert to string
        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
        // encode base64
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                ' -- NFT #: ',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,'} ]}'
            )
        );
        // create tokenURI(string)
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }

    // attack logic 
    function attackBoss() public {
        // get TokenID
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        // get attribute for token ID
	    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
        // check player & Boss HP
        require (player.hp > 0, "Error: character must have HP to attack boss.");
        require (bigBoss.hp > 0, "Error: boss must have HP to attack boss.");

        // player's attack
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }
        // Boss's attack
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }
        // show play & Boss hp
        console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
	    console.log("Boss attacked player. New player hp: %s\n", player.hp);
        emit AttackComplete(bigBoss.hp, player.hp);
    }

    // check user's address has NFT
    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        // get token ID
        uint256 userNftTokenId = nftHolders[msg.sender];
        // check hold NFT
        if(userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    // get all character data
    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    // get bigboss data
    function getBisBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }
}