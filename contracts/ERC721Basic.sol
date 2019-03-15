pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";

contract ERC721Basic is ERC721MetadataMintable {
  constructor(string memory name, string memory symbol)
    ERC721Metadata(name, symbol)
  public {
  }
}