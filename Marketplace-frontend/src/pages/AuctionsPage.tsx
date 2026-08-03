import { motion } from "framer-motion";
import { Gavel } from "lucide-react";
import { useAuctions, useTotalAuctions } from "@/hooks/useMarketplace";
import { AuctionCard } from "@/components/ui/AuctionCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export function AuctionsPage() {
  const { data: total, isLoading: isLoadingTotal } = useTotalAuctions();
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions(
    0n,
    total ?? 0n,
  );

  // While the total count hasn't loaded yet, keep showing skeletons instead of
  // flashing the "no auctions" empty state before the real query kicks in.
  const isLoading =
    isLoadingTotal || (total !== undefined && isLoadingAuctions);

  const now = BigInt(Math.floor(Date.now() / 1000));

  // sAuctionTokens only ever contains auctions that are still open on-chain, so
  // `active` is effectively always true here — but we still filter out auctions
  // whose endTime has passed and just haven't been finalized (endAuction) yet,
  // so they don't show up as "live" for a few extra minutes/hours.
  const liveAuctions = (auctions ?? []).filter(
    (auction) => auction.active && auction.endTime > now,
  );

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Gavel className="w-8 h-8 text-neon-pink" />
            Auctions
          </h1>
          <p className="text-white/50">
            Bid, outbid, and win exclusive digital assets.
          </p>
        </div>

        <div className="px-6 py-2 rounded-xl bg-gradient-pink text-white text-sm font-semibold shadow-lg border border-white/10">
          Live Auctions
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : liveAuctions.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {liveAuctions.map((auction) => (
            <motion.div
              key={`auc-${auction.nftAddress}-${auction.tokenId}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <AuctionCard
                nftAddress={auction.nftAddress}
                tokenId={auction.tokenId}
                auction={auction}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-strong rounded-2xl border border-white/5">
          <div className="w-24 h-24 mb-6 rounded-full bg-neon-pink/10 flex items-center justify-center border border-neon-pink/20">
            <Gavel className="w-10 h-10 text-neon-pink" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No auctions found
          </h3>
          <p className="text-white/50 max-w-sm">
            There are currently no items listed for auction.
          </p>
        </div>
      )}
    </div>
  );
}
