// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {MarketValidation} from "./MarketValidation.sol";
import {MarketErrors} from "./MarketErrors.sol";

/// @title Marketplace Internal Module
/// @author Ali Nasirlou
/// @notice Contains reusable internal marketplace logic.
/// @dev Shared by Listing, Purchase, Rent, Auction and Offer modules.
abstract contract MarketInternal is MarketValidation {
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
