pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

struct NFTProperties {
  string color1;
  string color2;
  string color3;
  uint256 rarity;
  string cid;
}

abstract contract NFTDistribution {
  NFTProperties[] private distribution;
  uint256 private constant MAX_ENTRIES = 1000; //The sum of all rarities

  NFTProperties public ORIGINAL =
    NFTProperties(
      "oro",
      "plata",
      "bronce",
      0,
      "QmU8JVpvGMcN7ZrEj4uU9WYrmxCHAa3ctz1mrAaLnwWvXC"
    );

  constructor() {
    distribution.push(
      NFTProperties(
        "oro",
        "rojo",
        "azul",
        1,
        "QmPxka31kiu38jVnyM24JLANVeHuzNW3TJTe5suDJjYLfD"
      )
    );
    distribution.push(
      NFTProperties(
        "rojo",
        "plata",
        "negro",
        2,
        "QmcmwF9hMPYKaDq8MG2jckxpBpzB78cH5kUv4fFRy165W5"
      )
    );
    distribution.push(
      NFTProperties(
        "azul",
        "plata",
        "morado",
        2,
        "QmYunEydWCkRwoUmF8YUxDAdW9hmiGAR22q9qGDGRbpKRH"
      )
    );
    distribution.push(
      NFTProperties(
        "morado",
        "azul",
        "bronce",
        5,
        "QmXyLzwPB3gb3Aizce74NmLBfvzSNkxmXBufEmCuJ9vgRM"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "verde",
        "bronce",
        5,
        "QmVFBrxEWwbmEQdbYCGwfyDw4MFNmYyB2c4YEom7UisM2n"
      )
    );
    distribution.push(
      NFTProperties(
        "negro",
        "blanco",
        "bronce",
        5,
        "Qmcad8dWoaXBVVDhtcZS4o255V9BaUH9bPC74JBTFddQnU"
      )
    );
    distribution.push(
      NFTProperties(
        "rojo",
        "verde",
        "morado",
        10,
        "QmcUQS4rtmw9MCNBVeL6MAFsCgUsLed8fmzFNV2w9ujaAv"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "rojo",
        "azul",
        10,
        "QmeewojztUpPy192VKpYDuEnZAWeeWmDtMrN9GqDBmZQEi"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "rojo",
        "verde",
        10,
        "QmPF5thTxPJuTF6sMqnfQKfr4KwCDGJbYrq2uqzJBDq8ao"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "verde",
        "rojo",
        13,
        "QmU33z4Dp5fpfKnEuRs5XDpiAwXEQyz2oWG3aWrjczKakH"
      )
    );
    distribution.push(
      NFTProperties(
        "negro",
        "morado",
        "azul",
        15,
        "QmaMHEW2tJPJBNTC1cmLGKXfPYuBwAHfEarY6KbpHVrUKt"
      )
    );
    distribution.push(
      NFTProperties(
        "negro",
        "verde",
        "morado",
        15,
        "QmWz71xaVEkWkbGbUEL1AP7Vqg2VLMEBLYxtgHQFUDRSyU"
      )
    );
    distribution.push(
      NFTProperties(
        "negro",
        "blanco",
        "rojo",
        20,
        "QmQ3My8qzy19DPg7zKvBaCc92QPFYrfTq29KG6qV55odHe"
      )
    );
    distribution.push(
      NFTProperties(
        "morado",
        "azul",
        "blanco",
        40,
        "QmXh5sq7FMeYwtBrPss6uszdRzYtuBBQzB75zHGL9mRK7f"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "azul",
        "negro",
        40,
        "QmSYE6zJ8NJ7riWKQbhKgJiyi7DXQZ1MgZMwschPuryZd6"
      )
    );
    distribution.push(
      NFTProperties(
        "azul",
        "blanco",
        "negro",
        45,
        "QmcqyynERHRGNNEjGBVXhxxZgQvzL3ygWKMvtjX7M5d4vJ"
      )
    );
    distribution.push(
      NFTProperties(
        "morado",
        "verde",
        "blanco",
        50,
        "QmUUPtjExJj1fm5zD4f6jJEbciQKJwT7MAG8THdfT9qHzf"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "morado",
        "verde",
        100,
        "QmSFaNGjDnPjHHeTNASLuFLM4sUoQH9WBDnUysEvy476Gu"
      )
    );
    distribution.push(
      NFTProperties(
        "verde",
        "blanco",
        "negro",
        100,
        "QmT7GRnPG2dp3ZqAJFbrUibciDNNB6zw6ULHocKJ6WuERA"
      )
    );
    distribution.push(
      NFTProperties(
        "morado",
        "negro",
        "blanco",
        120,
        "QmbneDYEpMTQg6XmhD4aWjEzB7HDd98ZMuXD9LR2uLUuSW"
      )
    );
    distribution.push(
      NFTProperties(
        "negro",
        "morado",
        "blanco",
        120,
        "QmUH5NPYH7ohti8uLdgvn82yg5Ekn4ywjUZLxi5huHBodm"
      )
    );
    distribution.push(
      NFTProperties(
        "morado",
        "blanco",
        "negro",
        132,
        "QmPySBHJ9XHLLEZKAbQ8pUcAvyqxEXy7hY1mRdGuzgV9LQ"
      )
    );
    distribution.push(
      NFTProperties(
        "blanco",
        "negro",
        "morado",
        140,
        "QmYQSHZLZuTYQU5DKvv6TKYs6YSDBKN9rCjmYN3eVw8eVZ"
      )
    );
  }

  function getRarityLevel(uint256 rarity)
    external
    pure
    returns (string memory)
  {
    if (rarity >= 100) {
      return "Common";
    } else if (rarity >= 40) {
      return "Rare";
    } else if (rarity >= 10) {
      return "Epic";
    } else if (rarity >= 1) {
      return "Legendary";
    } else {
      return "Original";
    }
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
