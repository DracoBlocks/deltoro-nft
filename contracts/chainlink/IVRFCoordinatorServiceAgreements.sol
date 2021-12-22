pragma solidity ^0.8.4;

// SPDX-License-Identifier: MIT

interface IVRFCoordinatorServiceAgreements {
  struct ServiceAgreement {
    // Tracks oracle commitments to VRF service
    address vRFOracle; // Oracle committing to respond with VRF service
    uint96 fee; // Minimum payment for oracle response. Total LINK=1e9*1e18<2^96
    bytes32 jobID; // ID of corresponding chainlink job in oracle's DB
  }

  function serviceAgreements(
    bytes32 /* provingKey */
  ) external returns (ServiceAgreement calldata);
}
