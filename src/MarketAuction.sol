// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketInternal} from "./MarketInternal.sol";
import {MarketErrors} from "./MarketErrors.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Marketplace Auction Module
/// @author Ali Nasirlou
/// @notice Handles NFT auctions.
abstract contract MarketAuction is MarketAdmin, MarketInternal, ReentrancyGuard {
    /// @notice Creates a new auction.
    function createAuction(address nftAddress, uint256 tokenId, uint96 startingPrice, uint64 duration)
        external
        whenNotPaused
    {
        _checkZeroAddress(nftAddress);
        _checkPrice(startingPrice);
        _checkDuration(duration);

        _checkOwner(nftAddress, tokenId, msg.sender);

        _checkAuctionNotExists(nftAddress, tokenId);

        _checkMarketplaceApproval(nftAddress, tokenId, msg.sender);

        sAuctions[nftAddress][tokenId] = Auction({
            seller: msg.sender,
            highestBidder: address(0),
            highestBid: 0,
            startingPrice: startingPrice,
            startTime: uint64(block.timestamp),
            endTime: uint64(block.timestamp + duration),
            active: true
        });

        emit AuctionCreated(msg.sender, nftAddress, tokenId, startingPrice, block.timestamp, block.timestamp + duration);
    }

    function bid(address nftAddress, uint256 tokenId) external payable nonReentrant whenNotPaused {
        _checkAuctionExists(nftAddress, tokenId);
        Auction storage auction = sAuctions[nftAddress][tokenId];
        
        // solhint-disable-next-line gas-strict-inequalities
        if (block.timestamp >= auction.endTime) {
            revert MarketErrors.AuctionAlreadyEnded();
        }

        _checkSelfPurchase(auction.seller, msg.sender);

        uint256 minimumBid;

        if (auction.highestBid == 0) {
            minimumBid = auction.startingPrice;
        } else {
            minimumBid = auction.highestBid + 1;
        }

        if (msg.value < minimumBid) {
            revert MarketErrors.BidTooLow(minimumBid);
        }

        if (auction.highestBidder != address(0)) {
            _refundPreviousBidder(auction.highestBidder, auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = uint96(msg.value);

        emit BidPlaced(msg.sender, nftAddress, tokenId, msg.value, msg.value);
    }

    function endAuction(address nftAddress, uint256 tokenId) external nonReentrant whenNotPaused {
        _checkAuctionExists(nftAddress, tokenId);
        Auction storage auction = sAuctions[nftAddress][tokenId];

        if (block.timestamp < auction.endTime) {
            revert MarketErrors.AuctionStillRunning();
        }

        delete sAuctions[nftAddress][tokenId];

        // اگر هیچ Bid ثبت نشده باشد
        if (auction.highestBidder == address(0)) {
            emit AuctionEnded(auction.seller, address(0), nftAddress, tokenId, 0, 0);

            return;
        }

        uint256 marketplaceFee = _calculateMarketplaceFee(auction.highestBid);

        uint256 sellerAmount = auction.highestBid - marketplaceFee;

        _addProceeds(auction.seller, sellerAmount);

        _addProceeds(sFeeRecipient, marketplaceFee);

        _transferNFT(nftAddress, auction.seller, auction.highestBidder, tokenId);

        emit ProceedsAdded(auction.seller, sellerAmount);

        emit ProceedsAdded(sFeeRecipient, marketplaceFee);

        emit AuctionEnded(
            auction.seller, auction.highestBidder, nftAddress, tokenId, auction.highestBid, marketplaceFee
        );
    }

    /*//////////////////////////////////////////////////////////////
                        CANCEL AUCTION
    //////////////////////////////////////////////////////////////*/

    function cancelAuction(address nftAddress, uint256 tokenId) external whenNotPaused {
        _checkAuctionExists(nftAddress, tokenId);
        Auction storage auction = sAuctions[nftAddress][tokenId];

        if (auction.seller != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        if (auction.highestBidder != address(0)) {
            revert MarketErrors.AuctionAlreadyStarted();
        }

        delete sAuctions[nftAddress][tokenId];

        emit AuctionCancelled(msg.sender, nftAddress, tokenId);
    }
}
