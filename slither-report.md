$ slither .

INFO:Detectors:
Detector: missing-zero-check
MarketAdmin.emergencyWithdraw(address)._to (src/MarketAdmin.sol#105) lacks a zero-check on :
                - (success,None) = _to.call{value: balance}() (src/MarketAdmin.sol#112)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation
INFO:Detectors:
Detector: reentrancy-events
Reentrancy in MarketAdmin.emergencyWithdraw(address) (src/MarketAdmin.sol#105-116):
        External calls:
        - (success,None) = _to.call{value: balance}() (src/MarketAdmin.sol#112)
        Event emitted after the call(s):
        - EmergencyWithdrawal(_to,balance) (src/MarketAdmin.sol#115)
Reentrancy in MarketRent.endRental(address,uint256) (src/MarketRent.sol#152-168):
        External calls:
        - IERC4907(nftAddress).setUser(tokenId,address(0),0) (src/MarketRent.sol#164)
        Event emitted after the call(s):
        - RentalEnded(rental.landlord,rental.tenant,nftAddress,tokenId) (src/MarketRent.sol#167)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-4
INFO:Detectors:
Detector: timestamp
MarketAuction.bid(address,uint256) (src/MarketAuction.sol#41-71) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp >= auction.endTime (src/MarketAuction.sol#45)
MarketAuction.endAuction(address,uint256) (src/MarketAuction.sol#73-107) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp < auction.endTime (src/MarketAuction.sol#77)
MarketRent.rentItem(address,uint256,uint64) (src/MarketRent.sol#57-98) uses timestamp for comparisons
        Dangerous comparisons:
        - rental.tenant != address(0) && block.timestamp < rental.expiresAt (src/MarketRent.sol#73)
MarketRent.updateRentalPrice(address,uint256,uint96) (src/MarketRent.sol#104-124) uses timestamp for comparisons
        Dangerous comparisons:
        - rental.tenant != address(0) && block.timestamp < rental.expiresAt (src/MarketRent.sol#115)
MarketRent.cancelRental(address,uint256) (src/MarketRent.sol#130-146) uses timestamp for comparisons
        Dangerous comparisons:
        - rental.tenant != address(0) && block.timestamp < rental.expiresAt (src/MarketRent.sol#139)
MarketRent.endRental(address,uint256) (src/MarketRent.sol#152-168) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp < rental.expiresAt (src/MarketRent.sol#157)
MarketValidation._checkOfferActive(address,uint256) (src/MarketValidation.sol#118-128) uses timestamp for comparisons
        Dangerous comparisons:
        - offer.expiresAt < block.timestamp (src/MarketValidation.sol#125)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp
INFO:Detectors:
Detector: low-level-calls
Low level call in MarketAdmin.emergencyWithdraw(address) (src/MarketAdmin.sol#105-116):
        - (success,None) = _to.call{value: balance}() (src/MarketAdmin.sol#112)
Low level call in MarketInternal._refundExcess(address,uint256,uint256) (src/MarketInternal.sol#62-72):
        - (success,None) = address(buyer).call{value: refund}() (src/MarketInternal.sol#67)
Low level call in MarketOffer.cancelOffer(address,uint256) (src/MarketOffer.sol#58-78):
        - (success,None) = address(msg.sender).call{value: refund}() (src/MarketOffer.sol#71)
Low level call in MarketPurchase.withdrawProceeds() (src/MarketPurchase.sol#57-77):
        - (success,None) = address(msg.sender).call{value: amount}() (src/MarketPurchase.sol#69)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls
INFO:Detectors:
Detector: naming-convention
Parameter MarketAdmin.emergencyWithdraw(address)._to (src/MarketAdmin.sol#105) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions
INFO:Slither:. analyzed (21 contracts with 101 detectors), 15 result(s) found