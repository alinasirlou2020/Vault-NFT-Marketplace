import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useListings, useTotalListings } from "@/hooks/useMarketplace";
import { NftCard } from "@/components/ui/NftCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

const ITEMS_PER_PAGE = 12n;

export function ExplorePage() {
  const [page, setPage] = useState(0n);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "price-low" | "price-high">(
    "newest",
  );

  const { data: totalListingsData } = useTotalListings();
  const offset = page * ITEMS_PER_PAGE;
  const { data: listings, isLoading } = useListings(offset, ITEMS_PER_PAGE);

  const totalListings = totalListingsData ? Number(totalListingsData) : 0;
  const maxPage = Math.max(
    0,
    Math.ceil(totalListings / Number(ITEMS_PER_PAGE)) - 1,
  );

  // Client-side filtering/sorting of the current page data
  const filteredListings = listings
    ?.filter((l) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        l.nftAddress.toLowerCase().includes(term) ||
        l.tokenId.toString().includes(term)
      );
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price < b.price ? -1 : 1;
      if (sort === "price-high") return a.price > b.price ? -1 : 1;
      // newest
      return a.listedAt > b.listedAt ? -1 : 1;
    });

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Explore NFTs
          </h1>
          <p className="text-white/50">{totalListings} total items listed</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-neon-purple transition-colors" />
            <input
              type="text"
              placeholder="Search by address or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-[280px] bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-all"
            />
          </div>

          <div className="relative group">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-neon-cyan transition-colors" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="w-full sm:w-[200px] bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all cursor-pointer"
            >
              <option value="newest" className="bg-black">
                Recently Listed
              </option>
              <option value="price-low" className="bg-black">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-black">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* تغییر اندازه گرید برای نمایش ۲تایی در موبایل */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 min-h-[50vh]">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : filteredListings && filteredListings.length > 0 ? (
          filteredListings.map((listing, i) => (
            <motion.div
              key={`${listing.nftAddress}-${listing.tokenId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <NftCard
                nftAddress={listing.nftAddress}
                tokenId={listing.tokenId}
                price={listing.price}
                seller={listing.seller}
                listedAt={listing.listedAt}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center glass-strong rounded-2xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Search className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No items found
            </h3>
            <p className="text-white/50 max-w-sm">
              We couldn't find any NFTs matching your current filters. Try
              adjusting your search or come back later.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalListings > 0 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => (p > 0n ? p - 1n : 0n))}
            disabled={page === 0n}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="text-sm font-medium text-white/70">
            Page {Number(page) + 1} of {maxPage + 1}
          </div>

          <button
            onClick={() => setPage((p) => p + 1n)}
            disabled={page >= BigInt(maxPage)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
