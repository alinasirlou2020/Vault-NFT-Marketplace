import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Gavel, Key } from "lucide-react";
import {
  useMarketplaceInfo,
  useListings,
  useAuctions,
  useRentals,
} from "@/hooks/useMarketplace";
import { NftCard } from "@/components/ui/NftCard";
import { AuctionCard } from "@/components/ui/AuctionCard";
import { RentalCard } from "@/components/ui/RentalCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export function HomePage() {
  const { data: info } = useMarketplaceInfo();
  const { data: listings, isLoading: isLoadingListings } = useListings(0n, 6n);
  const { data: auctions, isLoading: isLoadingAuctions } = useAuctions(0n, 10n);
  const { data: rentals, isLoading: isLoadingRentals } = useRentals(0n, 10n);

  const totalListings = info ? Number(info.totalListings) : 0;
  const feePercent = info ? Number(info.marketplaceFee) / 100 : 0;

  const now = BigInt(Math.floor(Date.now() / 1000));

  // Only show auctions that are actually still open for bidding.
  const liveAuctions = (auctions ?? []).filter(
    (auction) => auction.active && auction.endTime > now,
  );

  // Feature rentals that are actually available to rent right now.
  const availableRentals = (rentals ?? []).filter(
    (rental) => !(rental.active && rental.expiresAt > now),
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="polygon-badge px-4 py-1.5 rounded-full text-sm font-semibold mb-8 shadow-lg flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Polygon Amoy Testnet Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 max-w-5xl leading-tight"
          >
            Discover, Collect & Trade{" "}
            <span className="gradient-text">Extraordinary</span> NFTs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl"
          >
            The premier decentralized marketplace for true digital ownership.
            Built for creators and collectors with zero compromises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/explore"
              className="bg-gradient-primary text-white px-8 py-4 rounded-full font-bold text-lg hover-glow transition-all hover:scale-105"
            >
              Explore Marketplace
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="mt-20 glass-strong border border-white/10 rounded-2xl p-6 md:p-8 flex flex-wrap justify-center gap-12 md:gap-24 min-w-[80%] max-w-4xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-white">
                {totalListings}+
              </span>
              <span className="text-sm md:text-base text-white/50 mt-1 uppercase tracking-wider font-semibold">
                Total Listings
              </span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-white">
                {feePercent}%
              </span>
              <span className="text-sm md:text-base text-white/50 mt-1 uppercase tracking-wider font-semibold">
                Marketplace Fee
              </span>
            </div>
            <div className="w-px hidden md:block bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-white">
                ERC721
              </span>
              <span className="text-sm md:text-base text-white/50 mt-1 uppercase tracking-wider font-semibold">
                Supported
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 container mx-auto px-4 md:px-6 relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-neon-purple" />
              Featured Listings
            </h2>
            <p className="text-white/50">Fresh drops and hot collections</p>
          </div>
          <Link
            href="/explore"
            className="hidden md:flex items-center gap-2 text-neon-cyan hover:text-white transition-colors font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoadingListings ? (
            Array(4)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : listings && listings.length > 0 ? (
            listings.slice(0, 4).map((listing, i) => (
              <motion.div
                key={`${listing.nftAddress}-${listing.tokenId}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
            <div className="col-span-full py-12 text-center text-white/40 glass rounded-xl border border-white/5">
              No listings found yet. Be the first to list!
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/explore"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
          >
            View All Listings
          </Link>
        </div>
      </section>

      {/* Live Auctions */}
      <section className="py-24 bg-[#0a0a0a] relative border-y border-white/5">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neon-pink/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Gavel className="w-8 h-8 text-neon-pink" />
                Live Auctions
              </h2>
              <p className="text-white/50">Bid on rare and exclusive items</p>
            </div>
            <Link
              href="/auctions"
              className="hidden md:flex items-center gap-2 text-neon-pink hover:text-white transition-colors font-medium"
            >
              Explore Auctions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
            {isLoadingAuctions ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-start"
                  >
                    <SkeletonCard />
                  </div>
                ))
            ) : liveAuctions.length > 0 ? (
              liveAuctions.slice(0, 10).map((auction) => (
                <div
                  key={`auc-${auction.nftAddress}-${auction.tokenId}`}
                  className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-start"
                >
                  <AuctionCard
                    nftAddress={auction.nftAddress}
                    tokenId={auction.tokenId}
                    auction={auction}
                  />
                </div>
              ))
            ) : (
              <div className="w-full py-12 text-center text-white/40 glass rounded-xl border border-white/5">
                No live auctions right now. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-24 relative border-b border-white/5">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Key className="w-8 h-8 text-neon-cyan" />
                NFT Rentals
              </h2>
              <p className="text-white/50">
                Borrow utility without giving up ownership
              </p>
            </div>
            <Link
              href="/rentals"
              className="hidden md:flex items-center gap-2 text-neon-cyan hover:text-white transition-colors font-medium"
            >
              Explore Rentals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
            {isLoadingRentals ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-start"
                  >
                    <SkeletonCard />
                  </div>
                ))
            ) : availableRentals.length > 0 ? (
              availableRentals.slice(0, 10).map((rental) => (
                <div
                  key={`rent-${rental.nftAddress}-${rental.tokenId}`}
                  className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-start"
                >
                  <RentalCard
                    nftAddress={rental.nftAddress}
                    tokenId={rental.tokenId}
                    rental={rental}
                  />
                </div>
              ))
            ) : (
              <div className="w-full py-12 text-center text-white/40 glass rounded-xl border border-white/5">
                No items available for rent right now. Check back soon!
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Link
              href="/rentals"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
            >
              View All Rentals
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Everything you need to buy, sell, and rent digital assets securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink -translate-y-1/2 opacity-20" />

          <div className="glass-strong p-8 rounded-2xl border border-white/5 relative z-10 bg-[#0d0d12]">
            <div className="w-16 h-16 rounded-2xl bg-neon-purple/20 flex items-center justify-center mb-6 border border-neon-purple/30">
              <ShoppingBag className="w-8 h-8 text-neon-purple" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              1. List Your Asset
            </h3>
            <p className="text-white/60 leading-relaxed">
              Connect your wallet, approve your NFT, and set your terms. Choose
              between fixed price, auction, or rental.
            </p>
          </div>

          <div className="glass-strong p-8 rounded-2xl border border-white/5 relative z-10 bg-[#0d0d12]">
            <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 flex items-center justify-center mb-6 border border-neon-cyan/30">
              <Gavel className="w-8 h-8 text-neon-cyan" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              2. Trade & Bid
            </h3>
            <p className="text-white/60 leading-relaxed">
              Discover unique assets. Buy instantly, make strategic offers, or
              compete in live auctions with real-time bidding.
            </p>
          </div>

          <div className="glass-strong p-8 rounded-2xl border border-white/5 relative z-10 bg-[#0d0d12]">
            <div className="w-16 h-16 rounded-2xl bg-neon-pink/20 flex items-center justify-center mb-6 border border-neon-pink/30">
              <Key className="w-8 h-8 text-neon-pink" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              3. Rent & Earn
            </h3>
            <p className="text-white/60 leading-relaxed">
              Unlock utility. Use ERC4907 to securely lend your NFTs without
              transferring ownership, or rent assets you need.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
