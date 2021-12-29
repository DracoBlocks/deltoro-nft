import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { PalmaNFT } from "../../typechain";
import { initialiseToken } from "../fixtures/TokenInitialisation";
chai.use(solidity);

describe("Token burn", () => {
  describe("when burning a token", () => {
    let contract: PalmaNFT;
    let owner: SignerWithAddress, investor: SignerWithAddress;

    beforeEach(async () => {
      [owner, investor] = await ethers.getSigners();
      contract = await initialiseToken();
    });

    it("then the token disappears", async () => {
      const originalBalance = await contract.balanceOf(owner.address);
      await contract.mint(owner.address, 1);
      const lastToken = await contract.lastTokenId();

      await contract.burn(lastToken);

      expect(await contract.balanceOf(owner.address)).to.eq(originalBalance);
    });

    it("then the burned token count goes up", async () => {
      const burned = await contract.tokensBurned();
      await contract.mint(owner.address, 1);
      const lastToken = await contract.lastTokenId();
      await contract.burn(lastToken);

      expect(await contract.tokensBurned()).to.eq(burned.add(1));
    });

    it("then only the owner of the contract can burn it", async () => {
      await contract.mint(investor.address, 1);
      const lastToken = await contract.lastTokenId();

      await expect(contract.connect(investor).burn(lastToken)).to.be.reverted;
      await expect(contract.connect(owner).burn(lastToken)).to.not.be.reverted;
    });
  });
});
