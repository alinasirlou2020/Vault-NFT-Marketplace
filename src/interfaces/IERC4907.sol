// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IERC4907 is IERC165 {
    /// @notice set user and expires of NFT
    function setUser(uint256 tokenId, address user, uint64 expires) external;

    /// @notice get current user
    function userOf(uint256 tokenId) external view returns (address);

    /// @notice get expire timestamp
    function userExpires(uint256 tokenId) external view returns (uint256);

    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 indexed expires);
}
