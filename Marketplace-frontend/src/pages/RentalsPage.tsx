import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Info } from "lucide-react";
import { useRentals, useTotalRentals } from "@/hooks/useMarketplace";
import { RentalCard } from "@/components/ui/RentalCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export function RentalsPage() {
  const [filter, setFilter] = useState<"available" | "rented">("available");

  const { data: total, isLoading: isLoadingTotal } = useTotalRentals();
  const { data: rentals, isLoading: isLoadingRentals } = useRentals(
    0n,
    total ?? 0n,
  );

  // While the total count hasn't loaded yet, keep showing skeletons instead of
  // flashing the "no rentals" empty state before the real query kicks in.
  const isLoading = isLoadingTotal || (total !== undefined && isLoadingRentals);

  const now = BigInt(Math.floor(Date.now() / 1000));

  const filteredRentals = (rentals ?? []).filter((rental) => {
    const isRented = rental.active && rental.expiresAt > now;
    return filter === "rented" ? isRented : !isRented;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              <Key className="w-8 h-8 text-neon-cyan" />
              NFT Rentals
            </h1>
            <div className="group relative">
              <Info className="w-5 h-5 text-white/40 hover:text-white cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-black border border-white/10 rounded-lg text-xs text-white/70 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-10 pointer-events-none">
                Powered by ERC4907. Securely rent NFTs without transferring
                ownership. Rights automatically expire when the time is up.
              </div>
            </div>
          </div>
          <p className="text-white/50">
            Borrow utility or earn passive income from your assets.
          </p>
        </div>

        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setFilter("available")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === "available"
                ? "bg-gradient-to-r from-neon-cyan to-neon-blue text-white shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Available to Rent
          </button>
          <button
            onClick={() => setFilter("rented")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === "rented"
                ? "bg-white/10 text-white shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            Currently Rented
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : filteredRentals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRentals.map((rental) => (
            <motion.div
              key={`rent-${rental.nftAddress}-${rental.tokenId}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <RentalCard
                nftAddress={rental.nftAddress}
                tokenId={rental.tokenId}
                rental={rental}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-strong rounded-2xl border border-white/5">
          <div className="w-24 h-24 mb-6 rounded-full bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
            <Key className="w-10 h-10 text-neon-cyan" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No rentals found
          </h3>
          <p className="text-white/50 max-w-sm">
            There are currently no items available for rent.
          </p>
        </div>
      )}
    </div>
  );
}
