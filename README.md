# token-sample-erc721

The purpose of this sample project is demonstrating ERC721 token contracts based on the awesome openzeppelin contract library, and features of the ERC721 token specification with truffel test scenarios.

## Token Contracts Demonstrated

The contracts with the features and tested scenarios are listed below.

#### Basic ERC721 with metadata and minting
```
contracts/ERC721Basic.sol

constructor
  ✓ initialized with the correct metadata and designates the deployer as a minter (89ms)
  ✓ check the contract deployer balance is 0 (63ms)
minting tokens
  ✓ current owner can mint new tokens for themselves (161ms)
  ✓ current owner can mint new tokens for user1 (142ms)
designating token operators
  ✓ curent owner can designate an operator to manage their tokens (38ms)
  ✓ checking the approved operator on token 1
  ✓ blanket approval for operator to manager user1 assets (174ms)
  ✓ checking the approved operator on token 2 and 3
  ✓ operator now can transfer on behalf of currentOwner from specific approval (98ms)
  ✓ operator now can transfer on behalf of user1 from blanket approval (73ms)
```

## Getting Started

Instal [truffle](https://truffleframework.com/truffle)
Install [Ganache](https://truffleframework.com/ganache) and start it

```
npm i
truffle test
``` 