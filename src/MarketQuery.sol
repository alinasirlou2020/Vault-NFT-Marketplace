// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {MarketplaceStorage} from "./MarketplaceStorage.sol";

/// @title Marketplace Query Module
/// @author Ali Nasirlou
/// @notice Read-only view functions for the marketplace.
/// @dev Contains no business logic.
abstract contract MarketQuery is MarketplaceStorage {
    /*//////////////////////////////////////////////////////////////
                            VIEW STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct ListingView {
        // gas-struct-packing
        uint256 price; // 32 bytes
        uint256 tokenId; // 32 bytes
        address nftAddress; // 20 bytes
        address seller; // 20 bytes
        uint64 listedAt; // 8 bytes
    }

    /*//////////////////////////////////////////////////////////////
                        RESERVED VIEW STRUCTS
    //////////////////////////////////////////////////////////////*/

    /// @dev Reserved for future paginated query responses
    struct RentalView {
        uint256 pricePerDay;
        uint256 expiresAt;
        uint256 tokenId;
        address nftAddress;
        address landlord;
        address tenant;
        bool active;
    }

    /// @dev Reserved for future paginated query responses
    struct AuctionView {
        address seller;
        address highestBidder;
        uint96 highestBid;
        uint96 startingPrice;
        uint64 startTime;
        uint64 endTime;
        bool active;
    }

    /*//////////////////////////////////////////////////////////////
                            SINGLE GETTERS
    //////////////////////////////////////////////////////////////*/

    function getListing(address nftAddress, uint256 tokenId) public view returns (Listing memory) {
        return sListings[nftAddress][tokenId];
    }

    function getRental(address nftAddress, uint256 tokenId) public view returns (Rental memory) {
        return sRentals[nftAddress][tokenId];
    }

    function getProceeds(address account) public view returns (uint256) {
        return sProceeds[account];
    }

    /*//////////////////////////////////////////////////////////////
                        LISTING QUERIES
    //////////////////////////////////////////////////////////////*/

    function getTotalListings() external view returns (uint256) {
        return sListingTokens.length;
    }

    function getListingToken(uint256 index) external view returns (ListedToken memory) {
        return sListingTokens[index];
    }

    function getAllListingTokens() external view returns (ListedToken[] memory) {
        return sListingTokens;
    }

    function getListings(uint256 offset, uint256 limit) external view returns (ListingView[] memory) {
        uint256 total = sListingTokens.length;
        
        // solhint-disable-next-line gas-strict-inequalities
        if (offset >= total) {
            return new ListingView[](0);
        }

        uint256 end = offset + limit;

        if (end > total) {
            end = total;
        }

        ListingView[] memory listings = new ListingView[](end - offset);

        uint256 current = 0;

        for (uint256 i = offset; i < end;) {
            ListedToken memory token = sListingTokens[i];

            Listing memory listing = sListings[token.nftAddress][token.tokenId];

            listings[current] = ListingView({
                nftAddress: token.nftAddress,
                tokenId: token.tokenId,
                seller: listing.seller,
                price: listing.price,
                listedAt: listing.listedAt
            });

            unchecked {
                ++current;
                ++i;
            }
        }

        return listings;
    }

    function getListingsBySeller(address seller) external view returns (ListingView[] memory) {
        uint256 total = sListingTokens.length;

        uint256 count = 0;

        for (uint256 i; i < total;) {
            ListedToken memory token = sListingTokens[i];

            if (sListings[token.nftAddress][token.tokenId].seller == seller) {
                ++count;
            }

            unchecked {
                ++i;
            }
        }

        ListingView[] memory listings = new ListingView[](count);

        uint256 current = 0;

        for (uint256 i; i < total;) {
            ListedToken memory token = sListingTokens[i];

            Listing memory listing = sListings[token.nftAddress][token.tokenId];

            if (listing.seller == seller) {
                listings[current] = ListingView({
                    nftAddress: token.nftAddress,
                    tokenId: token.tokenId,
                    seller: listing.seller,
                    price: listing.price,
                    listedAt: listing.listedAt
                });

                unchecked {
                    ++current;
                }
            }

            unchecked {
                ++i;
            }
        }

        return listings;
    }

    struct MarketplaceInfo {
        uint256 totalListings;
        uint96 marketplaceFee;
        address feeRecipient;
    }

    function getMarketplaceInfo() external view returns (MarketplaceInfo memory) {
        return MarketplaceInfo({
            totalListings: sListingTokens.length, marketplaceFee: sMarketplaceFee, feeRecipient: sFeeRecipient
        });
    }

    function getOffer(address nftAddress, uint256 tokenId) public view returns (Offer memory) {
        return sOffers[nftAddress][tokenId];
    }

    function getAuction(address nftAddress, uint256 tokenId) public view returns (Auction memory) {
        return sAuctions[nftAddress][tokenId];
    }

    function isAuctionActive(address nftAddress, uint256 tokenId) public view returns (bool) {
        return sAuctions[nftAddress][tokenId].active;
    }

    function getHighestBid(address nftAddress, uint256 tokenId) public view returns (uint256) {
        return sAuctions[nftAddress][tokenId].highestBid;
    }

    function getHighestBidder(address nftAddress, uint256 tokenId) public view returns (address) {
        return sAuctions[nftAddress][tokenId].highestBidder;
    }

    function getAuctionEndTime(address nftAddress, uint256 tokenId) public view returns (uint256) {
        return sAuctions[nftAddress][tokenId].endTime;
    }
}
