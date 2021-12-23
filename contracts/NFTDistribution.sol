pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

struct NFTProperties {
  string color1;
  string color2;
  string color3;
  uint256 rarity;
}

abstract contract NFTDistribution {
  NFTProperties[] private distribution;
  uint256 private constant MAX_ENTRIES = 1000; //The sum of all rarities

  NFTProperties public ORIGINAL = NFTProperties("oro", "plata", "bronce", 0);

  constructor() {
    distribution.push(NFTProperties("oro", "rojo", "azul", 1));
    distribution.push(NFTProperties("rojo", "plata", "negro", 2));
    distribution.push(NFTProperties("azul", "plata", "morado", 2));
    distribution.push(NFTProperties("morado", "azul", "bronce", 5));
    distribution.push(NFTProperties("blanco", "verde", "bronce", 5));
    distribution.push(NFTProperties("negro", "blanco", "bronce", 5));
    distribution.push(NFTProperties("rojo", "verde", "morado", 10));
    distribution.push(NFTProperties("blanco", "rojo", "azul", 10));
    distribution.push(NFTProperties("blanco", "rojo", "verde", 10));
    distribution.push(NFTProperties("blanco", "verde", "rojo", 13));
    distribution.push(NFTProperties("negro", "morado", "azul", 15));
    distribution.push(NFTProperties("negro", "verde", "morado", 15));
    distribution.push(NFTProperties("negro", "blanco", "rojo", 20));
    distribution.push(NFTProperties("morado", "azul", "blanco", 40));
    distribution.push(NFTProperties("blanco", "azul", "negro", 40));
    distribution.push(NFTProperties("azul", "blanco", "negro", 45));
    distribution.push(NFTProperties("morado", "verde", "blanco", 50));
    distribution.push(NFTProperties("blanco", "morado", "verde", 100));
    distribution.push(NFTProperties("verde", "blanco", "negro", 100));
    distribution.push(NFTProperties("morado", "negro", "blanco", 120));
    distribution.push(NFTProperties("negro", "morado", "blanco", 120));
    distribution.push(NFTProperties("morado", "blanco", "negro", 132));
    distribution.push(NFTProperties("blanco", "negro", "morado", 140));
  }

  function getRandomNFTProperty(uint256 randomness)
    public
    view
    returns (NFTProperties memory)
  {
    uint256 entry = (randomness % MAX_ENTRIES) + 1;
    uint256 proccessedEntries;
    for (uint256 i = 0; i < distribution.length; i++) {
      proccessedEntries += distribution[i].rarity;
      if (proccessedEntries >= entry) {
        return distribution[i];
      }
    }

    revert("Unreacheable code");
  }
}
