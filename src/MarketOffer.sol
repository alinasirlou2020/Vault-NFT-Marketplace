// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketInternal} from "./MarketInternal.sol";
import {MarketErrors} from "./MarketErrors.sol";

/// @title Marketplace Offer Module
/// @author Ali Nasirlou
/// @notice Handles NFT offers.
/// @dev Buyers can make, cancel and sellers can accept offers.
abstract contract MarketOffer is MarketAdmin, MarketInternal, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                            MAKE OFFER
    //////////////////////////////////////////////////////////////*/

    function makeOffer(address nftAddress, uint256 tokenId, uint96 amount, uint64 duration)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        _checkZeroAddress(nftAddress);

        _checkPrice(amount);

        if (duration == 0) {
            revert MarketErrors.InvalidDuration();
        }

        if (msg.value != amount) {
            revert MarketErrors.InvalidAmount();
        }

        Offer storage offer = sOffers[nftAddress][tokenId];

        if (offer.active) {
            revert MarketErrors.OfferAlreadyExists();
        }

        offer.buyer = msg.sender;

        offer.amount = amount;

        offer.expiresAt = uint64(block.timestamp + duration);

        offer.active = true;

        emit OfferCreated(msg.sender, nftAddress, tokenId, amount, offer.expiresAt);
    }

    /*//////////////////////////////////////////////////////////////
                        CANCEL OFFER
    //////////////////////////////////////////////////////////////*/

    function cancelOffer(address nftAddress, uint256 tokenId) external nonReentrant whenNotPaused {
        _checkOfferExists(nftAddress, tokenId);

        Offer storage offer = sOffers[nftAddress][tokenId];

        if (offer.buyer != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        uint256 refund = offer.amount;

        _removeOffer(nftAddress, tokenId);

        (bool success,) = payable(msg.sender).call{value: refund}("");

        if (!success) {
            revert MarketErrors.TransferFailed();
        }

        emit OfferCancelled(msg.sender, nftAddress, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                        ACCEPT OFFER
    //////////////////////////////////////////////////////////////*/

    function acceptOffer(address nftAddress, uint256 tokenId) external nonReentrant whenNotPaused {
        _checkOfferExists(nftAddress, tokenId);
        Offer storage offer = sOffers[nftAddress][tokenId];

        _checkOfferActive(nftAddress, tokenId);

        _checkOwner(nftAddress, tokenId, msg.sender);

        _checkMarketplaceApproval(nftAddress, tokenId, msg.sender);

        _checkSelfPurchase(msg.sender, offer.buyer);

        uint256 marketplaceFee = _calculateMarketplaceFee(offer.amount);

        uint256 sellerAmount = offer.amount - marketplaceFee;

        _addProceeds(msg.sender, sellerAmount);

        _addProceeds(sFeeRecipient, marketplaceFee);

        if (sListings[nftAddress][tokenId].active) {
            _removeListing(nftAddress, tokenId);

            emit ListingRemoved(msg.sender, nftAddress, tokenId, ListingRemovalReason.Sold);
        }

        _transferNFT(nftAddress, msg.sender, offer.buyer, tokenId);

        emit ProceedsAdded(msg.sender, sellerAmount);

        emit ProceedsAdded(sFeeRecipient, marketplaceFee);

        emit OfferAccepted(msg.sender, offer.buyer, nftAddress, tokenId, offer.amount, marketplaceFee);

        _removeOffer(nftAddress, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _removeOffer(address nftAddress, uint256 tokenId) internal {
        delete sOffers[nftAddress][tokenId];
    }
}
