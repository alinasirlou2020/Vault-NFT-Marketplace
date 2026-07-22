// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title MarketplaceStorage
/// @author Ali Nasirlou
/// @notice Stores all marketplace state variables.
/// @dev This contract should NEVER contain business logic.
/// Every marketplace module inherits from this contract.
abstract contract MarketplaceStorage {
    /*//////////////////////////////////////////////////////////////
                              STRUCTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Stores an active marketplace listing.
    struct Listing {
        address seller;
        uint256 price;
        uint64 listedAt;
        uint32 index;
        bool active;
    }

    /// @notice Stores NFT identifier used inside listing arrays.
    struct ListedToken {
        address nftAddress;
        uint256 tokenId;
    }

    /// @notice Rental information.
    struct Rental {
        address landlord;
        address tenant;
        uint96 pricePerDay;
        uint64 startedAt;
        uint64 expiresAt;
        bool active;
        bool useERC4907;
    }

    struct Offer {
        address buyer;
        uint96 amount;
        uint64 expiresAt;
        bool active;
    }

    struct Auction {
        address seller;
        address highestBidder;
        uint96 highestBid;
        uint96 startingPrice;
        uint64 startTime;
        uint64 endTime;
        bool active;
    }

    /*//////////////////////////////////////////////////////////////
                              LISTINGS
    //////////////////////////////////////////////////////////////*/

    /// @notice nft => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) internal sListings;

    /// @notice Array of all active listings.
    ListedToken[] internal sListingTokens;

    /*//////////////////////////////////////////////////////////////
                              RENTALS
    //////////////////////////////////////////////////////////////*/

    /// @notice nft => tokenId => Rental
    mapping(address => mapping(uint256 => Rental)) internal sRentals;

    /*//////////////////////////////////////////////////////////////
                              PAYMENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice User withdrawable balances.
    mapping(address => uint256) internal sProceeds;

    /*//////////////////////////////////////////////////////////////
                                OFFERS
    //////////////////////////////////////////////////////////////*/

    mapping(address => mapping(uint256 => Offer)) internal sOffers;

    /*//////////////////////////////////////////////////////////////
                                Auctions
    //////////////////////////////////////////////////////////////*/

    mapping(address => mapping(uint256 => Auction)) internal sAuctions;

    /*//////////////////////////////////////////////////////////////
                        MARKETPLACE CONFIGURATION
    //////////////////////////////////////////////////////////////*/

    uint96 internal sMarketplaceFee;

    uint96 internal constant MAX_FEE = 1000; // 10%

    address internal sFeeRecipient;
}
