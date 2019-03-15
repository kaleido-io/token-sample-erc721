const ERC721Basic = artifacts.require("./ERC721Basic.sol");

module.exports = function (deployer) {
  deployer.deploy(ERC721Basic, "Kaleido Sample ERC721 Basic Token", "KLD721");
};