$ npx solhint "src/**/*.sol"
[solhint] Warning: Rule 'compiler-fixed' doesn't exist

src\MarketValidation.sol
  125:31  warning  Avoid making time-based decisions in your business logic  not-rely-on-time

src\MarketRent.sol
   57:5   warning  Missing @notice tag in function 'rentItem'                                                                       use-natspec
   57:5   warning  Missing @param tag in function 'rentItem'                                                                        use-natspec
   57:5   warning  Mismatch in @param names for function 'rentItem'. Expected: [nftAddress, tokenId, durationInDays], Found: []     use-natspec
   73:44  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time
   83:35  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time
   85:35  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time
  104:5   warning  Missing @notice tag in function 'updateRentalPrice'                                                              use-natspec
  104:5   warning  Missing @param tag in function 'updateRentalPrice'                                                               use-natspec
  104:5   warning  Mismatch in @param names for function 'updateRentalPrice'. Expected: [nftAddress, tokenId, newPrice], Found: []  use-natspec
  115:44  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time
  130:5   warning  Missing @notice tag in function 'cancelRental'                                                                   use-natspec
  130:5   warning  Missing @param tag in function 'cancelRental'                                                                    use-natspec
  130:5   warning  Mismatch in @param names for function 'cancelRental'. Expected: [nftAddress, tokenId], Found: []                 use-natspec
  139:44  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time
  152:5   warning  Missing @notice tag in function 'endRental'                                                                      use-natspec
  152:5   warning  Missing @param tag in function 'endRental'                                                                       use-natspec
  152:5   warning  Mismatch in @param names for function 'endRental'. Expected: [nftAddress, tokenId], Found: []                    use-natspec
  157:13  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time

src\MarketQuery.sol
   54:5  warning  Missing @notice tag in function 'getListing'                                                           use-natspec
   54:5  warning  Missing @param tag in function 'getListing'                                                            use-natspec
   54:5  warning  Mismatch in @param names for function 'getListing'. Expected: [nftAddress, tokenId], Found: []         use-natspec
   58:5  warning  Missing @notice tag in function 'getRental'                                                            use-natspec
   58:5  warning  Missing @param tag in function 'getRental'                                                             use-natspec
   58:5  warning  Mismatch in @param names for function 'getRental'. Expected: [nftAddress, tokenId], Found: []          use-natspec
   62:5  warning  Missing @notice tag in function 'getProceeds'                                                          use-natspec
   62:5  warning  Missing @param tag in function 'getProceeds'                                                           use-natspec
   62:5  warning  Mismatch in @param names for function 'getProceeds'. Expected: [account], Found: []                    use-natspec
   70:5  warning  Missing @notice tag in function 'getTotalListings'                                                     use-natspec
   74:5  warning  Missing @notice tag in function 'getListingToken'                                                      use-natspec
   74:5  warning  Missing @param tag in function 'getListingToken'                                                       use-natspec
   74:5  warning  Mismatch in @param names for function 'getListingToken'. Expected: [index], Found: []                  use-natspec
   78:5  warning  Missing @notice tag in function 'getAllListingTokens'                                                  use-natspec
   82:5  warning  Missing @notice tag in function 'getListings'                                                          use-natspec
   82:5  warning  Missing @param tag in function 'getListings'                                                           use-natspec
   82:5  warning  Mismatch in @param names for function 'getListings'. Expected: [offset, limit], Found: []              use-natspec
  122:5  warning  Missing @notice tag in function 'getListingsBySeller'                                                  use-natspec
  122:5  warning  Missing @param tag in function 'getListingsBySeller'                                                   use-natspec
  122:5  warning  Mismatch in @param names for function 'getListingsBySeller'. Expected: [seller], Found: []             use-natspec
  176:5  warning  Missing @notice tag in function 'getMarketplaceInfo'                                                   use-natspec
  182:5  warning  Missing @notice tag in function 'getOffer'                                                             use-natspec
  182:5  warning  Missing @param tag in function 'getOffer'                                                              use-natspec
  182:5  warning  Mismatch in @param names for function 'getOffer'. Expected: [nftAddress, tokenId], Found: []           use-natspec
  186:5  warning  Missing @notice tag in function 'getAuction'                                                           use-natspec
  186:5  warning  Missing @param tag in function 'getAuction'                                                            use-natspec
  186:5  warning  Mismatch in @param names for function 'getAuction'. Expected: [nftAddress, tokenId], Found: []         use-natspec
  190:5  warning  Missing @notice tag in function 'isAuctionActive'                                                      use-natspec
  190:5  warning  Missing @param tag in function 'isAuctionActive'                                                       use-natspec
  190:5  warning  Mismatch in @param names for function 'isAuctionActive'. Expected: [nftAddress, tokenId], Found: []    use-natspec
  194:5  warning  Missing @notice tag in function 'getHighestBid'                                                        use-natspec
  194:5  warning  Missing @param tag in function 'getHighestBid'                                                         use-natspec
  194:5  warning  Mismatch in @param names for function 'getHighestBid'. Expected: [nftAddress, tokenId], Found: []      use-natspec
  198:5  warning  Missing @notice tag in function 'getHighestBidder'                                                     use-natspec
  198:5  warning  Missing @param tag in function 'getHighestBidder'                                                      use-natspec
  198:5  warning  Mismatch in @param names for function 'getHighestBidder'. Expected: [nftAddress, tokenId], Found: []   use-natspec
  202:5  warning  Missing @notice tag in function 'getAuctionEndTime'                                                    use-natspec
  202:5  warning  Missing @param tag in function 'getAuctionEndTime'                                                     use-natspec
  202:5  warning  Mismatch in @param names for function 'getAuctionEndTime'. Expected: [nftAddress, tokenId], Found: []  use-natspec

src\MarketPurchase.sol
  18:5  warning  Missing @notice tag in function 'buyItem'                                                    use-natspec
  18:5  warning  Missing @param tag in function 'buyItem'                                                     use-natspec
  18:5  warning  Mismatch in @param names for function 'buyItem'. Expected: [nftAddress, tokenId], Found: []  use-natspec

src\Marketplace.sol
  12:1  warning  Missing @title tag in contract 'Marketplace'   use-natspec
  12:1  warning  Missing @author tag in contract 'Marketplace'  use-natspec
  12:1  warning  Missing @notice tag in contract 'Marketplace'  use-natspec

src\MarketOffer.sol
  19:5   warning  Missing @notice tag in function 'makeOffer'                                                                      use-natspec
  19:5   warning  Missing @param tag in function 'makeOffer'                                                                       use-natspec
  19:5   warning  Mismatch in @param names for function 'makeOffer'. Expected: [nftAddress, tokenId, amount, duration], Found: []  use-natspec
  47:34  warning  Avoid making time-based decisions in your business logic                                                         not-rely-on-time
  58:5   warning  Missing @notice tag in function 'cancelOffer'                                                                    use-natspec
  58:5   warning  Missing @param tag in function 'cancelOffer'                                                                     use-natspec
  58:5   warning  Mismatch in @param names for function 'cancelOffer'. Expected: [nftAddress, tokenId], Found: []                  use-natspec
  84:5   warning  Missing @notice tag in function 'acceptOffer'                                                                    use-natspec
  84:5   warning  Missing @param tag in function 'acceptOffer'                                                                     use-natspec
  84:5   warning  Mismatch in @param names for function 'acceptOffer'. Expected: [nftAddress, tokenId], Found: []                  use-natspec

src\MarketListing.sol
  63:5  warning  Missing @notice tag in function 'updateListingPrice'                                                              use-natspec
  63:5  warning  Missing @param tag in function 'updateListingPrice'                                                               use-natspec
  63:5  warning  Mismatch in @param names for function 'updateListingPrice'. Expected: [nftAddress, tokenId, newPrice], Found: []  use-natspec

src\MarketInternal.sol
  24:30  warning  Avoid making time-based decisions in your business logic                                              not-rely-on-time
  92:5   warning  Missing @param tag in function '_refundPreviousBidder'                                                use-natspec
  92:5   warning  Mismatch in @param names for function '_refundPreviousBidder'. Expected: [bidder, amount], Found: []  use-natspec

src\MarketEvents.sol
   14:5  warning  Missing @param tag in event 'ItemListed'                                                                                                              use-natspec
   14:5  warning  Mismatch in @param names for event 'ItemListed'. Expected: [seller, nftAddress, tokenId, price, listedAt], Found: []                                  use-natspec
   19:5  warning  Missing @param tag in event 'ItemPriceUpdated'                                                                                                        use-natspec
   19:5  warning  Mismatch in @param names for event 'ItemPriceUpdated'. Expected: [seller, nftAddress, tokenId, oldPrice, newPrice], Found: []                         use-natspec
   24:5  warning  Missing @param tag in event 'ItemCanceled'                                                                                                            use-natspec
   24:5  warning  Mismatch in @param names for event 'ItemCanceled'. Expected: [seller, nftAddress, tokenId], Found: []                                                 use-natspec
   41:5  warning  Missing @notice tag in event 'ListingRemoved'                                                                                                         use-natspec
   41:5  warning  Missing @param tag in event 'ListingRemoved'                                                                                                          use-natspec
   41:5  warning  Mismatch in @param names for event 'ListingRemoved'. Expected: [seller, nftAddress, tokenId, reason], Found: []                                       use-natspec
   46:5  warning  Missing @param tag in event 'ItemBought'                                                                                                              use-natspec
   46:5  warning  Mismatch in @param names for event 'ItemBought'. Expected: [buyer, seller, nftAddress, tokenId, salePrice, marketplaceFee], Found: []                 use-natspec
   60:5  warning  Missing @param tag in event 'RentalListed'                                                                                                            use-natspec
   60:5  warning  Mismatch in @param names for event 'RentalListed'. Expected: [landlord, nftAddress, tokenId, pricePerDay], Found: []                                  use-natspec
   65:5  warning  Missing @param tag in event 'RentalPriceUpdated'                                                                                                      use-natspec
   65:5  warning  Mismatch in @param names for event 'RentalPriceUpdated'. Expected: [landlord, nftAddress, tokenId, oldPrice, newPrice], Found: []                     use-natspec
   74:5  warning  Missing @param tag in event 'ItemRented'                                                                                                              use-natspec
   74:5  warning  Mismatch in @param names for event 'ItemRented'. Expected: [landlord, tenant, nftAddress, tokenId, durationInDays, totalPrice, expiresAt], Found: []  use-natspec
   85:5  warning  Missing @param tag in event 'RentalEnded'                                                                                                             use-natspec
   85:5  warning  Mismatch in @param names for event 'RentalEnded'. Expected: [landlord, tenant, nftAddress, tokenId], Found: []                                        use-natspec
   92:5  warning  Missing @param tag in event 'OfferCreated'                                                                                                            use-natspec
   92:5  warning  Mismatch in @param names for event 'OfferCreated'. Expected: [buyer, nftAddress, tokenId, offerPrice, expiresAt], Found: []                           use-natspec
  101:5  warning  Missing @param tag in event 'OfferAccepted'                                                                                                           use-natspec
  101:5  warning  Mismatch in @param names for event 'OfferAccepted'. Expected: [seller, buyer, nftAddress, tokenId, offerPrice, marketplaceFee], Found: []             use-natspec
  110:5  warning  Missing @notice tag in event 'OfferUpdated'                                                                                                           use-natspec
  110:5  warning  Missing @param tag in event 'OfferUpdated'                                                                                                            use-natspec
  110:5  warning  Mismatch in @param names for event 'OfferUpdated'. Expected: [buyer, nftAddress, tokenId, oldPrice, newPrice], Found: []                              use-natspec
  115:5  warning  Missing @param tag in event 'OfferCancelled'                                                                                                          use-natspec
  115:5  warning  Mismatch in @param names for event 'OfferCancelled'. Expected: [buyer, nftAddress, tokenId], Found: []                                                use-natspec
  122:5  warning  Missing @param tag in event 'AuctionCreated'                                                                                                          use-natspec
  122:5  warning  Mismatch in @param names for event 'AuctionCreated'. Expected: [seller, nftAddress, tokenId, startingPrice, startTime, endTime], Found: []            use-natspec
  132:5  warning  Missing @param tag in event 'BidPlaced'                                                                                                               use-natspec
  132:5  warning  Mismatch in @param names for event 'BidPlaced'. Expected: [bidder, nftAddress, tokenId, bidAmount, highestBid], Found: []                             use-natspec
  140:5  warning  Missing @notice tag in event 'AuctionCancelled'                                                                                                       use-natspec
  140:5  warning  Missing @param tag in event 'AuctionCancelled'                                                                                                        use-natspec
  140:5  warning  Mismatch in @param names for event 'AuctionCancelled'. Expected: [seller, nftAddress, tokenId], Found: []                                             use-natspec
  143:5  warning  Missing @param tag in event 'AuctionEnded'                                                                                                            use-natspec
  143:5  warning  Mismatch in @param names for event 'AuctionEnded'. Expected: [seller, winner, nftAddress, tokenId, winningBid, marketplaceFee], Found: []             use-natspec
  157:5  warning  Missing @param tag in event 'MarketplaceFeeUpdated'                                                                                                   use-natspec
  157:5  warning  Mismatch in @param names for event 'MarketplaceFeeUpdated'. Expected: [oldFee, newFee], Found: []                                                     use-natspec
  160:5  warning  Missing @param tag in event 'ProceedsWithdrawn'                                                                                                       use-natspec
  160:5  warning  Mismatch in @param names for event 'ProceedsWithdrawn'. Expected: [account, amount], Found: []                                                        use-natspec
  162:5  warning  Missing @notice tag in event 'FeeRecipientUpdated'                                                                                                    use-natspec
  162:5  warning  Missing @param tag in event 'FeeRecipientUpdated'                                                                                                     use-natspec
  162:5  warning  Mismatch in @param names for event 'FeeRecipientUpdated'. Expected: [oldRecipient, newRecipient], Found: []                                           use-natspec
  164:5  warning  Missing @notice tag in event 'ProceedsAdded'                                                                                                          use-natspec
  164:5  warning  Missing @param tag in event 'ProceedsAdded'                                                                                                           use-natspec
  164:5  warning  Mismatch in @param names for event 'ProceedsAdded'. Expected: [account, amount], Found: []                                                            use-natspec
  166:5  warning  Missing @notice tag in event 'NFTTransferred'                                                                                                         use-natspec
  166:5  warning  Missing @param tag in event 'NFTTransferred'                                                                                                          use-natspec
  166:5  warning  Mismatch in @param names for event 'NFTTransferred'. Expected: [nftAddress, tokenId, from, to], Found: []                                             use-natspec
  168:5  warning  Missing @notice tag in event 'MarketplacePaused'                                                                                                      use-natspec
  168:5  warning  Missing @param tag in event 'MarketplacePaused'                                                                                                       use-natspec
  168:5  warning  Mismatch in @param names for event 'MarketplacePaused'. Expected: [account], Found: []                                                                use-natspec
  170:5  warning  Missing @notice tag in event 'MarketplaceUnpaused'                                                                                                    use-natspec
  170:5  warning  Missing @param tag in event 'MarketplaceUnpaused'                                                                                                     use-natspec
  170:5  warning  Mismatch in @param names for event 'MarketplaceUnpaused'. Expected: [account], Found: []                                                              use-natspec
  172:5  warning  Missing @notice tag in event 'EmergencyWithdrawal'                                                                                                    use-natspec
  172:5  warning  Missing @param tag in event 'EmergencyWithdrawal'                                                                                                     use-natspec
  172:5  warning  Mismatch in @param names for event 'EmergencyWithdrawal'. Expected: [to, amount], Found: []                                                           use-natspec

src\MarketAuction.sol
   14:5   warning  Missing @param tag in function 'createAuction'                                                                              use-natspec
   14:5   warning  Mismatch in @param names for function 'createAuction'. Expected: [nftAddress, tokenId, startingPrice, duration], Found: []  use-natspec
   33:31  warning  Avoid making time-based decisions in your business logic                                                                    not-rely-on-time
   34:29  warning  Avoid making time-based decisions in your business logic                                                                    not-rely-on-time
   38:77  warning  Avoid making time-based decisions in your business logic                                                                    not-rely-on-time
   38:94  warning  Avoid making time-based decisions in your business logic                                                                    not-rely-on-time
   41:5   warning  Missing @notice tag in function 'bid'                                                                                       use-natspec
   41:5   warning  Missing @param tag in function 'bid'                                                                                        use-natspec
   41:5   warning  Mismatch in @param names for function 'bid'. Expected: [nftAddress, tokenId], Found: []                                     use-natspec
   46:13  warning  Avoid making time-based decisions in your business logic                                                                    not-rely-on-time
   74:5   warning  Missing @notice tag in function 'endAuction'                                                                                use-natspec
   74:5   warning  Missing @param tag in function 'endAuction'                                                                                 use-natspec
   74:5   warning  Mismatch in @param names for function 'endAuction'. Expected: [nftAddress, tokenId], Found: []                              use-natspec
   78:13  warning  Avoid making time-based decisions in your business logic                                                                    not-rely-on-time
  114:5   warning  Missing @notice tag in function 'cancelAuction'                                                                             use-natspec
  114:5   warning  Missing @param tag in function 'cancelAuction'                                                                              use-natspec
  114:5   warning  Mismatch in @param names for function 'cancelAuction'. Expected: [nftAddress, tokenId], Found: []                           use-natspec

src\MarketAdmin.sol
   58:5  warning  Missing @param tag in function 'setFeeRecipient'                                              use-natspec
   58:5  warning  Mismatch in @param names for function 'setFeeRecipient'. Expected: [newRecipient], Found: []  use-natspec
  105:5  warning  Missing @notice tag in function 'emergencyWithdraw'                                           use-natspec
  105:5  warning  Missing @param tag in function 'emergencyWithdraw'                                            use-natspec
  105:5  warning  Mismatch in @param names for function 'emergencyWithdraw'. Expected: [_to], Found: []         use-natspec

src\interfaces\IERC4907.sol
   6:1  warning  Missing @title tag in contract 'IERC4907'                                                       use-natspec
   6:1  warning  Missing @author tag in contract 'IERC4907'                                                      use-natspec
   6:1  warning  Missing @notice tag in contract 'IERC4907'                                                      use-natspec
   8:5  warning  Missing @param tag in function 'setUser'                                                        use-natspec
   8:5  warning  Mismatch in @param names for function 'setUser'. Expected: [tokenId, user, expires], Found: []  use-natspec
  11:5  warning  Missing @param tag in function 'userOf'                                                         use-natspec
  11:5  warning  Mismatch in @param names for function 'userOf'. Expected: [tokenId], Found: []                  use-natspec
  14:5  warning  Missing @param tag in function 'userExpires'                                                    use-natspec
  14:5  warning  Mismatch in @param names for function 'userExpires'. Expected: [tokenId], Found: []             use-natspec
  16:5  warning  Missing @notice tag in event 'UpdateUser'                                                       use-natspec
  16:5  warning  Missing @param tag in event 'UpdateUser'                                                        use-natspec
  16:5  warning  Mismatch in @param names for event 'UpdateUser'. Expected: [tokenId, user, expires], Found: []  use-natspec

✖ 173 problems (0 errors, 173 warnings)

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ===>               NEW  500+ Formal Verification security checks → Run a free scan              <=== │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ===>                     Smart contract Audits by Protofire  |  Book a Call                     <=== │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
