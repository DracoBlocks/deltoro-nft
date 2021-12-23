import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
  LinkToken,
  LinkToken__factory,
  VRFCoordinatorMock,
  VRFCoordinatorMock__factory,
} from "../../../typechain";

interface ChainlinkContracts {
  LINK: LinkToken;
  vrfCoordinator: VRFCoordinatorMock;
}

class ChainlinkContractFactory {
  private static instance: ChainlinkContractFactory;

  private contracts: ChainlinkContracts;

  private constructor(contracts: ChainlinkContracts) {
    this.contracts = contracts;
  }

  public static async get(): Promise<ChainlinkContracts> {
    if (!ChainlinkContractFactory.instance) {
      const [owner] = await ethers.getSigners();
      ChainlinkContractFactory.instance = new ChainlinkContractFactory(
        await deployChainlink(owner)
      );
    }

    return ChainlinkContractFactory.instance.contracts;
  }
}

async function deployChainlinkToken(
  owner: SignerWithAddress
): Promise<LinkToken> {
  return new LinkToken__factory(owner).deploy();
}

async function deployVRFCoordinator(
  owner: SignerWithAddress,
  link: string
): Promise<VRFCoordinatorMock> {
  return new VRFCoordinatorMock__factory(owner).deploy(link);
}

async function deployChainlink(
  owner: SignerWithAddress
): Promise<ChainlinkContracts> {
  const linkToken = await deployChainlinkToken(owner);
  const vrfCoordinator = await deployVRFCoordinator(owner, linkToken.address);

  return {
    LINK: linkToken,
    vrfCoordinator: vrfCoordinator,
  };
}

export { ChainlinkContractFactory, ChainlinkContracts };
