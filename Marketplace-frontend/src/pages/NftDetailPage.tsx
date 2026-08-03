import { useState } from "react";
import { useParams, Link } from "wouter";
import { useAccount } from "wagmi";
import {
  ExternalLink,
  Copy,
  Tag,
  Gavel,
  Key,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Hexagon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useListing,
  useAuction,
  useOffer,
  useRental,
  useCancelListing,
  useCancelAuction,
  useEndAuction,
  useCancelOffer,
  useAcceptOffer,
  useCancelRental,
  useEndRental,
} from "@/hooks/useMarketplace";
import {
  useNftMetadata,
  useCollectionName,
  getNftPlaceholderStyle,
} from "@/hooks/useNftMetadata";
import { formatMatic, shortenAddress, formatDate } from "@/utils/format";
import { getTokenUrl, getTxUrl } from "@/config/contracts";
import { parseContractError } from "@/utils/errors";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { BuyModal } from "@/components/modals/BuyModal";
import { BidModal } from "@/components/modals/BidModal";
import { OfferModal } from "@/components/modals/OfferModal";
import { RentModal } from "@/components/modals/RentModal";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;

export function NftDetailPage() {
  const params = useParams();
  const rawNftAddress = params.nftAddress;
  const rawTokenId = params.tokenId;

  // Validate the route params before trusting them. We still compute safe
  // fallback values here (rather than returning early) so every hook below
  // is called unconditionally on every render, regardless of validity.
  const isValidAddress =
    !!rawNftAddress && /^0x[a-fA-F0-9]{40}$/.test(rawNftAddress);
  const isValidTokenId = !!rawTokenId && /^\d+$/.test(rawTokenId);

  const nftAddress = (
    isValidAddress ? rawNftAddress : ZERO_ADDRESS
  ) as `0x${string}`;
  const tokenId = isValidTokenId ? BigInt(rawTokenId!) : 0n;

  const { address: connectedWallet } = useAccount();

  const [buyOpen, setBuyOpen] = useState(false);
  const [bidOpen, setBidOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);

  // Reads
  const { metadata, isLoading: metaLoading } = useNftMetadata(
    nftAddress,
    tokenId,
  );
  const { data: collectionName } = useCollectionName(nftAddress);
  const { data: listing, refetch: refetchListing } = useListing(
    nftAddress,
    tokenId,
  );
  const { data: auction, refetch: refetchAuction } = useAuction(
    nftAddress,
    tokenId,
  );
  const { data: offer, refetch: refetchOffer } = useOffer(nftAddress, tokenId);
  const { data: rental, refetch: refetchRental } = useRental(
    nftAddress,
    tokenId,
  );

  // Writes
  const { cancelListing, isPending: cancelListingPending } = useCancelListing();
  const { cancelAuction, isPending: cancelAuctionPending } = useCancelAuction();
  const { endAuction, isPending: endAuctionPending } = useEndAuction();
  const { cancelOffer, isPending: cancelOfferPending } = useCancelOffer();
  const { acceptOffer, isPending: acceptOfferPending } = useAcceptOffer();
  const { cancelRental, isPending: cancelRentalPending } = useCancelRental();
  const { endRental, isPending: endRentalPending } = useEndRental();

  const refreshAll = () => {
    refetchListing();
    refetchAuction();
    refetchOffer();
    refetchRental();
  };

  const handleAction = async (
    actionFn: () => Promise<string | undefined>,
    successMsg: string,
  ) => {
    try {
      const tx = await actionFn();
      if (tx) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>{successMsg}</span>
            <a
              href={getTxUrl(tx)}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-white/70 hover:text-white"
            >
              View transaction
            </a>
          </div>,
        );
        refreshAll();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  if (!isValidAddress || !isValidTokenId) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <Hexagon className="w-16 h-16 text-white/20" />
        <h2 className="text-2xl font-bold text-white">
          Invalid Asset Reference
        </h2>
        <p className="text-white/50 max-w-sm">
          The NFT contract address or token ID in this link isn't valid.
        </p>
        <Link
          href="/explore"
          className="text-neon-purple hover:underline font-medium"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  if (metaLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 flex justify-center min-h-[60vh] items-center">
        <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
      </div>
    );
  }

  const name = metadata?.name || `Token #${tokenId.toString()}`;
  const imgUrl = metadata?.image;
  const placeholderStyle = getNftPlaceholderStyle(
    nftAddress,
    tokenId.toString(),
  );

  const now = BigInt(Math.floor(Date.now() / 1000));

  // Status computed
  const isListingActive = listing?.active;
  const isAuctionActive = auction?.active;
  const isAuctionEnded = auction?.active && auction.endTime <= now;
  const isRentalListed = rental?.pricePerDay ? rental.pricePerDay > 0n : false;
  const isRented = rental?.active && rental.expiresAt > now;

  const currentOwner = listing?.seller || auction?.seller || rental?.landlord;
  const isOwner =
    currentOwner &&
    connectedWallet &&
    currentOwner.toLowerCase() === connectedWallet.toLowerCase();

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Col - Image */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl relative bg-black/40">
            <div className="aspect-square w-full relative group">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: placeholderStyle }}
                />
              )}
            </div>

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isListingActive && (
                <div className="badge-listed px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-md border">
                  For Sale
                </div>
              )}
              {isAuctionActive && !isAuctionEnded && (
                <div className="badge-auction px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-md border">
                  Live Auction
                </div>
              )}
              {isRentalListed && !isRented && (
                <div className="badge-rental px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-md border">
                  For Rent
                </div>
              )}
              {isRented && (
                <div className="bg-white/10 border border-white/20 text-white/90 px-3 py-1 rounded-md text-xs font-bold shadow-lg backdrop-blur-md">
                  Rented
                </div>
              )}
            </div>
          </div>

          <div className="glass-strong rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
              <ShieldCheck className="w-5 h-5 text-neon-purple" />
              <h3 className="font-semibold text-white">Description</h3>
            </div>
            <div className="p-4 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {metadata?.description ||
                "No description provided for this asset."}
            </div>
          </div>

          {metadata?.attributes && metadata.attributes.length > 0 && (
            <div className="glass-strong rounded-xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
                <Tag className="w-5 h-5 text-neon-cyan" />
                <h3 className="font-semibold text-white">Properties</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {metadata.attributes.map((attr, i) => (
                  <div
                    key={i}
                    className="bg-black/40 border border-white/5 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-neon-purple mb-1 font-medium uppercase tracking-wider">
                      {attr.trait_type}
                    </div>
                    <div className="text-sm text-white font-medium truncate">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col - Details & Actions */}
        <div className="lg:col-span-7 space-y-6 pt-4 lg:pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href={`/explore`}
                className="text-neon-cyan hover:underline text-sm font-medium"
              >
                {collectionName || "Nexus Collection"}
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(nftAddress)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={getTokenUrl(nftAddress, tokenId.toString())}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-xs text-white/40 mb-1 font-medium">
                  Contract Address
                </span>
                <span className="text-sm font-mono text-white/80">
                  {shortenAddress(nftAddress, 6)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/40 mb-1 font-medium">
                  Token ID
                </span>
                <span className="text-sm font-mono text-white/80">
                  {tokenId.toString()}
                </span>
              </div>
              {currentOwner && (
                <div className="flex flex-col">
                  <span className="text-xs text-white/40 mb-1 font-medium">
                    Owner / Seller
                  </span>
                  <Link
                    href={`/profile/${currentOwner}`}
                    className="text-sm font-mono text-neon-purple hover:underline flex items-center gap-1"
                  >
                    {shortenAddress(currentOwner, 6)}
                    {isOwner && (
                      <span className="bg-neon-purple/20 text-neon-purple text-[10px] px-1.5 py-0.5 rounded ml-1">
                        You
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-white/10 my-8" />

          <div className="space-y-4">
            {/* Fixed Price Listing */}
            {isListingActive && listing && (
              <div className="glass-strong border border-neon-purple/30 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-neon-purple/20 transition-all" />

                <div className="text-sm text-white/50 mb-2 font-medium uppercase tracking-wider">
                  Fixed Price
                </div>
                <div className="text-4xl font-bold text-white mb-6">
                  {formatMatic(listing.price)}{" "}
                  <span className="text-xl text-white/50 font-normal">
                    MATIC
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!isOwner ? (
                    <>
                      <button
                        onClick={() => setBuyOpen(true)}
                        className="flex-1 py-4 px-6 rounded-xl font-bold bg-gradient-primary text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => setOfferOpen(true)}
                        disabled={offer?.active}
                        className="flex-1 py-4 px-6 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {offer?.active ? "Offer Pending" : "Make Offer"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleAction(
                          () => cancelListing(nftAddress, tokenId),
                          "Listing cancelled",
                        )
                      }
                      disabled={cancelListingPending}
                      className="w-full py-4 px-6 rounded-xl font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex justify-center items-center gap-2"
                    >
                      {cancelListingPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Cancel Listing"
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Auction */}
            {isAuctionActive && auction && (
              <div className="glass-strong border border-neon-pink/30 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-neon-pink/20 transition-all" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-white/50 mb-2 font-medium uppercase tracking-wider">
                      {auction.highestBid > 0n
                        ? "Current Highest Bid"
                        : "Starting Price"}
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {formatMatic(
                        auction.highestBid > 0n
                          ? auction.highestBid
                          : auction.startingPrice,
                      )}{" "}
                      <span className="text-xl text-white/50 font-normal">
                        MATIC
                      </span>
                    </div>
                    {auction.highestBid > 0n && (
                      <div className="mt-1 text-sm text-white/50 flex items-center gap-1">
                        by{" "}
                        <Link
                          href={`/profile/${auction.highestBidder}`}
                          className="text-neon-pink hover:underline font-mono"
                        >
                          {shortenAddress(auction.highestBidder)}
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-white/50 mb-2 font-medium uppercase tracking-wider flex items-center justify-end gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {isAuctionEnded ? "Status" : "Ends In"}
                    </div>
                    <div className="text-xl font-bold bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                      <CountdownTimer endTime={auction.endTime} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!isOwner ? (
                    <button
                      onClick={() => setBidOpen(true)}
                      disabled={isAuctionEnded}
                      className="flex-1 py-4 px-6 rounded-xl font-bold bg-gradient-pink text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuctionEnded ? "Auction Ended" : "Place Bid"}
                    </button>
                  ) : (
                    <>
                      {isAuctionEnded ? (
                        <button
                          onClick={() =>
                            handleAction(
                              () => endAuction(nftAddress, tokenId),
                              "Auction ended successfully",
                            )
                          }
                          disabled={endAuctionPending}
                          className="flex-1 py-4 px-6 rounded-xl font-bold bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 transition-all flex justify-center items-center gap-2"
                        >
                          {endAuctionPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Settle Auction"
                          )}
                        </button>
                      ) : auction.highestBid === 0n ? (
                        <button
                          onClick={() =>
                            handleAction(
                              () => cancelAuction(nftAddress, tokenId),
                              "Auction cancelled",
                            )
                          }
                          disabled={cancelAuctionPending}
                          className="flex-1 py-4 px-6 rounded-xl font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex justify-center items-center gap-2"
                        >
                          {cancelAuctionPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Cancel Auction"
                          )}
                        </button>
                      ) : (
                        <div className="w-full text-center text-sm text-white/50 bg-white/5 py-4 rounded-xl">
                          Auction running with active bids. Cannot cancel.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Active Offer */}
            {offer?.active && (
              <div className="glass-strong border border-neon-blue/30 rounded-2xl p-5 bg-[#0d1520]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-neon-blue font-semibold">
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                    Active Offer
                  </div>
                  <div className="text-sm text-white/50">
                    Expires: {formatDate(offer.expiresAt)}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatMatic(offer.amount)} MATIC
                    </div>
                    <div className="text-sm text-white/50 mt-1">
                      From:{" "}
                      <Link
                        href={`/profile/${offer.buyer}`}
                        className="text-neon-blue hover:underline font-mono"
                      >
                        {shortenAddress(offer.buyer)}
                      </Link>
                    </div>
                  </div>

                  <div>
                    {isOwner ? (
                      <button
                        onClick={() =>
                          handleAction(
                            () => acceptOffer(nftAddress, tokenId),
                            "Offer accepted",
                          )
                        }
                        disabled={acceptOfferPending}
                        className="py-2 px-5 rounded-lg font-bold bg-neon-blue text-black hover:opacity-90 transition-all flex justify-center items-center gap-2"
                      >
                        {acceptOfferPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Accept"
                        )}
                      </button>
                    ) : connectedWallet &&
                      offer.buyer.toLowerCase() ===
                        connectedWallet.toLowerCase() ? (
                      <button
                        onClick={() =>
                          handleAction(
                            () => cancelOffer(nftAddress, tokenId),
                            "Offer cancelled",
                          )
                        }
                        disabled={cancelOfferPending}
                        className="py-2 px-5 rounded-lg font-bold bg-white/10 text-white hover:bg-white/20 transition-all flex justify-center items-center gap-2"
                      >
                        {cancelOfferPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* Rental */}
            {isRentalListed && rental && (
              <div className="glass-strong border border-neon-cyan/30 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-neon-cyan/20 transition-all" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-white/50 mb-2 font-medium uppercase tracking-wider">
                      Rental Rate
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {formatMatic(rental.pricePerDay)}{" "}
                      <span className="text-xl text-white/50 font-normal">
                        MATIC/day
                      </span>
                    </div>
                  </div>

                  {isRented && (
                    <div className="text-right">
                      <div className="text-sm text-white/50 mb-2 font-medium uppercase tracking-wider">
                        Rented Until
                      </div>
                      <div className="text-xl font-bold bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <CountdownTimer endTime={rental.expiresAt} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {!isRented ? (
                    // Available to rent
                    !isOwner ? (
                      <button
                        onClick={() => setRentOpen(true)}
                        className="flex-1 py-4 px-6 rounded-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                      >
                        Rent Now
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAction(
                            () => cancelRental(nftAddress, tokenId),
                            "Rental listing cancelled",
                          )
                        }
                        disabled={cancelRentalPending}
                        className="w-full py-4 px-6 rounded-xl font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex justify-center items-center gap-2"
                      >
                        {cancelRentalPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Cancel Rental Listing"
                        )}
                      </button>
                    )
                  ) : (
                    // Currently rented
                    <div className="w-full">
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-neon-cyan" />
                        <span className="text-sm text-white/80">
                          Rented to{" "}
                          <Link
                            href={`/profile/${rental.tenant}`}
                            className="font-mono text-neon-cyan hover:underline"
                          >
                            {shortenAddress(rental.tenant)}
                          </Link>
                        </span>
                      </div>

                      {(isOwner ||
                        (connectedWallet &&
                          rental.tenant.toLowerCase() ===
                            connectedWallet.toLowerCase())) && (
                        <button
                          onClick={() =>
                            handleAction(
                              () => endRental(nftAddress, tokenId),
                              "Rental ended",
                            )
                          }
                          disabled={endRentalPending}
                          className="w-full py-4 px-6 rounded-xl font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex justify-center items-center gap-2"
                        >
                          {endRentalPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "End Rental"
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isListingActive && !isAuctionActive && !isRentalListed && (
              <div className="glass-strong border border-white/5 rounded-2xl p-8 text-center bg-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Hexagon className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Not Listed
                </h3>
                <p className="text-white/50 max-w-sm mx-auto mb-6">
                  This asset is currently not listed for sale, auction, or rent
                  on NexusMarket.
                </p>
                {isOwner && (
                  <Link
                    href="/list"
                    className="inline-flex py-3 px-6 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
                  >
                    List this Asset
                  </Link>
                )}
              </div>
            )}

            {!isOwner &&
              !isListingActive &&
              !isAuctionActive &&
              !offer?.active && (
                <button
                  onClick={() => setOfferOpen(true)}
                  className="w-full py-4 px-6 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  Make Offer Anyway
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {listing && (
        <BuyModal
          isOpen={buyOpen}
          onClose={() => setBuyOpen(false)}
          nftAddress={nftAddress}
          tokenId={tokenId}
          price={listing.price}
          nftName={name}
          imageUrl={imgUrl}
        />
      )}

      {auction && (
        <BidModal
          isOpen={bidOpen}
          onClose={() => setBidOpen(false)}
          nftAddress={nftAddress}
          tokenId={tokenId}
          currentPrice={
            auction.highestBid > 0n ? auction.highestBid : auction.startingPrice
          }
          isFirstBid={auction.highestBid === 0n}
        />
      )}

      <OfferModal
        isOpen={offerOpen}
        onClose={() => setOfferOpen(false)}
        nftAddress={nftAddress}
        tokenId={tokenId}
      />

      {rental && (
        <RentModal
          isOpen={rentOpen}
          onClose={() => setRentOpen(false)}
          nftAddress={nftAddress}
          tokenId={tokenId}
          pricePerDay={rental.pricePerDay}
        />
      )}
    </div>
  );
}
