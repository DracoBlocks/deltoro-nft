import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { EstrellaNFT } from "../../typechain";
import { initialiseToken } from "../fixtures/TokenInitialisation";
chai.use(solidity);

describe("NFTs are enumerable", () => {
  describe("when minting NFTs", () => {
    let contract: EstrellaNFT;
    let owner: SignerWithAddress;
    let investor: SignerWithAddress;

    beforeEach(async () => {
      [owner, investor] = await ethers.getSigners();
      contract = await initialiseToken();
    });

    it("then we can enumerate the tokens owned by an address", async () => {
      await contract.mint(investor.address, 1);
      const lastTokenMinted = await contract.lastTokenId();

      const numberOfTokensInvestor = await contract.balanceOf(investor.address);
      const firstTokenFromInvestor = await contract.tokenOfOwnerByIndex(
        investor.address,
        numberOfTokensInvestor.sub(1)
      );

      expect(firstTokenFromInvestor).to.be.eq(lastTokenMinted);
    });

    it("then we can enumerate the original NFT", async () => {
      const numberOfTokensInvestor = await contract.balanceOf(contract.address);
      const firstTokenFromContract = await contract.tokenOfOwnerByIndex(
        contract.address,
        numberOfTokensInvestor.sub(1)
      );

      expect(firstTokenFromContract).to.be.eq(1);
    });
  });
});
