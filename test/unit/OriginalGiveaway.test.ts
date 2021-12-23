import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { EstrellaNFT, TimeUtils, TimeUtils__factory } from "../../typechain";
import { address } from "../fixtures/AddressUtils";
import {
  advanceToFuture,
  advanceToSaleFinishTime,
} from "../fixtures/BlockchainUtils";
import {
  ChainlinkContractFactory,
  ChainlinkContracts,
} from "../fixtures/chainlink/ChainlinkContracts";
import { processReveal } from "../fixtures/RequestReveal";
import { initialiseToken } from "../fixtures/TokenInitialisation";

chai.use(solidity);

describe("Original giveaway", () => {
  describe("when we are giving away the original piece", () => {
    let contract: EstrellaNFT;
    let owner: SignerWithAddress, investor: SignerWithAddress;
    let chainlinkContracts: ChainlinkContracts;
    let timeUtils: TimeUtils;

    beforeEach(async () => {
      [owner, investor] = await ethers.getSigners();
      contract = await initialiseToken();
      chainlinkContracts = await ChainlinkContractFactory.get();

      //Mint some tokens
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(contract.mint(address(i + 1), 1));
      }
      await Promise.all(promises);
    });

    it("then nobody can trigger a giveaway while the NFT sale is in progress", async () => {
      const giveaway = contract.triggerOriginalGiveaway();
      await expect(giveaway).to.be.revertedWith(
        "NFT Sale has not finished yet"
      );
    });

    it("then anyone can trigger a giveaway after the NFT sale has finished", async () => {
      await advanceToSaleFinishTime(contract);
      const giveaway = contract.triggerOriginalGiveaway();
      await expect(giveaway).not.to.be.reverted;
    });

    it("then a giveway cannot be requested if the original item has been given away already", async () => {
      expect(await contract.ownerOf(1)).to.be.eq(contract.address);
      await advanceToSaleFinishTime(contract);
      await contract.triggerOriginalGiveaway();

      //The request ID index needed is number of tokens revealed
      const tokenRevealsRequested = (await contract.lastTokenId()).toNumber();
      await processReveal(contract, tokenRevealsRequested - 1);

      const transaction = contract.triggerOriginalGiveaway();
      await expect(transaction).to.be.revertedWith(
        "The original edition has already been given away"
      );
    });

    it("then a giveway cannot be requested twice", async () => {
      await advanceToSaleFinishTime(contract);
      await contract.triggerOriginalGiveaway();
      const giveaway2 = contract.triggerOriginalGiveaway();

      expect(giveaway2).to.be.revertedWith(
        "The giveway has been triggered already"
      );
    });

    it("then after processing the giveaway a random NFT owner owns the original piece", async () => {
      expect(await contract.ownerOf(1)).to.be.eq(contract.address);
      await advanceToSaleFinishTime(contract);
      await contract.triggerOriginalGiveaway();

      //The request ID index needed is number of tokens revealed
      const tokenRevealsRequested = (await contract.lastTokenId()).toNumber();
      await processReveal(contract, tokenRevealsRequested - 1);
      const ownerOfOriginal = await contract.ownerOf(1);

      expect(ownerOfOriginal).to.not.be.eq(contract.address);
    });

    it("then after processing the giveaway the first owner can win the original piece", async () => {
      expect(await contract.ownerOf(1)).to.be.eq(contract.address);
      await advanceToSaleFinishTime(contract);
      await contract.triggerOriginalGiveaway();

      //The request ID index needed is number of tokens revealed
      const tokenRevealsRequested = (await contract.lastTokenId()).toNumber();
      await processReveal(contract, tokenRevealsRequested - 1, 0);
      const ownerOfOriginal = await contract.ownerOf(1);

      expect(ownerOfOriginal).to.be.eq(await contract.ownerOf(2));
    });

    it("then after processing the giveaway the last owner can win the original piece", async () => {
      expect(await contract.ownerOf(1)).to.be.eq(contract.address);
      await advanceToSaleFinishTime(contract);
      await contract.triggerOriginalGiveaway();

      //The request ID index needed is number of tokens revealed
      const tokenRevealsRequested = (await contract.lastTokenId()).toNumber();
      await processReveal(
        contract,
        tokenRevealsRequested - 1,
        tokenRevealsRequested - 2
      );
      const ownerOfOriginal = await contract.ownerOf(1);

      expect(ownerOfOriginal).to.be.eq(
        await contract.ownerOf(await contract.lastTokenId())
      );
    });

    it("then after processing the giveaway the first owner wins the original piece when the number is out of bounds by 1", async () => {
      expect(await contract.ownerOf(1)).to.be.eq(contract.address);
      await advanceToSaleFinishTime(contract);
      await contract.triggerOriginalGiveaway();

      //The request ID index needed is number of tokens revealed
      const tokenRevealsRequested = (await contract.lastTokenId()).toNumber();
      await processReveal(
        contract,
        tokenRevealsRequested - 1,
        tokenRevealsRequested - 1
      );
      const ownerOfOriginal = await contract.ownerOf(1);

      expect(ownerOfOriginal).to.be.eq(await contract.ownerOf(2));
    });
  });
});
