// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {MarketplaceStorage} from "./MarketplaceStorage.sol";
import {MarketErrors} from "./MarketErrors.sol";
import {IERC4907} from "./interfaces/IERC4907.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/// @title Marketplace Validation Module
/// @author Ali Nasirlou
/// @notice Shared validation logic for all marketplace modules.
/// @dev Contains reusable validation functions. No business logic.
abstract contract MarketValidation is MarketplaceStorage {
    /*//////////////////////////////////////////////////////////////
                        GENERAL VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkZeroAddress(address account) internal pure {
        if (account == address(0)) {
            revert MarketErrors.ZeroAddress();
        }
    }

    function _checkPrice(uint256 price) internal pure {
        if (price == 0) {
            revert MarketErrors.ZeroPrice();
        }
    }

    function _checkDuration(uint256 duration) internal pure {
        if (duration == 0) {
            revert MarketErrors.InvalidDuration();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        NFT VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkOwner(address nftAddress, uint256 tokenId, address account) internal view {
        if (IERC721(nftAddress).ownerOf(tokenId) != account) {
            revert MarketErrors.NotOwner();
        }
    }

    function _checkMarketplaceApproval(address nftAddress, uint256 tokenId, address owner) internal view {
        IERC721 nft = IERC721(nftAddress);

        bool approved = nft.getApproved(tokenId) == address(this) || 

            nft.isApprovedForAll(owner, address(this));

        if (!approved) {
            revert MarketErrors.NotApproved();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        LISTING VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkListed(address nftAddress, uint256 tokenId) internal view {
        if (sListings[nftAddress][tokenId].active) {
            revert MarketErrors.NotListed();
        }
    }

    function _checkNotListed(address nftAddress, uint256 tokenId) internal view {
        if (sListings[nftAddress][tokenId].active) {
            revert MarketErrors.AlreadyListed();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        PURCHASE VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkPurchasePrice(uint256 requiredPrice, uint256 sentValue) internal pure {
        if (sentValue < requiredPrice) {
            revert MarketErrors.PriceNotMet(requiredPrice, sentValue);
        }
    }

    function _checkSelfPurchase(address seller, address buyer) internal pure {
        if (seller == buyer) {
            revert MarketErrors.SelfPurchase();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        RENT VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkRentalActive(address nftAddress, uint256 tokenId) internal view {
        if (!sRentals[nftAddress][tokenId].active) {
            revert MarketErrors.RentalNotActive();
        }
    }

    function _checkRentalNotActive(address nftAddress, uint256 tokenId) internal view {
        if (sRentals[nftAddress][tokenId].active) {
            revert MarketErrors.AlreadyRented();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        OFFER VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkOfferExists(address nftAddress, uint256 tokenId) internal view {
        if (!sOffers[nftAddress][tokenId].active) {
            revert MarketErrors.OfferNotFound();
        }
    }

    function _checkOfferActive(address nftAddress, uint256 tokenId) internal view {
        Offer storage offer = sOffers[nftAddress][tokenId];

        if (!offer.active) {
            revert MarketErrors.OfferNotFound();
        }

        if (offer.expiresAt < block.timestamp) {
            revert MarketErrors.OfferExpired();
        }
    }

    /*//////////////////////////////////////////////////////////////
                        AUCTION VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _checkAuctionExists(address nftAddress, uint256 tokenId) internal view {
        if (!sAuctions[nftAddress][tokenId].active) {
            revert MarketErrors.AuctionNotFound();
        }
    }

    function _checkAuctionNotExists(address nftAddress, uint256 tokenId) internal view {
        if (sAuctions[nftAddress][tokenId].active) {
            revert MarketErrors.AuctionAlreadyExists();
        }
    }

    /*//////////////////////////////////////////////////////////////
                    INTERFACE VALIDATIONS
    //////////////////////////////////////////////////////////////*/

    function _supportsERC4907(address nft) internal view returns (bool) {
        return IERC165(nft).supportsInterface(type(IERC4907).interfaceId);
    }
}
