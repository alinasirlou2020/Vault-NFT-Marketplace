// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {MarketValidation} from "./MarketValidation.sol";
import {MarketErrors} from "./MarketErrors.sol";
import {MarketEvents} from "./MarketEvents.sol";

/// @title Marketplace Internal Module
/// @author Ali Nasirlou
/// @notice Contains reusable internal marketplace logic.
/// @dev Shared by Listing, Purchase, Rent, Auction and Offer modules.
abstract contract MarketInternal is MarketValidation, MarketEvents {
    /*//////////////////////////////////////////////////////////////
                            LISTING
    //////////////////////////////////////////////////////////////*/

    function _addListing(address nftAddress, uint256 tokenId, uint96 price, address seller) internal {
        sListingTokens.push(ListedToken({nftAddress: nftAddress, tokenId: tokenId}));

        sListings[nftAddress][tokenId] = Listing({
            seller: seller,
            price: price,
            listedAt: uint64(block.timestamp),
            index: uint32(sListingTokens.length - 1),
            active: true
        });
    }

    function _removeListing(address nftAddress, uint256 tokenId) internal {
        uint256 index = sListings[nftAddress][tokenId].index;
        uint256 lastIndex = sListingTokens.length - 1;

        if (index != lastIndex) {
            ListedToken memory lastToken = sListingTokens[lastIndex];

            sListingTokens[index] = lastToken;

            // forge-lint: disable-next-line(unsafe-typecast)
            sListings[lastToken.nftAddress][lastToken.tokenId].index = uint32(index);
        }

        sListingTokens.pop();

        delete sListings[nftAddress][tokenId];
    }

    /*//////////////////////////////////////////////////////////////
                            RENTAL
    //////////////////////////////////////////////////////////////*/

    function _addRentalToken(address nftAddress, uint256 tokenId) internal {
        sRentalTokens.push(ListedToken({nftAddress: nftAddress, tokenId: tokenId}));

        sRentals[nftAddress][tokenId].index = uint32(sRentalTokens.length - 1);
    }

    function _removeRentalToken(address nftAddress, uint256 tokenId) internal {
        uint256 index = sRentals[nftAddress][tokenId].index;
        uint256 lastIndex = sRentalTokens.length - 1;

        if (index != lastIndex) {
            ListedToken memory lastToken = sRentalTokens[lastIndex];

            sRentalTokens[index] = lastToken;

            // forge-lint: disable-next-line(unsafe-typecast)
            sRentals[lastToken.nftAddress][lastToken.tokenId].index = uint32(index);
        }

        sRentalTokens.pop();
    }

    /*//////////////////////////////////////////////////////////////
                            AUCTION
    //////////////////////////////////////////////////////////////*/

    function _addAuctionToken(address nftAddress, uint256 tokenId) internal {
        sAuctionTokens.push(ListedToken({nftAddress: nftAddress, tokenId: tokenId}));

        sAuctions[nftAddress][tokenId].index = uint32(sAuctionTokens.length - 1);
    }

    function _removeAuctionToken(address nftAddress, uint256 tokenId) internal {
        uint256 index = sAuctions[nftAddress][tokenId].index;
        uint256 lastIndex = sAuctionTokens.length - 1;

        if (index != lastIndex) {
            ListedToken memory lastToken = sAuctionTokens[lastIndex];

            sAuctionTokens[index] = lastToken;

            // forge-lint: disable-next-line(unsafe-typecast)
            sAuctions[lastToken.nftAddress][lastToken.tokenId].index = uint32(index);
        }

        sAuctionTokens.pop();
    }

    /*//////////////////////////////////////////////////////////////
                    OWNERSHIP-CHANGE CLEANUP
    //////////////////////////////////////////////////////////////*/

    /// @notice Invalidates any other listing type for a token whose ownership is
    /// about to change via a direct sale (buyItem) or an accepted offer, so they
    /// don't linger on-chain referencing a seller/landlord who no longer owns it.
    /// @dev - An active auction is always cancelled here. If it already has a bid,
    ///        the highest bidder is refunded via their proceeds balance first —
    ///        otherwise their ETH would become permanently stuck, since a stale
    ///        auction's `endAuction` would forever revert on the ownership check
    ///        inside `_transferNFT` once the seller no longer holds the NFT.
    ///      - An available (not-currently-rented) rental listing is removed the
    ///        same way, since it's just a dangling listing with no funds involved.
    ///      - A rental that is currently in progress is deliberately left alone:
    ///        the tenant already paid for and is using that period, and anyone
    ///        can permissionlessly finalize it later via `endRental` once it expires.
    function _invalidateOtherListings(address nftAddress, uint256 tokenId) internal {
        Auction storage auction = sAuctions[nftAddress][tokenId];

        if (auction.active) {
            address seller = auction.seller;

            if (auction.highestBidder != address(0)) {
                _addProceeds(auction.highestBidder, auction.highestBid);
                emit ProceedsAdded(auction.highestBidder, auction.highestBid);
            }

            _removeAuctionToken(nftAddress, tokenId);
            delete sAuctions[nftAddress][tokenId];

            emit AuctionCancelled(seller, nftAddress, tokenId);
        }

        Rental storage rental = sRentals[nftAddress][tokenId];

        bool isCurrentlyRented = rental.active && rental.tenant != address(0) && block.timestamp < rental.expiresAt;

        if (rental.active && !isCurrentlyRented) {
            address landlord = rental.landlord;

            _removeRentalToken(nftAddress, tokenId);
            delete sRentals[nftAddress][tokenId];

            emit RentalEnded(landlord, address(0), nftAddress, tokenId);
        }
    }

    /*//////////////////////////////////////////////////////////////
                            PAYMENTS
    //////////////////////////////////////////////////////////////*/

    function _calculateMarketplaceFee(uint256 salePrice) internal view returns (uint256) {
        return (salePrice * sMarketplaceFee) / 1e4;
    }

    function _addProceeds(address account, uint256 amount) internal {
        if (amount == 0) return;

        sProceeds[account] += amount;
    }

    function _refundExcess(address buyer, uint256 paid, uint256 required) internal {
        uint256 refund = paid - required;

        if (refund == 0) return;

        (bool success,) = payable(buyer).call{value: refund}("");

        if (!success) {
            revert MarketErrors.TransferFailed();
        }
    }

    /*//////////////////////////////////////////////////////////////
                            NFT TRANSFER
    //////////////////////////////////////////////////////////////*/

    function _transferNFT(address nftAddress, address from, address to, uint256 tokenId) internal {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        if (!(msg.sender == owner || IERC721(nftAddress).getApproved(tokenId) == msg.sender
                    || IERC721(nftAddress).isApprovedForAll(owner, msg.sender))) {
            revert MarketErrors.NotOwnerNorApproved();
        }
        IERC721(nftAddress).safeTransferFrom(from, to, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                            AUCTION HELPERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Credits the previous highest bidder for withdrawal.
    function _refundPreviousBidder(address bidder, uint256 amount) internal {
        _addProceeds(bidder, amount);
    }
}
