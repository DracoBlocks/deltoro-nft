import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { EstrellaNFT } from "../../typechain";
import { advanceToFuture } from "../fixtures/BlockchainUtils";
import { processReveal } from "../fixtures/RequestReveal";
import { initialiseToken } from "../fixtures/TokenInitialisation";
import { slowDescribe } from "../SlowTest";

chai.use(solidity);

describe("NFT Minting", () => {
  describe("when minting an NFT", () => {
    let contract: EstrellaNFT;
    let investor: SignerWithAddress;
    let nftPrice: BigNumber;

    beforeEach(async () => {
      [, investor] = await ethers.getSigners();
      contract = await initialiseToken();
      nftPrice = await contract.NFT_PRICE();
    });

    it("then the owner can mint for free", async () => {
      const transaction = contract.mint(investor.address, 1);

      await expect(transaction).to.not.be.reverted;
    });

    it("then a user cannot mint an NFT for free", async () => {
      const transaction = contract.connect(investor).mint(investor.address, 1);

      await expect(transaction).to.be.revertedWith(
        "Not enough MATIC sent to purchase the NFTs"
      );
    });

    it("then a user can mint paying the defined price", async () => {
      const transaction = contract
        .connect(investor)
        .mint(investor.address, 1, { value: nftPrice });

      await expect(transaction).to.not.be.reverted;
    });

    it("then a user can mint multiple NFTs paying the defined price", async () => {
      await contract.connect(investor).mint(investor.address, 10, {
        value: nftPrice.mul(10),
      });

      const tokensOwned = await contract.balanceOf(investor.address);

      expect(tokensOwned).to.be.eq(10);
    });

    it("then the user receives the NFT token", async () => {
      await contract.mint(investor.address, 1);
      const nftOwner = await contract.ownerOf(await contract.lastTokenId());

      expect(nftOwner).to.be.eq(investor.address);
    });

    it("then the reveal doesn't happen at the time of receiving the NFT", async () => {
      await contract.mint(investor.address, 1);

      const tokenProperties = await contract.tokenProperties(
        await contract.lastTokenId()
      );

      expect(tokenProperties["color1"]).to.be.empty;
      expect(tokenProperties["color2"]).to.be.empty;
      expect(tokenProperties["color3"]).to.be.empty;
      expect(tokenProperties["rarity"]).to.be.eq(0);
    });

    it("then the reveal happens after the VRF coordinator processes the randomness request", async () => {
      await contract.mint(investor.address, 1);

      await processReveal(contract);

      const tokenProperties = await contract.tokenProperties(
        await contract.lastTokenId()
      );

      const tokenURI = await contract.tokenURI(await contract.lastTokenId());
      const expectedURI = (await contract.baseURI()) + tokenProperties["cid"];

      expect(tokenProperties["color1"]).to.not.be.empty;
      expect(tokenProperties["color2"]).to.not.be.empty;
      expect(tokenProperties["color3"]).to.not.be.empty;
      expect(tokenProperties["rarity"]).to.not.be.eq(0);
      expect(tokenURI).to.be.eq(expectedURI);
    });

    it("then if the sale is finished users can't mint NFT", async () => {
      const time = (await contract.saleFinishTime()).sub(
        Math.floor(new Date().getTime() / 1000)
      );

      advanceToFuture(time.toNumber());

      await expect(contract.mint(investor.address, 1)).to.be.revertedWith(
        "NFT Sale has finished"
      );
    });

    it("then a user cannot mint more than 1000 NFTs in one go", async () => {
      await expect(contract.mint(investor.address, 1001)).to.be.revertedWith(
        "Cannot mint more than 1000 tokens in one transaction"
      );
    });

    it("then the last minted date is set", async () => {
      const lastMintedBefore = await contract.lastMinted();
      await contract.mint(investor.address, 1);

      expect(await contract.lastMinted()).to.be.gt(lastMintedBefore);
    });
  });

  slowDescribe("when minting an NFT to absurd limits", () => {
    let contract: EstrellaNFT;
    let owner: SignerWithAddress, investor: SignerWithAddress;
    let nftPrice: BigNumber;

    beforeEach(async () => {
      [owner, investor] = await ethers.getSigners();
      contract = await initialiseToken();
      nftPrice = await contract.NFT_PRICE();
    });

    it("then a user can mint the limit NFTs in one go", async () => {
      await expect(contract.mint(investor.address, 1000)).to.not.be.reverted;
    });
  });
});
