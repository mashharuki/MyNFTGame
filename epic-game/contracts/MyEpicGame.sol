// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MyEpicGame {

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

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg
    ) {
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
    }

}