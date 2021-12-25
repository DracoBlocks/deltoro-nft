import hre, { ethers } from "hardhat";
import { exit } from "process";
import { PalmaNFT__factory } from "../typechain";
import config from "./config";
import setupLocal from "./local/setup";

async function main() {
  const [owner] = await ethers.getSigners();

  let deploymentConfig = config;
  const network = hre.network.name;
  if (network == "hardhat" || network == "ganache") {
    const localConfig = await setupLocal();
    deploymentConfig = { ...config, ...localConfig };
  }

  const {
    nftSaleFinish,
    ipfsMetadataFolderCid,
    vrfCoordinator,
    linkToken,
    keyHash,
  } = deploymentConfig;

  const contract = await new PalmaNFT__factory(owner).deploy(
    nftSaleFinish,
    ipfsMetadataFolderCid,
    vrfCoordinator,
    linkToken,
    keyHash
  );
  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);
    exit(1);
  });
