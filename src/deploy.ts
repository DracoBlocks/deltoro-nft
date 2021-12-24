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

  const { nftSaleFinish, vrfCoordinator, linkToken, keyHash } =
    deploymentConfig;

  const contract = await (
    await new PalmaNFT__factory(owner).deploy(
      nftSaleFinish,
      vrfCoordinator,
      linkToken,
      keyHash
    )
  ).deployed();
  console.log("Contract deployed to:", contract.address);

  if (network != "hardhat" && network != "ganache") {
    await verifyContract(
      contract.address,
      nftSaleFinish,
      vrfCoordinator,
      linkToken,
      keyHash
    );
    console.log("Contract verified in blockchain explorer");
  }
}

async function verifyContract(address: string, ...args: any) {
  return hre.run("verify:verify", {
    address: address,
    constructorArguments: args,
  });
}

main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);
    exit(1);
  });
