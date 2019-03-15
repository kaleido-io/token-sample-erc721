const ERC721Basic = artifacts.require("./ERC721Basic.sol");
const ERC721BasicBurnable = artifacts.require("./ERC721BasicBurnable.sol");

module.exports = function (deployer) {
  deployer.deploy(ERC721Basic, "Kaleido Sample ERC721 Basic Token", "KLD721");
  deployer.deploy(ERC721BasicBurnable, "Kaleido Sample ERC721 Basic Burnable Token", "KLD721B");
};