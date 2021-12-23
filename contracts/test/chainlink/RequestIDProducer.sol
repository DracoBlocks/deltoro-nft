pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

import "@chainlink/contracts/src/v0.8/VRFRequestIDBase.sol";

contract RequestIDProducer is VRFRequestIDBase {
  uint256 private constant USER_SEED_PLACEHOLDER = 0;

  function getRequestId(
    bytes32 _keyHash,
    address targetContract,
    uint256 requestNumber
  ) external pure returns (bytes32 requestId) {
    uint256 vRFSeed = makeVRFInputSeed(
      _keyHash,
      USER_SEED_PLACEHOLDER,
      targetContract,
      requestNumber
    );
    return makeRequestId(_keyHash, vRFSeed);
  }
}
