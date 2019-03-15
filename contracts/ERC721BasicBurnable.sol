pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol";

contract ERC721BasicBurnable is ERC721MetadataMintable, ERC721Burnable {
  constructor(string memory name, string memory symbol)
    ERC721Metadata(name, symbol)
  public {
  }
}