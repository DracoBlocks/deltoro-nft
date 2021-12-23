import * as defaultConf from "../config.json";
import * as testnet from "../config.testnet.json";
import * as mainnet from "../config.mainnet.json";
import hre from "hardhat";

let config = defaultConf;

if (hre.network.name == "testnet") {
  config = { ...config, ...testnet };
} else if (hre.network.name == "mainnet") {
  config = { ...config, ...mainnet };
}

export default config;
