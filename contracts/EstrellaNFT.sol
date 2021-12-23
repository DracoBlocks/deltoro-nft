pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomGenerator.sol";
import "./NFTDistribution.sol";

contract EstrellaNFT is
  RandomGenerator,
  NFTDistribution,
  ERC721Enumerable,
  Ownable
{
  using Strings for uint256;
  uint256 public lastTokenId;
  uint256 public lastMinted;

  uint256 public constant NFT_PRICE = 10 * 10**18; //10 MATIC

  event Reveal(uint256 tokenId, uint256 seed);

  mapping(uint256 => NFTProperties) public tokenProperties;

  uint256 public immutable saleFinishTime;
  bool public nftSaleFinished;

  string public baseURI;

  constructor(
    uint256 _saleFinishTime,
    address vrfCoordinator,
    address linkToken,
    bytes32 keyHash
  )
    ERC721("Estrella", "STAR")
    RandomGenerator(vrfCoordinator, linkToken, keyHash)
  {
    saleFinishTime = _saleFinishTime;
    baseURI = "ipfs://";

    mintOriginalNFT();
  }

  function mintOriginalNFT() private {
    uint256 newItemId = ++lastTokenId;
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
    //We exclude the contract itself from ever winning the original NFT
    uint256 winningToken = (randomness % (lastTokenId - 1)) + 2;

    //Transfer original NFT (id = 1)
    _transfer(address(this), ownerOf(winningToken), 1);
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
    require(
      amount <= 1000,
      "Cannot mint more than 1000 tokens in one transaction"
    );

    for (uint256 i = 0; i < amount; i++) {
      uint256 newItemId = ++lastTokenId;
      _mint(recipient, newItemId);

      super.requestReveal(newItemId);
    }
  }

  function _mint(address to, uint256 tokenId) internal override {
    super._mint(to, tokenId);
    lastMinted = block.timestamp;
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(_exists(tokenId), "EstrellaNFT: URI query for nonexistent token");

    NFTProperties memory properties = tokenProperties[tokenId];
    string memory _tokenURI = properties.cid;
    string memory base = _baseURI();

    // If there is no base URI, return the token URI.
    if (bytes(base).length == 0) {
      return _tokenURI;
    }
    // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(base, _tokenURI));
    }

    return super.tokenURI(tokenId);
  }

  function reveal(uint256 tokenId, uint256 randomness) internal override {
    NFTProperties memory properties = super.getRandomNFTProperty(randomness);
    tokenProperties[tokenId] = properties;
    emit Reveal(tokenId, randomness);
  }
}
