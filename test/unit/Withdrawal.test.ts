import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { PalmaNFT } from "../../typechain";
import {
  ChainlinkContractFactory,
  ChainlinkContracts,
} from "../fixtures/chainlink/ChainlinkContracts";
import { initialiseToken } from "../fixtures/TokenInitialisation";
chai.use(solidity);

describe("Withdrawal test", () => {
  describe("when there are tokens or ETH in the contract", () => {
    let contract: PalmaNFT;
    let owner: SignerWithAddress, investor: SignerWithAddress;
    let chainlinkContracts: ChainlinkContracts;
    let nftPrice: BigNumber;

    beforeEach(async () => {
      [owner, investor] = await ethers.getSigners();
      contract = await initialiseToken();
      chainlinkContracts = await ChainlinkContractFactory.get();
      nftPrice = await contract.NFT_PRICE();
    });

    it("then we can withdraw the ETH", async () => {
      await contract.connect(investor).mint(investor.address, 1, {
        value: nftPrice,
      });

      const initialBalance = await owner.getBalance();
      //Anyone can call withdraw, but only the owner will receive it
      await contract.connect(investor).withdraw();
      expect(await owner.getBalance()).to.be.eq(initialBalance.add(nftPrice));
    });

    it("then we can withdraw excess LINK tokens", async () => {
      await chainlinkContracts.LINK.connect(owner).transfer(
        contract.address,
        1000
      );
      const initialBalance = await chainlinkContracts.LINK.balanceOf(
        owner.address
      );
      const initialLinkInContract = await chainlinkContracts.LINK.balanceOf(
        contract.address
      );

      await contract.withdrawToken(chainlinkContracts.LINK.address);

      const linkInContract = await chainlinkContracts.LINK.balanceOf(
        contract.address
      );

      expect(initialLinkInContract).to.be.gt(0);
      expect(linkInContract).to.be.eq(0);
      expect(await chainlinkContracts.LINK.balanceOf(owner.address)).to.be.eq(
        initialBalance.add(initialLinkInContract)
      );
    });
  });
});
