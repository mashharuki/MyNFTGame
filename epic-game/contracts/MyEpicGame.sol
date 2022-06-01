// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

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

    CharacterAttributes[] defaultCharacters;
    // token ID
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // map for token ID & attrbutes
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    // map for address & token ID
    mapping(address => uint256) public nftHolders;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg
    ) ERC721("OnePiece", "ONEPIECE") {
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
    }
}