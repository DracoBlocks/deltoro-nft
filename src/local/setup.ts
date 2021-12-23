import hre from "hardhat";
import { ChainlinkContractFactory } from "../../test/fixtures/chainlink/ChainlinkContracts";

/**
 * Setup smart contracts locally
 */
const setupLocal = async () => {
  const network = hre.network.name;

  if (network == "hardhat" || network == "ganache") {
    const chainlinkContracts = await ChainlinkContractFactory.get();
    return {
      linkToken: chainlinkContracts.LINK.address,
      vrfCoordinator: chainlinkContracts.vrfCoordinator.address,
      keyHash:
        "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
    };
  }

  return {};
};

export default setupLocal;
