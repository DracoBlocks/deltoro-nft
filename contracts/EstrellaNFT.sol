pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./RandomGenerator.sol";
import "./NFTDistribution.sol";

contract EstrellaNFT is
  RandomGenerator,
  NFTDistribution,
  ERC721URIStorage,
  Ownable
{
  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public constant NFT_PRICE = 10 * 10**18; //10 MATIC

  mapping(uint256 => NFTProperties) private tokenProperties;

  uint256 public immutable saleFinishTime;
  bool public nftSaleFinished;

  string private baseURI;

  constructor(
    uint256 _saleFinishTime,
    address vrfCoordinator,
    address linkToken,
    bytes32 keyHash,
    string memory nftBaseURI
  )
    ERC721("Estrella", "STAR")
    RandomGenerator(vrfCoordinator, linkToken, keyHash)
  {
    saleFinishTime = _saleFinishTime;
    baseURI = nftBaseURI;

    mintOriginalNFT();
  }

  function mintOriginalNFT() private {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(address(this), newItemId);
    tokenProperties[newItemId] = NFTDistribution.ORIGINAL;
  }

  function triggerOriginalGiveaway() external {
    require(hasNFTSaleFinished(), "NFT Sale has not finished yet");
    require(
      ownerOf(1) == address(this),
      "The original edition has already been given away"
    );

    super.requestRandomnessForGiveaway();
  }

  function originalGiveaway(uint256 randomness) internal override {
    uint256 winningToken = (randomness % _tokenIds.current()) + 1;

    //Transfer original NFT (id = 1)
    transferFrom(address(this), ownerOf(winningToken), 1);
  }

  function hasNFTSaleFinished() private returns (bool) {
    if (block.timestamp >= saleFinishTime) {
      nftSaleFinished = true;
    }

    return nftSaleFinished;
  }

  function mint(address recipient, uint256 amount) external payable {
    require(!hasNFTSaleFinished(), "NFT Sale has finished");
    require(
      msg.value >= amount * NFT_PRICE || _msgSender() == owner(),
      "Not enough MATIC sent to purchase the NFTs"
    );

    for (uint256 i = 0; i < amount; i++) {
      _tokenIds.increment();

      uint256 newItemId = _tokenIds.current();
      _mint(recipient, newItemId);

      super.requestReveal(newItemId);
    }
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function reveal(uint256 tokenId, uint256 randomness) internal override {
    NFTProperties memory properties = super.getRandomNFTProperty(randomness);
    tokenProperties[tokenId] = properties;

    _setTokenURI(
      tokenId,
      string(
        abi.encodePacked(
          properties.color1,
          "-",
          properties.color2,
          "-",
          properties.color3,
          ".png"
        )
      )
    );
  }
}
