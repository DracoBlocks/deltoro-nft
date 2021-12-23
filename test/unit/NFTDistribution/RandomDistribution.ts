import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { EstrellaNFT } from "../../../typechain";
import {
  ChainlinkContractFactory,
  ChainlinkContracts,
} from "../../fixtures/chainlink/ChainlinkContracts";
import { initialiseToken } from "../../fixtures/TokenInitialisation";
chai.use(solidity);

describe("NFT random distribution (reveal)", () => {
  describe("when requesting a random NFT property", () => {
    let contract: EstrellaNFT;
    let owner: SignerWithAddress;
    let chainlinkContracts: ChainlinkContracts;

    beforeEach(async () => {
      [owner] = await ethers.getSigners();
      contract = await initialiseToken();
      chainlinkContracts = await ChainlinkContractFactory.get();
    });

    it("then we receive a random property", async () => {
      const nftProperty = await contract.getRandomNFTProperty(
        Math.floor(Math.random() * 1000000)
      );
      expect(nftProperty["rarity"]).to.be.gt(0);
    });
  });
});
