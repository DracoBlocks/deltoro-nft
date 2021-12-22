# Contribution guidelines

## Key packages / dependencies we are using

- Typescript as main programming language for tests and deployments.
- Solidity to create smart contracts in Ethereum-based networks.
- OpenZeppelin as the provider of key functionality in our smart contracts and tests.
- Hardhat and Waffle as an abstraction to test solidity contracts.
- Typechain with the Hardhat module, to generate interfaces that allow easy interaction with solidity contracts.

## Code formatting

We use `prettier` for formatting of all programming language source code, including both typescript and solidity. To make use of this, you can install the [prettier extension in VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), for example.

Formatting can also be done by running `npm run format`.

## Code coverage

Any new piece of code should be accompanied by a corresponding set of unit / integration tests.

## Testing solidity contracts

Any solidity contract that is required for testing purposes should live in the [contracts/test](contracts/test) folder. These will be ignored at the time of deployment.
