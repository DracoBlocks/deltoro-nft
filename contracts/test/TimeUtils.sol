pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

contract TimeUtils {
  function getTimestamp() external view returns (uint256) {
    return block.timestamp;
  }
}
