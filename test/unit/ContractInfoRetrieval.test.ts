import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { PalmaNFT } from "../../typechain";
import { initialiseToken } from "../fixtures/TokenInitialisation";
chai.use(solidity);

describe("Contract Info Retrieval", () => {
  describe("when needing information about the contract", () => {
    let contract: PalmaNFT;
    let owner: SignerWithAddress, investor: SignerWithAddress;

    beforeEach(async () => {
      [owner, investor] = await ethers.getSigners();
      contract = await initialiseToken();
    });

    it("then we can obtain all relevant public properties in a single call", async () => {
      const {
        lastTokenId,
        lastMinted,
        nftPrice,
        saleFinishTime,
        nftSaleFinished,
        baseURI,
      } = await contract.getPublicInfo();

      expect({
        lastTokenId,
        lastMinted,
        nftPrice,
        saleFinishTime,
        nftSaleFinished,
        baseURI,
      }).to.eql({
        lastTokenId: await contract.lastTokenId(),
        lastMinted: await contract.lastMinted(),
        nftPrice: await contract.NFT_PRICE(),
        saleFinishTime: await contract.saleFinishTime(),
        nftSaleFinished: await contract.nftSaleFinished(),
        baseURI: await contract.baseURI(),
      });
    });

    it("then we can retrieve all NFTs for an account", async () => {
      const tokensToMint = 20;
      await contract.mint(investor.address, tokensToMint);
      const allNFTs = await contract.getAllOwnedNFTs(investor.address);

      expect(allNFTs.length).to.be.eq(tokensToMint);

      for (let i = 0; i < allNFTs.length; i++) {
        const element = allNFTs[i];

        const tokenId = element.id;
        const tokenURI = element.tokenURI;
        const properties = element.properties;

        expect(properties).to.eql(await contract.tokenProperties(tokenId));
        expect(tokenURI).to.eq(await contract.tokenURI(tokenId));
      }
    });
  });
});
