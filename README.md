# Smart Contracts for Octavio del Toro's NFT collection

For a quick start of how to develop with solidity / OpenZeppelin, have a look at their [documentation](https://docs.openzeppelin.com/learn/).

## Configuration

All the config for the project is stored in the [config](config) folder. This configuration is static and public, therefore it is different from secret management (secrets.json).

For secret management, a template of what this file should look like is available in [secrets.json.template](secrets.json.template) and the secrets.json file should be present in the root of this project.

## Local development

### Requirements

- Node
- Yarn

### Testing the contracts

#### Test suite: unit and integration tests

You can run the tests with `yarn test`.

All the tests are stored in the [test](test) folder, separated between [unit tests](test/unit) that interact with the contract directly and [integration tests](test/integration) that interact with more than one contract as a requirement.

#### Slow tests

Slow tests are naturally skipped. A slow test is described by using the `slowDescribe` method instead of Mocha's typical describe.

In order to run all tests including slow tests, use `yarn slowTest`.

### Deploying a smart contract

First, ensure the config and the secrets have been defined correctly.

We use a deployment script that will read those secrets and deploy + verify the contract; see [src/deploy.ts](src/deploy.ts).

You can deploy the contract to the blockchain network of choice by running `npm run deploy-testnet` or `npm run deploy-mainnet`, making sure that secrets.json contain the appropriate deployment details for each case.

For more details, have a look at the [deploying and interacting](https://docs.openzeppelin.com/learn/deploying-and-interacting#deploying-a-smart-contract) section in OpenZeppelin.

## Contribution guidelines

Have a look at the more detailed [contribution guidelines](CONTRIBUTING.md).
