// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketInternal} from "./MarketInternal.sol";
import {MarketErrors} from "./MarketErrors.sol";

/// @title Marketplace Purchase Module
/// @author Ali Nasirlou
/// @notice Handles NFT purchases.
abstract contract MarketPurchase is MarketAdmin, MarketInternal, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                            BUY NFT
    //////////////////////////////////////////////////////////////*/

    function buyItem(address nftAddress, uint256 tokenId) external payable nonReentrant whenNotPaused {
        if (nftAddress == address(0)) revert MarketErrors.ZeroAddress();
        _checkListed(nftAddress, tokenId);

        Listing memory listing = sListings[nftAddress][tokenId];

        _checkSelfPurchase(listing.seller, msg.sender);

        _checkPurchasePrice(listing.price, msg.value);

        uint256 marketplaceFee = _calculateMarketplaceFee(listing.price);

        uint256 sellerAmount = listing.price - marketplaceFee;

        _removeListing(nftAddress, tokenId);

        _addProceeds(listing.seller, sellerAmount);

        _addProceeds(sFeeRecipient, marketplaceFee);

        _transferNFT(nftAddress, listing.seller, msg.sender, tokenId);

        _refundExcess(msg.sender, msg.value, listing.price);

        emit ListingRemoved(listing.seller, nftAddress, tokenId, ListingRemovalReason.Sold);

        emit ProceedsAdded(listing.seller, sellerAmount);

        emit ProceedsAdded(sFeeRecipient, marketplaceFee);

        emit ItemBought(msg.sender, listing.seller, nftAddress, tokenId, listing.price, marketplaceFee);
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAW PROCEEDS
    //////////////////////////////////////////////////////////////*/

    /// @notice Withdraw accumulated proceeds.
    /// @dev Uses the Pull Payment pattern.
    function withdrawProceeds() external nonReentrant {
        if (msg.sender == address(0)) revert MarketErrors.ZeroAddress();
        uint256 amount = sProceeds[msg.sender];

        if (amount == 0) {
            revert MarketErrors.NoProceeds();
        }

        // Effects
        sProceeds[msg.sender] = 0;

        // Interaction
        (bool success,) = payable(msg.sender).call{value: amount}("");

        if (!success) {
            sProceeds[msg.sender] = amount;
            revert MarketErrors.TransferFailed();
        }

        emit ProceedsWithdrawn(msg.sender, amount);
    }
}
