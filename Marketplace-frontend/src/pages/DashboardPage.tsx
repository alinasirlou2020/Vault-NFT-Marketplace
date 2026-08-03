import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAccount } from "wagmi";
import { zeroAddress } from "viem";
import {
  Wallet,
  ArrowDownToLine,
  Tag,
  Gavel,
  Key,
  Loader2,
  Edit2,
  X,
  RefreshCw,
} from "lucide-react";
import {
  useMyProceeds,
  useMyListings,
  useMyAuctions,
  useMyRentals,
  useWithdrawProceeds,
  useUpdateListingPrice,
  useCancelListing,
  useCancelAuction,
  useEndAuction,
  useCancelRental,
  useEndRental,
  useUpdateRentalPrice,
  type ListingView,
  type AuctionView,
  type RentalView,
} from "@/hooks/useMarketplace";
import { useNftMetadata } from "@/hooks/useNftMetadata";
import { formatMatic } from "@/utils/format";
import { parseContractError } from "@/utils/errors";
import { toast } from "sonner";
import { getTxUrl } from "@/config/contracts";
import { motion } from "framer-motion";

// Strictly positive decimal numbers (e.g. "0.5", "12") — rejects "0", "-1", empty, etc.
const POSITIVE_DECIMAL_PATTERN = /^\d*\.?\d+$/;

function validatePrice(value: string): boolean {
  if (!value || !POSITIVE_DECIMAL_PATTERN.test(value) || Number(value) <= 0) {
    toast.error("Enter a valid price greater than 0");
    return false;
  }
  return true;
}

/*//////////////////////////////////////////////////////////////
                    FIXED-PRICE LISTING ROW
//////////////////////////////////////////////////////////////*/

function DashboardListingRow({
  listing,
  onRefresh,
}: {
  listing: ListingView;
  onRefresh: () => void;
}) {
  const { metadata } = useNftMetadata(listing.nftAddress, listing.tokenId);
  const { updatePrice, isPending: updatePending } = useUpdateListingPrice();
  const { cancelListing, isPending: cancelPending } = useCancelListing();

  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(formatMatic(listing.price));

  const handleUpdatePrice = async () => {
    if (!validatePrice(newPrice)) return;
    try {
      const tx = await updatePrice(
        listing.nftAddress,
        listing.tokenId,
        newPrice,
      );
      if (tx) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Price updated successfully</span>
            <a
              href={getTxUrl(tx)}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-white/70 hover:text-white"
            >
              View tx
            </a>
          </div>,
        );
        setIsEditing(false);
        onRefresh();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  const handleCancel = async () => {
    try {
      const tx = await cancelListing(listing.nftAddress, listing.tokenId);
      if (tx) {
        toast.success("Listing cancelled");
        onRefresh();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 glass border border-white/5 rounded-xl gap-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
          {metadata?.image ? (
            <img
              src={metadata.image}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-purple/40 to-neon-cyan/40" />
          )}
        </div>
        <div>
          <Link
            href={`/nft/${listing.nftAddress}/${listing.tokenId}`}
            className="font-bold text-white hover:text-neon-purple transition-colors block"
          >
            {metadata?.name || `Token #${listing.tokenId.toString()}`}
          </Link>
          <div className="text-xs text-white/50 mt-1">
            ID: {listing.tokenId.toString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-24 bg-black/40 border border-neon-purple rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleUpdatePrice}
              disabled={updatePending}
              className="p-1.5 bg-neon-purple text-white rounded-lg hover:opacity-90"
            >
              {updatePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="font-bold text-white text-right">
              {formatMatic(listing.price)}{" "}
              <span className="text-xs text-white/50 font-normal">MATIC</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelPending}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                {cancelPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*//////////////////////////////////////////////////////////////
                        AUCTION ROW
//////////////////////////////////////////////////////////////*/

function DashboardAuctionRow({
  auction,
  onRefresh,
}: {
  auction: AuctionView;
  onRefresh: () => void;
}) {
  const { metadata } = useNftMetadata(auction.nftAddress, auction.tokenId);
  const { cancelAuction, isPending: cancelPending } = useCancelAuction();
  const { endAuction, isPending: endPending } = useEndAuction();

  const now = BigInt(Math.floor(Date.now() / 1000));
  const hasEnded = auction.endTime <= now;
  const hasBids = auction.highestBid > 0n;

  const handleCancel = async () => {
    try {
      const tx = await cancelAuction(auction.nftAddress, auction.tokenId);
      if (tx) {
        toast.success("Auction cancelled");
        onRefresh();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  const handleEnd = async () => {
    try {
      const tx = await endAuction(auction.nftAddress, auction.tokenId);
      if (tx) {
        toast.success("Auction finalized");
        onRefresh();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 glass border border-white/5 rounded-xl gap-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
          {metadata?.image ? (
            <img
              src={metadata.image}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-pink/40 to-neon-purple/40" />
          )}
        </div>
        <div>
          <Link
            href={`/nft/${auction.nftAddress}/${auction.tokenId}`}
            className="font-bold text-white hover:text-neon-pink transition-colors block"
          >
            {metadata?.name || `Token #${auction.tokenId.toString()}`}
          </Link>
          <div className="text-xs text-white/50 mt-1">
            {hasBids ? "Highest Bid" : "Starting Price"}:{" "}
            {formatMatic(hasBids ? auction.highestBid : auction.startingPrice)}{" "}
            MATIC
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {!hasEnded ? (
          hasBids ? (
            <span className="text-sm text-white/50">Bidding in progress</span>
          ) : (
            <button
              onClick={handleCancel}
              disabled={cancelPending}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-2"
            >
              {cancelPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Cancel
            </button>
          )
        ) : (
          <button
            onClick={handleEnd}
            disabled={endPending}
            className="px-4 py-2 rounded-lg bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20 transition-colors text-sm font-medium flex items-center gap-2"
          >
            {endPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Gavel className="w-4 h-4" />
            )}
            Finalize
          </button>
        )}
      </div>
    </div>
  );
}

/*//////////////////////////////////////////////////////////////
                        RENTAL ROW
//////////////////////////////////////////////////////////////*/

function DashboardRentalRow({
  rental,
  onRefresh,
}: {
  rental: RentalView;
  onRefresh: () => void;
}) {
  const { metadata } = useNftMetadata(rental.nftAddress, rental.tokenId);
  const { cancelRental, isPending: cancelPending } = useCancelRental();
  const { endRental, isPending: endPending } = useEndRental();
  const { updateRentalPrice, isPending: updatePending } =
    useUpdateRentalPrice();

  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(formatMatic(rental.pricePerDay));

  const now = BigInt(Math.floor(Date.now() / 1000));
  const isCurrentlyRented = rental.active && rental.expiresAt > now;
  const wasEverRented = rental.tenant.toLowerCase() !== zeroAddress;

  const handleUpdatePrice = async () => {
    if (!validatePrice(newPrice)) return;
    try {
      const tx = await updateRentalPrice(
        rental.nftAddress,
        rental.tokenId,
        newPrice,
      );
      if (tx) {
        toast.success("Price updated");
        setIsEditing(false);
        onRefresh();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  // A rental that was never taken can simply be cancelled. One that already
  // completed a rental period should be finalized via endRental instead, so
  // ERC4907 user rights get properly reset on-chain.
  const handleRemove = async () => {
    try {
      const tx = wasEverRented
        ? await endRental(rental.nftAddress, rental.tokenId)
        : await cancelRental(rental.nftAddress, rental.tokenId);
      if (tx) {
        toast.success(wasEverRented ? "Rental finalized" : "Listing cancelled");
        onRefresh();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 glass border border-white/5 rounded-xl gap-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
          {metadata?.image ? (
            <img
              src={metadata.image}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-cyan/40 to-neon-blue/40" />
          )}
        </div>
        <div>
          <Link
            href={`/nft/${rental.nftAddress}/${rental.tokenId}`}
            className="font-bold text-white hover:text-neon-cyan transition-colors block"
          >
            {metadata?.name || `Token #${rental.tokenId.toString()}`}
          </Link>
          <div className="text-xs text-white/50 mt-1">
            {isCurrentlyRented
              ? `Rented until ${new Date(Number(rental.expiresAt) * 1000).toLocaleDateString()}`
              : `ID: ${rental.tokenId.toString()}`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {isCurrentlyRented ? (
          <span className="text-sm text-white/50">Currently rented</span>
        ) : isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-24 bg-black/40 border border-neon-cyan rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleUpdatePrice}
              disabled={updatePending}
              className="p-1.5 bg-neon-cyan text-black rounded-lg hover:opacity-90"
            >
              {updatePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="font-bold text-white text-right">
              {formatMatic(rental.pricePerDay)}{" "}
              <span className="text-xs text-white/50 font-normal">
                MATIC/day
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemove}
                disabled={cancelPending || endPending}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                {cancelPending || endPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*//////////////////////////////////////////////////////////////
                        DASHBOARD PAGE
//////////////////////////////////////////////////////////////*/

export function DashboardPage() {
  const { isConnected, address } = useAccount();
  const [, setLocation] = useLocation();

  // All hooks must be called unconditionally (Rules of Hooks)
  const { data: proceeds, refetch: refetchProceeds } = useMyProceeds();
  const { data: listings, refetch: refetchListings } = useMyListings();
  const { data: auctions, refetch: refetchAuctions } = useMyAuctions();
  const { data: rentals, refetch: refetchRentals } = useMyRentals();
  const { withdrawProceeds, isPending: withdrawPending } =
    useWithdrawProceeds();

  useEffect(() => {
    if (!isConnected) {
      setLocation("/");
    }
  }, [isConnected, setLocation]);

  if (!isConnected) {
    return null;
  }

  const handleWithdraw = async () => {
    try {
      const tx = await withdrawProceeds();
      if (tx) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Proceeds withdrawn!</span>
            <a
              href={getTxUrl(tx)}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-white/70 hover:text-white"
            >
              View tx
            </a>
          </div>,
        );
        refetchProceeds();
      }
    } catch (e) {
      toast.error(parseContractError(e));
    }
  };

  const refreshAll = () => {
    refetchListings();
    refetchAuctions();
    refetchRentals();
    refetchProceeds();
  };

  const hasProceeds = proceeds !== undefined && proceeds > 0n;

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <Link
          href={`/profile/${address}`}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
        >
          View Public Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Proceeds Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 glass-strong border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none" />

          <div>
            <div className="text-emerald-400/80 font-medium text-sm mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Wallet className="w-4 h-4" /> Available Proceeds
            </div>
            <div className="text-5xl font-black text-white">
              {formatMatic(proceeds ?? 0n)}{" "}
              <span className="text-2xl text-white/50 font-normal">MATIC</span>
            </div>
            <p className="text-white/50 text-sm mt-2">
              Earned from sales and rentals.
            </p>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!hasProceeds || withdrawPending}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {withdrawPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowDownToLine className="w-5 h-5" />
            )}
            Withdraw Funds
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong border border-white/10 rounded-2xl p-6 flex flex-col justify-center bg-white/5"
        >
          <div className="text-white/50 font-medium text-sm mb-2 flex items-center gap-2 uppercase tracking-wider">
            <Tag className="w-4 h-4" /> Active Listings
          </div>
          <div className="text-4xl font-black text-white">
            {listings?.length || 0}
          </div>
          <Link
            href="/list"
            className="mt-4 text-neon-purple hover:text-neon-cyan transition-colors text-sm font-medium flex items-center gap-1"
          >
            Create new listing →
          </Link>
        </motion.div>
      </div>

      {/* Active Listings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Box className="w-6 h-6 text-neon-purple" />
            My Fixed-Price Listings
          </h2>
        </div>

        <div className="space-y-4">
          {!listings ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
            </div>
          ) : listings.length > 0 ? (
            listings.map((l) => (
              <DashboardListingRow
                key={`${l.nftAddress}-${l.tokenId}`}
                listing={l}
                onRefresh={refreshAll}
              />
            ))
          ) : (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <p className="text-white/50 mb-4">
                You don't have any active fixed-price listings.
              </p>
              <Link
                href="/list"
                className="inline-flex px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                List an Item
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* My Auctions Section */}
      <div className="space-y-6 mt-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gavel className="w-6 h-6 text-neon-pink" />
            My Auctions
          </h2>
        </div>

        <div className="space-y-4">
          {!auctions ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
            </div>
          ) : auctions.length > 0 ? (
            auctions.map((a) => (
              <DashboardAuctionRow
                key={`${a.nftAddress}-${a.tokenId}`}
                auction={a}
                onRefresh={refreshAll}
              />
            ))
          ) : (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <p className="text-white/50 mb-4">You don't have any auctions.</p>
              <Link
                href="/list"
                className="inline-flex px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                Create an Auction
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* My Rentals Section */}
      <div className="space-y-6 mt-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Key className="w-6 h-6 text-neon-cyan" />
            My Rentals
          </h2>
        </div>

        <div className="space-y-4">
          {!rentals ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
            </div>
          ) : rentals.length > 0 ? (
            rentals.map((r) => (
              <DashboardRentalRow
                key={`${r.nftAddress}-${r.tokenId}`}
                rental={r}
                onRefresh={refreshAll}
              />
            ))
          ) : (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <p className="text-white/50 mb-4">
                You don't have any rental listings.
              </p>
              <Link
                href="/list"
                className="inline-flex px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                List for Rent
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Box({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
