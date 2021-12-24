import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { PalmaNFT } from "../../typechain";
import { advanceToFuture } from "../fixtures/BlockchainUtils";
import { processReveal } from "../fixtures/RequestReveal";
import { initialiseToken } from "../fixtures/TokenInitialisation";
import { slowDescribe } from "../SlowTest";

chai.use(solidity);

describe("NFT Rarity", () => {
  describe("when revealing an NFT", () => {
    let contract: PalmaNFT;
    let investor: SignerWithAddress;

    beforeEach(async () => {
      [, investor] = await ethers.getSigners();
      contract = await initialiseToken();
    });

    [
      {
        name: "oro-plata-bronce",
        rarity: 0,
        expectedRarity: "Original",
      },
      {
        name: "oro-rojo-azul",
        rarity: 1,
        expectedRarity: "Legendary",
      },
      {
        name: "rojo-verde-morado",
        rarity: 10,
        expectedRarity: "Epic",
      },
      {
        name: "morado-azul-blanco",
        rarity: 40,
        expectedRarity: "Rare",
      },
      {
        name: "blanco-morado-verde",
        rarity: 100,
        expectedRarity: "Common",
      },
    ].forEach((data) => {
      it("then " + data.name + " has the highest rarity", async () => {
        const rarityLevel = await contract.getRarityLevel(data.rarity);
        expect(rarityLevel).to.be.eq(data.expectedRarity);
      });
    });
  });
});
