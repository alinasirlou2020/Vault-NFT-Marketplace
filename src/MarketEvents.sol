// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title Marketplace Events
/// @author Ali Nasirlou
/// @notice Contains all events emitted by the Marketplace.
/// @dev This contract only declares events and contains no business logic.
abstract contract MarketEvents {
    /*//////////////////////////////////////////////////////////////
                           LISTING EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when an NFT is listed for sale.
    event ItemListed(
        address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price, uint256 listedAt
    );

    /// @notice Emitted when a seller updates the listing price.
    event ItemPriceUpdated(
        address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice
    );

    /// @notice Emitted when a seller manually cancels a listing.
    event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    /// @notice Emitted whenever a listing is removed for any reason.
    /// @dev reason examples:
    /// 0 = Sold
    /// 1 = Seller Cancelled
    /// 2 = Admin Removed
    /// 3 = Burned
    /// 4 = Expired
    enum ListingRemovalReason {
        Sold,
        SellerCancelled,
        AdminRemoved,
        Burned,
        Expired
    }

    event ListingRemoved(
        address indexed seller, address indexed nftAddress, uint256 indexed tokenId, ListingRemovalReason reason
    );

    /// @notice Emitted when an NFT is purchased.
    event ItemBought(
        address indexed buyer,
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 salePrice,
        uint256 marketplaceFee
    );

    /*//////////////////////////////////////////////////////////////
                            RENT EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when an NFT is listed for rent.
    event RentalListed(
        address indexed landlord, address indexed nftAddress, uint256 indexed tokenId, uint256 pricePerDay
    );

    /// @notice Emitted when a rental price changes.
    event RentalPriceUpdated(
        address indexed landlord,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 oldPrice,
        uint256 newPrice
    );

    /// @notice Emitted when an NFT is rented.
    event ItemRented(
        address indexed landlord,
        address indexed tenant,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 durationInDays,
        uint256 totalPrice,
        uint256 expiresAt
    );

    /// @notice Emitted when a rental ends.
    event RentalEnded(address indexed landlord, address indexed tenant, address indexed nftAddress, uint256 tokenId);

    /*//////////////////////////////////////////////////////////////
                            OFFER EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a buyer creates an offer.
    event OfferCreated(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 offerPrice,
        uint256 expiresAt
    );

    /// @notice Emitted when a seller accepts an offer.
    event OfferAccepted(
        address indexed seller,
        address indexed buyer,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 offerPrice,
        uint256 marketplaceFee
    );

    event OfferUpdated(
        address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice
    );

    /// @notice Emitted when a buyer cancels an offer.
    event OfferCancelled(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId);

    /*//////////////////////////////////////////////////////////////
                           AUCTION EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when an auction starts.
    event AuctionCreated(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 startingPrice,
        uint256 startTime,
        uint256 endTime
    );

    /// @notice Emitted whenever someone places a bid.
    event BidPlaced(
        address indexed bidder,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 bidAmount,
        uint256 highestBid
    );

    event AuctionCancelled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    /// @notice Emitted when an auction is finalized.
    event AuctionEnded(
        address indexed seller,
        address indexed winner,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 winningBid,
        uint256 marketplaceFee
    );

    /*//////////////////////////////////////////////////////////////
                            ADMIN EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when marketplace fee changes.
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);

    /// @notice Emitted whenever proceeds are withdrawn.
    event ProceedsWithdrawn(address indexed account, uint256 amount);

    event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);

    event ProceedsAdded(address indexed account, uint256 amount);

    event NFTTransferred(address indexed nftAddress, uint256 indexed tokenId, address indexed from, address to);

    event MarketplacePaused(address indexed account);

    event MarketplaceUnpaused(address indexed account);
}
