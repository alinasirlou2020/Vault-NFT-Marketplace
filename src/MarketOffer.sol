// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketInternal} from "./MarketInternal.sol";
import {MarketErrors} from "./MarketErrors.sol";

/// @title Marketplace Offer Module
/// @author Ali Nasirlou
/// @notice Handles NFT offers.
/// @dev Buyers can make, update, cancel and sellers can accept offers.
abstract contract MarketOffer is MarketAdmin, MarketInternal {
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
                        UPDATE OFFER PRICE
    //////////////////////////////////////////////////////////////*/

    /// @notice Updates the price of an existing active offer.
    /// @dev Since offer funds are escrowed in this contract, increasing the price
    ///      requires sending the difference as msg.value, while decreasing the
    ///      price immediately refunds the difference to the buyer.
    function updateOfferPrice(address nftAddress, uint256 tokenId, uint96 newAmount)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        _checkPrice(newAmount);

        _checkOfferExists(nftAddress, tokenId);

        _checkOfferActive(nftAddress, tokenId);

        Offer storage offer = sOffers[nftAddress][tokenId];

        if (offer.buyer != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        uint256 oldAmount = offer.amount;

        if (newAmount == oldAmount) {
            revert MarketErrors.InvalidAmount();
        }

        if (newAmount > oldAmount) {
            uint256 topUp = newAmount - oldAmount;

            if (msg.value != topUp) {
                revert MarketErrors.InvalidAmount();
            }

            offer.amount = newAmount;
        } else {
            if (msg.value != 0) {
                revert MarketErrors.InvalidAmount();
            }

            uint256 refund = oldAmount - newAmount;

            // Effect
            offer.amount = newAmount;

            // Interaction
            (bool success,) = payable(msg.sender).call{value: refund}("");

            if (!success) {
                revert MarketErrors.TransferFailed();
            }
        }

        emit OfferUpdated(msg.sender, nftAddress, tokenId, oldAmount, newAmount);
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

        // Ownership is about to change — clear any stale auction/rental left
        // pointing at the old seller so funds never get stuck and no dangling
        // listing shows up under the new owner's token.
        _invalidateOtherListings(nftAddress, tokenId);

        _removeOffer(nftAddress, tokenId);
        _transferNFT(nftAddress, msg.sender, offer.buyer, tokenId);

        emit ProceedsAdded(msg.sender, sellerAmount);

        emit ProceedsAdded(sFeeRecipient, marketplaceFee);

        emit OfferAccepted(msg.sender, offer.buyer, nftAddress, tokenId, offer.amount, marketplaceFee);
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _removeOffer(address nftAddress, uint256 tokenId) internal {
        delete sOffers[nftAddress][tokenId];
    }
}
