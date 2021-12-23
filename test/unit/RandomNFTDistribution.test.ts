import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { EstrellaNFT } from "../../typechain";
import {
  ChainlinkContractFactory,
  ChainlinkContracts,
} from "../fixtures/chainlink/ChainlinkContracts";
import { initialiseToken } from "../fixtures/TokenInitialisation";
chai.use(solidity);

describe("NFT random distribution (reveal)", () => {
  describe("when requesting an NFT property", () => {
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

    it("with randomness 0 then we receive a property with ojo, rojo, and azul", async () => {
      const nftProperty = await contract.getRandomNFTProperty(0);
      expect(nftProperty["color1"]).to.be.eq("oro");
      expect(nftProperty["color2"]).to.be.eq("rojo");
      expect(nftProperty["color3"]).to.be.eq("azul");
    });

    it("with randomness 1 then we receive a property with rojo, plata, and negro", async () => {
      const nftProperty = await contract.getRandomNFTProperty(1);
      expect(nftProperty["color1"]).to.be.eq("rojo");
      expect(nftProperty["color2"]).to.be.eq("plata");
      expect(nftProperty["color3"]).to.be.eq("negro");
    });

    it("with randomness 10 then we receive a property with blanco, verde and bronce", async () => {
      const nftProperty = await contract.getRandomNFTProperty(10);
      expect(nftProperty["color1"]).to.be.eq("blanco");
      expect(nftProperty["color2"]).to.be.eq("verde");
      expect(nftProperty["color3"]).to.be.eq("bronce");
    });

    it("with randomness 999 then we receive a property with blanco, negro, morado", async () => {
      const nftProperty = await contract.getRandomNFTProperty(999);
      expect(nftProperty["color1"]).to.be.eq("blanco");
      expect(nftProperty["color2"]).to.be.eq("negro");
      expect(nftProperty["color3"]).to.be.eq("morado");
    });

    it("with randomness 1000 then we receive a property with ojo, rojo, and azul", async () => {
      const nftProperty = await contract.getRandomNFTProperty(1000);
      expect(nftProperty["color1"]).to.be.eq("oro");
      expect(nftProperty["color2"]).to.be.eq("rojo");
      expect(nftProperty["color3"]).to.be.eq("azul");
    });

    it("with randomness 1500 then we receive a property with morado, negro, and blanco", async () => {
      const nftProperty = await contract.getRandomNFTProperty(1500);
      expect(nftProperty["color1"]).to.be.eq("morado");
      expect(nftProperty["color2"]).to.be.eq("negro");
      expect(nftProperty["color3"]).to.be.eq("blanco");
    });

    it("with randomness 54321 then we receive a property with blanco, morado, and verde", async () => {
      const nftProperty = await contract.getRandomNFTProperty(54321);
      expect(nftProperty["color1"]).to.be.eq("blanco");
      expect(nftProperty["color2"]).to.be.eq("morado");
      expect(nftProperty["color3"]).to.be.eq("verde");
    });
  });
});
