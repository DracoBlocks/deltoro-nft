import { ethers } from "hardhat";
import {
  EstrellaNFT,
  EstrellaNFT__factory,
  TimeUtils__factory,
} from "../../typechain";
import { ChainlinkContractFactory } from "./chainlink/ChainlinkContracts";
import config from "../../src/config";

interface Options {
  setFinishInTheFuture: boolean;
}

const DEFAULT_OPTIONS: Options = {
  setFinishInTheFuture: true,
};

function getAddresses() {
  return ethers.getSigners();
}

async function initialiseToken(options?: Options): Promise<EstrellaNFT> {
  options = { ...DEFAULT_OPTIONS, ...options };

  const [owner] = await getAddresses();
  const chainlinkContracts = await ChainlinkContractFactory.get();
  const timeUtils = await new TimeUtils__factory(owner).deploy();
  const linkAddress = chainlinkContracts.LINK.address;
  const vrfCoordinatorAddress = chainlinkContracts.vrfCoordinator.address;

  const token = await new EstrellaNFT__factory(owner).deploy(
    options.setFinishInTheFuture
      ? (await timeUtils.getTimestamp()).toNumber() + 3600
      : config.nftSaleFinish,
    config.nftBaseUri,
    vrfCoordinatorAddress,
    linkAddress,
    "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445"
  );

  return token;
}

export { initialiseToken, getAddresses };
