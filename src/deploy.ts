import hre, { ethers } from "hardhat";
import { exit } from "process";
import { EstrellaNFT__factory } from "../typechain";
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

  const { nftSaleFinish, nftBaseUri, vrfCoordinator, linkToken, keyHash } =
    deploymentConfig;

  const contract = await new EstrellaNFT__factory(owner).deploy(
    nftSaleFinish,
    nftBaseUri,
    vrfCoordinator,
    linkToken,
    keyHash
  );
  console.log("Contract deployed to:", contract.address);

  // await verifyContract(contract.address);
  // console.log("Contract verified in bscscan");
}

async function verifyContract(address: string) {
  return hre.run("verify:verify", {
    address: address,
  });
}

main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);
    exit(1);
  });
