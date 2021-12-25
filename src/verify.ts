import hre from "hardhat";
import { env, exit } from "process";
import config from "./config";

async function main() {
  const {
    nftSaleFinish,
    ipfsMetadataFolderCid,
    vrfCoordinator,
    linkToken,
    keyHash,
  } = config;

  await verifyContract(
    env.CONTRACT_ADDRESS!,
    nftSaleFinish,
    ipfsMetadataFolderCid,
    vrfCoordinator,
    linkToken,
    keyHash
  );
  console.log("Contract verified in blockchain explorer");
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
