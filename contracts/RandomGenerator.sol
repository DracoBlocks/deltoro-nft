pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./chainlink/IVRFCoordinatorServiceAgreements.sol";
import "./EstrellaNFT.sol";

abstract contract RandomGenerator is VRFConsumerBase {
  bytes32 public immutable keyHash;
  uint256 public immutable fee;

  mapping(bytes32 => uint256) requestIdToTokenId;
  bytes32 giveawayRequestId;

  constructor(
    address _vrfCoordinator,
    address _linkToken,
    bytes32 _keyHash
  ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
    keyHash = _keyHash;
    IVRFCoordinatorServiceAgreements agreements = IVRFCoordinatorServiceAgreements(
        _vrfCoordinator
      );
    fee = agreements.serviceAgreements(_keyHash).fee;
  }

  function requestReveal(uint256 tokenId) internal returns (bytes32 requestId) {
    require(
      LINK.balanceOf(address(this)) >= fee,
      "Not enough LINK - need to fill contract with LINK"
    );
    requestId = requestRandomness(keyHash, fee);
    requestIdToTokenId[requestId] = tokenId;
  }

  function requestRandomnessForGiveaway() internal returns (bytes32 requestId) {
    require(giveawayRequestId == 0, "The giveway has been triggered already");
    require(
      LINK.balanceOf(address(this)) >= fee,
      "Not enough LINK - need to fill contract with LINK"
    );
    requestId = requestRandomness(keyHash, fee);
    giveawayRequestId = requestId;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness)
    internal
    override
  {
    if (requestId == giveawayRequestId) {
      originalGiveaway(randomness);
    } else {
      uint256 myTokenId = requestIdToTokenId[requestId];
      reveal(myTokenId, randomness);
    }
  }

  function reveal(uint256 tokenId, uint256 randomness) internal virtual;

  function originalGiveaway(uint256 randomness) internal virtual;
}
