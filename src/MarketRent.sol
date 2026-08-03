// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketInternal} from "./MarketInternal.sol";
import {MarketErrors} from "./MarketErrors.sol";
import {IERC4907} from "./interfaces/IERC4907.sol";

/// @title Marketplace Rental Module
/// @author Ali Nasirlou
/// @notice Handles NFT rental listings.
/// @dev Supports both normal ERC721 rentals and ERC4907 NFTs.
abstract contract MarketRent is MarketAdmin, MarketInternal {
    /*//////////////////////////////////////////////////////////////
                            LIST FOR RENT
    //////////////////////////////////////////////////////////////*/

    /// @notice List an NFT for rent.
    /// @param nftAddress NFT contract address.
    /// @param tokenId NFT id.
    /// @param pricePerDay Rental price per day (wei).
    function listForRent(address nftAddress, uint256 tokenId, uint96 pricePerDay) external whenNotPaused {
        _checkZeroAddress(nftAddress);

        _checkPrice(pricePerDay);

        _checkOwner(nftAddress, tokenId, msg.sender);

        _checkMarketplaceApproval(nftAddress, tokenId, msg.sender);

        _checkRentalNotActive(nftAddress, tokenId);

        Rental storage rental = sRentals[nftAddress][tokenId];

        rental.landlord = msg.sender;

        rental.tenant = address(0);

        rental.pricePerDay = pricePerDay;

        rental.startedAt = 0;

        rental.expiresAt = 0;

        rental.active = true;

        rental.useERC4907 = _supportsERC4907(nftAddress);

        _addRentalToken(nftAddress, tokenId);

        emit RentalListed(msg.sender, nftAddress, tokenId, pricePerDay);
    }

    /*//////////////////////////////////////////////////////////////
                            RENT NFT
    //////////////////////////////////////////////////////////////*/

    function rentItem(address nftAddress, uint256 tokenId, uint64 durationInDays)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        _checkDuration(durationInDays);

        Rental storage rental = sRentals[nftAddress][tokenId];

        _checkRentalActive(nftAddress, tokenId);

        if (rental.landlord == msg.sender) {
            revert MarketErrors.CannotRentOwnNFT();
        }

        if (rental.tenant != address(0) && block.timestamp < rental.expiresAt) {
            revert MarketErrors.AlreadyRented();
        }

        uint256 totalPrice = uint256(rental.pricePerDay) * durationInDays;

        _checkPurchasePrice(totalPrice, msg.value);

        rental.tenant = msg.sender;

        rental.startedAt = uint64(block.timestamp);

        rental.expiresAt = uint64(block.timestamp + durationInDays * 1 days);

        _addProceeds(rental.landlord, totalPrice);

        _refundExcess(msg.sender, msg.value, totalPrice);

        if (rental.useERC4907) {
            IERC4907(nftAddress).setUser(tokenId, msg.sender, rental.expiresAt);
        }

        emit ProceedsAdded(rental.landlord, totalPrice);

        emit ItemRented(rental.landlord, msg.sender, nftAddress, tokenId, durationInDays, totalPrice, rental.expiresAt);
    }

    /*//////////////////////////////////////////////////////////////
                        UPDATE RENTAL PRICE
    //////////////////////////////////////////////////////////////*/

    function updateRentalPrice(address nftAddress, uint256 tokenId, uint96 newPrice) external whenNotPaused {
        _checkPrice(newPrice);

        Rental storage rental = sRentals[nftAddress][tokenId];

        _checkRentalActive(nftAddress, tokenId);

        if (rental.landlord != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        if (rental.tenant != address(0) && block.timestamp < rental.expiresAt) {
            revert MarketErrors.RentalStillActive();
        }

        uint256 oldPrice = rental.pricePerDay;

        rental.pricePerDay = newPrice;

        emit RentalPriceUpdated(msg.sender, nftAddress, tokenId, oldPrice, newPrice);
    }

    /*//////////////////////////////////////////////////////////////
                        CANCEL RENTAL
    //////////////////////////////////////////////////////////////*/

    function cancelRental(address nftAddress, uint256 tokenId) external whenNotPaused {
        Rental storage rental = sRentals[nftAddress][tokenId];

        _checkRentalActive(nftAddress, tokenId);

        if (rental.landlord != msg.sender) {
            revert MarketErrors.NotOwner();
        }

        if (rental.tenant != address(0) && block.timestamp < rental.expiresAt) {
            revert MarketErrors.RentalStillActive();
        }

        _removeRentalToken(nftAddress, tokenId);

        delete sRentals[nftAddress][tokenId];

        emit RentalEnded(msg.sender, address(0), nftAddress, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                        END RENTAL
    //////////////////////////////////////////////////////////////*/

    function endRental(address nftAddress, uint256 tokenId) external whenNotPaused {
        _checkRentalActive(nftAddress, tokenId);

        Rental memory rental = sRentals[nftAddress][tokenId];

        if (block.timestamp < rental.expiresAt) {
            revert MarketErrors.RentalStillActive();
        }

        _removeRentalToken(nftAddress, tokenId);

        delete sRentals[nftAddress][tokenId];

        if (rental.useERC4907) {
            IERC4907(nftAddress).setUser(tokenId, address(0), 0);
        }

        emit RentalEnded(rental.landlord, rental.tenant, nftAddress, tokenId);
    }
}
