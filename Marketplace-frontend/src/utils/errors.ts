/** Parse a blockchain error into a user-friendly message */
export function parseContractError(error: unknown): string {
  if (!error) return 'Unknown error'

  const err = error as {
    message?: string
    shortMessage?: string
    cause?: { reason?: string; message?: string }
    data?: { message?: string }
  }

  // RainbowKit / user rejection
  const msg = err.shortMessage || err.message || ''
  if (msg.toLowerCase().includes('user rejected') || msg.toLowerCase().includes('user denied')) {
    return 'Transaction rejected by user'
  }

  // Named custom errors from contract
  const namedErrors: Record<string, string> = {
    AlreadyListed: 'This NFT is already listed',
    AlreadyRented: 'This NFT is currently rented',
    AuctionAlreadyEnded: 'This auction has already ended',
    AuctionAlreadyExists: 'An auction already exists for this NFT',
    AuctionAlreadyStarted: 'Auction has already started',
    AuctionNotFound: 'Auction not found',
    AuctionStillRunning: 'Auction is still running',
    BidTooLow: 'Your bid is too low',
    CannotRentOwnNFT: 'You cannot rent your own NFT',
    EnforcedPause: 'Marketplace is currently paused',
    FeeTooHigh: 'Fee is too high',
    InvalidAmount: 'Invalid amount',
    InvalidDuration: 'Invalid duration',
    NoProceeds: 'No proceeds to withdraw',
    NotApproved: 'NFT not approved for marketplace',
    NotListed: 'This NFT is not listed',
    NotOwner: 'You are not the owner of this NFT',
    NotOwnerNorApproved: 'Not owner or approved',
    OfferAlreadyExists: 'An offer already exists',
    OfferExpired: 'This offer has expired',
    OfferNotFound: 'Offer not found',
    PriceNotMet: 'Sent value does not meet the price',
    RentalNotActive: 'Rental is not active',
    RentalStillActive: 'Rental is still active',
    SelfPurchase: 'You cannot buy your own NFT',
    TransferFailed: 'NFT transfer failed',
    ZeroAddress: 'Invalid address (zero address)',
    ZeroPrice: 'Price cannot be zero',
  }

  for (const [name, readable] of Object.entries(namedErrors)) {
    if (msg.includes(name)) return readable
  }

  // Fallback: use short message or trim long ones
  const clean = err.shortMessage || err.cause?.reason || err.cause?.message || err.message || 'Transaction failed'
  return clean.length > 120 ? clean.slice(0, 120) + '…' : clean
}
