pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./RandomGenerator.sol";
import "./NFTDistribution.sol";

contract PalmaNFT is
  RandomGenerator,
  NFTDistribution,
  ERC721Enumerable,
  Ownable
{
  using Strings for uint256;
  uint256 public lastTokenId;
  uint256 public lastMinted;
  uint256 public tokensBurned;

  uint256 public NFT_PRICE = 8 * 10**18;

  event Reveal(uint256 tokenId, uint256 seed);
  event PermanentURI(string _value, uint256 indexed _id);

  mapping(uint256 => NFTProperties) public tokenProperties;

  uint256 public immutable saleFinishTime;
  bool public nftSaleFinished;

  string public baseURI;

  constructor(
    uint256 _saleFinishTime,
    string memory ipfsMetadataFolderCid,
    address vrfCoordinator,
    address linkToken,
    bytes32 keyHash
  )
    ERC721("Estrella sobre un volcan dormido", "PALMA")
    RandomGenerator(vrfCoordinator, linkToken, keyHash)
  {
    saleFinishTime = _saleFinishTime;
    baseURI = string(abi.encodePacked("ipfs://", ipfsMetadataFolderCid, "/"));

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

  function _burn(uint256 tokenId) internal virtual override {
    super._burn(tokenId);
    delete tokenProperties[tokenId];
    tokensBurned++;
  }

  function burn(uint256 tokenId) external onlyOwner {
    _burn(tokenId);
  }

  function withdraw() external {
    payable(owner()).transfer(address(this).balance);
  }

  function withdrawToken(address token) external {
    IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
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
    require(_exists(tokenId), "PalmaNFT: URI query for nonexistent token");

    NFTProperties memory properties = tokenProperties[tokenId];
    string memory _tokenURI = string(
      abi.encodePacked(
        properties.color1,
        "-",
        properties.color2,
        "-",
        properties.color3,
        ".json"
      )
    );
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
    emit PermanentURI(tokenURI(tokenId), tokenId);
  }

  struct PublicInfo {
    uint256 lastTokenId;
    uint256 lastMinted;
    uint256 tokensBurned;
    uint256 nftPrice;
    uint256 saleFinishTime;
    bool nftSaleFinished;
    string baseURI;
  }

  //Returns all available public information in a single call
  function getPublicInfo() external view returns (PublicInfo memory) {
    return
      PublicInfo(
        lastTokenId,
        lastMinted,
        tokensBurned,
        NFT_PRICE,
        saleFinishTime,
        nftSaleFinished,
        baseURI
      );
  }

  struct NFTProps {
    uint256 id;
    string tokenURI;
    NFTProperties properties;
  }

  function getAllOwnedNFTs(address account)
    external
    view
    returns (NFTProps[] memory result)
  {
    uint256 tokensOwned = balanceOf(account);
    result = new NFTProps[](tokensOwned);
    for (uint256 i; i < tokensOwned; i++) {
      uint256 tokenId = tokenOfOwnerByIndex(account, i);
      result[i] = NFTProps(
        tokenId,
        tokenURI(tokenId),
        tokenProperties[tokenId]
      );
    }
  }

  /**
    Created in case the price needs to be adjusted due to big fluctuations in MATIC price
   */
  function setNFTPrice(uint256 newPrice) external onlyOwner {
    NFT_PRICE = newPrice;
  }
}
