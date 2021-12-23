import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { PalmaNFT } from "../../typechain";
import { initialiseToken } from "../fixtures/TokenInitialisation";
chai.use(solidity);

describe("NFT Deployment", () => {
  describe("when deploying the NFT contract", () => {
    let contract: PalmaNFT;
    let owner: SignerWithAddress;

    beforeEach(async () => {
      [owner] = await ethers.getSigners();
      contract = await initialiseToken();
    });

    it("then the original NFT is minted", async () => {
      expect(await contract.ownerOf(1)).to.be.eq(contract.address);
    });

    it("then NFTs can be purchased straight after deployment", async () => {
      const tokens = await contract.lastTokenId();

      await contract.connect(owner).mint(owner.address, 1);
      const tokensAfterMint = await contract.lastTokenId();

      expect(tokensAfterMint).to.be.eq(tokens.add(1));
    });
  });
});
