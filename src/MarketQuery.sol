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
        uint256 price;
        uint256 tokenId;
        address nftAddress;
        address seller;
        uint64 listedAt;
    }

    struct RentalView {
        uint256 pricePerDay;
        uint256 expiresAt;
        uint256 tokenId;
        address nftAddress;
        address landlord;
        address tenant;
        bool active;
    }

    struct AuctionView {
        uint256 tokenId;
        address nftAddress;
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

    function getOffer(address nftAddress, uint256 tokenId) public view returns (Offer memory) {
        return sOffers[nftAddress][tokenId];
    }

    function getAuction(address nftAddress, uint256 tokenId) public view returns (Auction memory) {
        return sAuctions[nftAddress][tokenId];
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

    /*//////////////////////////////////////////////////////////////
                        RENTAL QUERIES
    //////////////////////////////////////////////////////////////*/

    function getTotalRentals() external view returns (uint256) {
        return sRentalTokens.length;
    }

    function getRentalToken(uint256 index) external view returns (ListedToken memory) {
        return sRentalTokens[index];
    }

    function getAllRentalTokens() external view returns (ListedToken[] memory) {
        return sRentalTokens;
    }

    function getRentals(uint256 offset, uint256 limit) external view returns (RentalView[] memory) {
        uint256 total = sRentalTokens.length;

        if (offset >= total) {
            return new RentalView[](0);
        }

        uint256 end = offset + limit;

        if (end > total) {
            end = total;
        }

        RentalView[] memory rentals = new RentalView[](end - offset);

        uint256 current = 0;

        for (uint256 i = offset; i < end;) {
            ListedToken memory token = sRentalTokens[i];

            Rental memory rental = sRentals[token.nftAddress][token.tokenId];

            rentals[current] = RentalView({
                nftAddress: token.nftAddress,
                tokenId: token.tokenId,
                landlord: rental.landlord,
                tenant: rental.tenant,
                pricePerDay: rental.pricePerDay,
                expiresAt: rental.expiresAt,
                active: rental.active
            });

            unchecked {
                ++current;
                ++i;
            }
        }

        return rentals;
    }

    function getRentalsByLandlord(address landlord) external view returns (RentalView[] memory) {
        uint256 total = sRentalTokens.length;

        uint256 count = 0;

        for (uint256 i; i < total;) {
            ListedToken memory token = sRentalTokens[i];

            if (sRentals[token.nftAddress][token.tokenId].landlord == landlord) {
                ++count;
            }

            unchecked {
                ++i;
            }
        }

        RentalView[] memory rentals = new RentalView[](count);

        uint256 current = 0;

        for (uint256 i; i < total;) {
            ListedToken memory token = sRentalTokens[i];

            Rental memory rental = sRentals[token.nftAddress][token.tokenId];

            if (rental.landlord == landlord) {
                rentals[current] = RentalView({
                    nftAddress: token.nftAddress,
                    tokenId: token.tokenId,
                    landlord: rental.landlord,
                    tenant: rental.tenant,
                    pricePerDay: rental.pricePerDay,
                    expiresAt: rental.expiresAt,
                    active: rental.active
                });

                unchecked {
                    ++current;
                }
            }

            unchecked {
                ++i;
            }
        }

        return rentals;
    }

    /*//////////////////////////////////////////////////////////////
                        AUCTION QUERIES
    //////////////////////////////////////////////////////////////*/

    function getTotalAuctions() external view returns (uint256) {
        return sAuctionTokens.length;
    }

    function getAuctionToken(uint256 index) external view returns (ListedToken memory) {
        return sAuctionTokens[index];
    }

    function getAllAuctionTokens() external view returns (ListedToken[] memory) {
        return sAuctionTokens;
    }

    function getAuctions(uint256 offset, uint256 limit) external view returns (AuctionView[] memory) {
        uint256 total = sAuctionTokens.length;

        if (offset >= total) {
            return new AuctionView[](0);
        }

        uint256 end = offset + limit;

        if (end > total) {
            end = total;
        }

        AuctionView[] memory auctions = new AuctionView[](end - offset);

        uint256 current = 0;

        for (uint256 i = offset; i < end;) {
            ListedToken memory token = sAuctionTokens[i];

            Auction memory auction = sAuctions[token.nftAddress][token.tokenId];

            auctions[current] = AuctionView({
                nftAddress: token.nftAddress,
                tokenId: token.tokenId,
                seller: auction.seller,
                highestBidder: auction.highestBidder,
                highestBid: auction.highestBid,
                startingPrice: auction.startingPrice,
                startTime: auction.startTime,
                endTime: auction.endTime,
                active: auction.active
            });

            unchecked {
                ++current;
                ++i;
            }
        }

        return auctions;
    }

    function getAuctionsBySeller(address seller) external view returns (AuctionView[] memory) {
        uint256 total = sAuctionTokens.length;

        uint256 count = 0;

        for (uint256 i; i < total;) {
            ListedToken memory token = sAuctionTokens[i];

            if (sAuctions[token.nftAddress][token.tokenId].seller == seller) {
                ++count;
            }

            unchecked {
                ++i;
            }
        }

        AuctionView[] memory auctions = new AuctionView[](count);

        uint256 current = 0;

        for (uint256 i; i < total;) {
            ListedToken memory token = sAuctionTokens[i];

            Auction memory auction = sAuctions[token.nftAddress][token.tokenId];

            if (auction.seller == seller) {
                auctions[current] = AuctionView({
                    nftAddress: token.nftAddress,
                    tokenId: token.tokenId,
                    seller: auction.seller,
                    highestBidder: auction.highestBidder,
                    highestBid: auction.highestBid,
                    startingPrice: auction.startingPrice,
                    startTime: auction.startTime,
                    endTime: auction.endTime,
                    active: auction.active
                });

                unchecked {
                    ++current;
                }
            }

            unchecked {
                ++i;
            }
        }

        return auctions;
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
