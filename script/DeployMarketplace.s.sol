// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console2} from "forge-std/Script.sol";

import {Marketplace} from "../src/Marketplace.sol";

/// @title Marketplace Deployment Script
/// @author Ali Nasirlou
/// @notice Deploys the Marketplace contract.
/// @dev Reads deployment configuration from environment variables.
contract DeployMarketplace is Script {
    function run() external returns (Marketplace marketplace) {
        /*//////////////////////////////////////////////////////////////
                            CONFIGURATION
        //////////////////////////////////////////////////////////////*/

        address initialOwner = vm.envAddress("OWNER_ADDRESS");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");
        uint96 marketplaceFee = uint96(vm.envUint("MARKETPLACE_FEE"));

        /*//////////////////////////////////////////////////////////////
                                DEPLOY
        //////////////////////////////////////////////////////////////*/

        vm.startBroadcast();

        marketplace = new Marketplace(initialOwner, feeRecipient, marketplaceFee);

        vm.stopBroadcast();

        /*//////////////////////////////////////////////////////////////
                                LOGS
        //////////////////////////////////////////////////////////////*/

        console2.log("========================================");
        console2.log(" Marketplace Successfully Deployed");
        console2.log("========================================");

        console2.log("Marketplace :", address(marketplace));
        console2.log("Owner       :", initialOwner);
        console2.log("FeeRecipient:", feeRecipient);
        console2.log("Fee (BPS)   :", marketplaceFee);

        console2.log("========================================");
    }
}
