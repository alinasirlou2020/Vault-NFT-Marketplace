// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {MarketAdmin} from "./MarketAdmin.sol";
import {MarketListing} from "./MarketListing.sol";
import {MarketPurchase} from "./MarketPurchase.sol";
import {MarketRent} from "./MarketRent.sol";
import {MarketOffer} from "./MarketOffer.sol";
import {MarketAuction} from "./MarketAuction.sol";
import {MarketQuery} from "./MarketQuery.sol";

contract Marketplace is MarketListing, MarketPurchase, MarketRent, MarketOffer, MarketAuction, MarketQuery {
    constructor(address initialOwner, address feeRecipient, uint96 marketplaceFee) MarketAdmin(initialOwner) {
        _setFeeRecipient(feeRecipient);
        _setMarketplaceFee(marketplaceFee);
    }
}
