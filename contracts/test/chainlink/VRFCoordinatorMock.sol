// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFCoordinatorMock {
  LinkTokenInterface public LINK;

  uint256 public lastRequestId;

  struct ServiceAgreement {
    // Tracks oracle commitments to VRF service
    address vRFOracle; // Oracle committing to respond with VRF service
    uint96 fee; // Minimum payment for oracle response. Total LINK=1e9*1e18<2^96
    bytes32 jobID; // ID of corresponding chainlink job in oracle's DB
  }

  mapping(bytes32 => ServiceAgreement) /* provingKey */
    public serviceAgreements;

  event RandomnessRequest(
    address indexed sender,
    bytes32 indexed keyHash,
    uint256 indexed seed
  );

  constructor(address linkAddress) {
    LINK = LinkTokenInterface(linkAddress);
  }

  function onTokenTransfer(
    address sender,
    uint256, //fee
    bytes memory _data
  ) public onlyLINK {
    (bytes32 keyHash, uint256 seed) = abi.decode(_data, (bytes32, uint256));
    emit RandomnessRequest(sender, keyHash, seed);
  }

  function callBackWithRandomness(
    bytes32 requestId,
    uint256 randomness,
    address consumerContract
  ) public {
    VRFConsumerBase v;
    bytes memory resp = abi.encodeWithSelector(
      v.rawFulfillRandomness.selector,
      requestId,
      randomness
    );
    uint256 b = 206000;
    require(gasleft() >= b, "not enough gas for consumer");
    (bool success, ) = consumerContract.call(resp);
    if (!success) {
      revert("Call with randomness to contract has failed");
    }
  }

  modifier onlyLINK() {
    require(msg.sender == address(LINK), "Must use LINK token");
    _;
  }
}
