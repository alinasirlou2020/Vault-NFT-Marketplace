// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketInternal} from "./MarketInternal.sol";
import {MarketErrors} from "./MarketErrors.sol";

/// @title Marketplace Listing Module
/// @author Ali Nasirlou
/// @notice Handles NFT listings.
/// @dev Responsible only for listing operations.
abstract contract MarketListing is MarketAdmin, MarketInternal {
    /*//////////////////////////////////////////////////////////////
                            LIST NFT
    //////////////////////////////////////////////////////////////*/

    /// @notice Lists an NFT for sale.
    /// @param nftAddress NFT contract address.
    /// @param tokenId NFT token id.
    /// @param price Listing price in wei.
    function listItem(address nftAddress, uint256 tokenId, uint96 price) external whenNotPaused {
        _checkZeroAddress(nftAddress);
        _checkPrice(price);

        _checkOwner(nftAddress, tokenId, msg.sender);

        _checkNotListed(nftAddress, tokenId);

        _checkMarketplaceApproval(nftAddress, tokenId, msg.sender);

        _addListing(nftAddress, tokenId, price, msg.sender);

        emit ItemListed(msg.sender, nftAddress, tokenId, price, sListings[nftAddress][tokenId].listedAt);
    }

    /*//////////////////////////////////////////////////////////////
                        CANCEL LISTING
    //////////////////////////////////////////////////////////////*/

    /// @notice Cancels an active listing.
    /// @param nftAddress NFT contract address.
    /// @param tokenId NFT token id.
    function cancelListing(address nftAddress, uint256 tokenId) external whenNotPaused {
        _checkListed(nftAddress, tokenId);

        Listing storage listing = sListings[nftAddress][tokenId];

        if (listing.seller != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        _removeListing(nftAddress, tokenId);

        emit ItemCanceled(msg.sender, nftAddress, tokenId);

        emit ListingRemoved(msg.sender, nftAddress, tokenId, ListingRemovalReason.SellerCancelled);
    }

    /*//////////////////////////////////////////////////////////////
                        UPDATE LISTING PRICE
    //////////////////////////////////////////////////////////////*/

    function updateListingPrice(address nftAddress, uint256 tokenId, uint96 newPrice) external whenNotPaused {
        _checkPrice(newPrice);

        _checkListed(nftAddress, tokenId);

        Listing storage listing = sListings[nftAddress][tokenId];

        if (listing.seller != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        uint256 oldPrice = listing.price;

        listing.price = newPrice;

        emit ItemPriceUpdated(msg.sender, nftAddress, tokenId, oldPrice, newPrice);
    }
}
