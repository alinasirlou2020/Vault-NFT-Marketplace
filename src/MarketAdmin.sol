// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {MarketplaceStorage} from "./MarketplaceStorage.sol";
import {MarketEvents} from "./MarketEvents.sol";
import {MarketErrors} from "./MarketErrors.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Marketplace Administration Module
/// @author Ali Nasirlou
/// @notice Handles owner-controlled marketplace configuration.
/// @dev Includes fee management, emergency pause and fee recipient management.
abstract contract MarketAdmin is Ownable, Pausable, MarketplaceStorage, MarketEvents, ReentrancyGuard {
    constructor(address initialOwner) Ownable(initialOwner) {
        if (initialOwner == address(0)) {
            revert MarketErrors.ZeroAddress();
        }

        sFeeRecipient = initialOwner;
    }

    /*//////////////////////////////////////////////////////////////
                        FEE MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /// @notice Updates marketplace fee.
    /// @param newFee Fee value in basis points.
    /// Example:
    /// 250 = 2.5%
    function setMarketplaceFee(uint96 newFee) external onlyOwner {
        _setMarketplaceFee(newFee);
    }

    function _setMarketplaceFee(uint96 newFee) internal {
        if (newFee > MAX_FEE) {
            revert MarketErrors.FeeTooHigh();
        }

        uint96 oldFee = sMarketplaceFee;

        sMarketplaceFee = newFee;

        emit MarketplaceFeeUpdated(oldFee, newFee);
    }

    /// @notice Returns current marketplace fee.
    function getMarketplaceFee() public view returns (uint96) {
        return sMarketplaceFee;
    }

    /*//////////////////////////////////////////////////////////////
                        FEE RECIPIENT
    //////////////////////////////////////////////////////////////*/

    /// @notice Updates address receiving marketplace fees.
    function setFeeRecipient(address newRecipient) external onlyOwner {
        _setFeeRecipient(newRecipient);
    }

    function _setFeeRecipient(address newRecipient) internal {
        if (newRecipient == address(0)) {
            revert MarketErrors.ZeroAddress();
        }

        address oldRecipient = sFeeRecipient;

        sFeeRecipient = newRecipient;

        emit FeeRecipientUpdated(oldRecipient, newRecipient);
    }

    /// @notice Returns fee recipient address.
    function getFeeRecipient() public view returns (address) {
        return sFeeRecipient;
    }

    /*//////////////////////////////////////////////////////////////
                        PAUSE CONTROL
    //////////////////////////////////////////////////////////////*/

    /// @notice Emergency stop marketplace operations.
    function pauseMarketplace() external onlyOwner {
        _pause();
        emit MarketplacePaused(msg.sender);
    }

    /// @notice Resume marketplace operations.
    function unpauseMarketplace() external onlyOwner {
        _unpause();
        emit MarketplaceUnpaused(msg.sender);
    }

    /// @notice Returns whether marketplace is paused.
    function isMarketplacePaused() external view returns (bool) {
        return paused();
    }

    /*//////////////////////////////////////////////////////////////
                        FEE WITHDRAWAL
    //////////////////////////////////////////////////////////////*/

    /// @notice Withdraws accumulated marketplace fees to the fee recipient.
    /// @dev Only withdraws sFeeRecipient's own proceeds balance — never touches
    ///      other users' pending proceeds (sellers, landlords, refunded bidders).
    function withdrawMarketplaceFees() external onlyOwner nonReentrant {
        uint256 amount = sProceeds[sFeeRecipient];

        if (amount == 0) revert MarketErrors.NoProceeds();

        // Effects
        sProceeds[sFeeRecipient] = 0;

        // Interaction
        (bool success,) = payable(sFeeRecipient).call{value: amount}("");

        if (!success) {
            sProceeds[sFeeRecipient] = amount;
            revert MarketErrors.TransferFailed();
        }

        emit ProceedsWithdrawn(sFeeRecipient, amount);
    }
}
