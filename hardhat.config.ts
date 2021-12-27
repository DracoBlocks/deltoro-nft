import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/types";
import * as secrets from "./secrets.json";

//Order of accounts SHOULD NOT be altered.
//Fill with nulls if an account is no longer needed, or otherwise the wrong accounts may be used on our scripts.
//If removing, do check the order every account is imported in every script. This does not affect tests though.
const accounts = [secrets.accounts.deployer];

const config: HardhatUserConfig = {
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      blockGasLimit: 60000000,
    },
    ganache: {
      url: "HTTP://127.0.0.1:8545",
      chainId: 1337,
      accounts: accounts,
      blockGasLimit: 60000000,
    },
    testnet: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: accounts,
    },
    mainnet: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: secrets.verification.scanApiKey,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  gasReporter: {
    currency: "MATIC",
    // (Currently not available - setting the ETH price manually). See https://github.com/cgewecke/hardhat-gas-reporter/issues/65
    // ethPrice: 345.85, //Get current BNB price from https://coinmarketcap.com/currencies/binance-coin/
    // gasPrice: 7, //Get current average for the month from https://explorer.bitquery.io/bsc/gas
    showTimeSpent: true,
    excludeContracts: [
      "LinkToken",
      "VRFCoordinatorMock",
      "RequestIDProducer",
      "TimeUtils",
    ],
    coinmarketcap: secrets.coinmarketcap.apiKey,
  },
};

export default config;
