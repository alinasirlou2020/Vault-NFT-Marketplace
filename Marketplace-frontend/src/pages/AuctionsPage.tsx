import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel } from 'lucide-react'
import { useAllListingTokens, useAuction } from '@/hooks/useMarketplace'
import { AuctionCard } from '@/components/ui/AuctionCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'

// Intermediate component to fetch auction data for a token
function AuctionLoader({ 
  nftAddress, 
  tokenId,
  filterStatus
}: { 
  nftAddress: `0x${string}`
  tokenId: bigint
  filterStatus: 'active' | 'ended'
}) {
  const { data: auction, isLoading } = useAuction(nftAddress, tokenId)

  if (isLoading) return <SkeletonCard />
  
  if (!auction) return null

  // Check if actually active (active flag + time not expired)
  const isTimeExpired = auction.endTime <= Math.floor(Date.now() / 1000)
  const isActuallyActive = auction.active && !isTimeExpired

  if (filterStatus === 'active' && !isActuallyActive) return null
  if (filterStatus === 'ended' && (isActuallyActive || (!auction.active && auction.endTime === 0n))) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AuctionCard nftAddress={nftAddress} tokenId={tokenId} auction={auction} />
    </motion.div>
  )
}

export function AuctionsPage() {
  const [filter, setFilter] = useState<'active' | 'ended'>('active')
  const { data: allTokens, isLoading } = useAllListingTokens()

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Gavel className="w-8 h-8 text-neon-pink" />
            Auctions
          </h1>
          <p className="text-white/50">Bid, outbid, and win exclusive digital assets.</p>
        </div>
        
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === 'active' 
                ? 'bg-gradient-pink text-white shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Live Auctions
          </button>
          <button
            onClick={() => setFilter('ended')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === 'ended' 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Ended
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : allTokens && allTokens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allTokens.map(token => (
            <AuctionLoader 
              key={`auc-${token.nftAddress}-${token.tokenId}`}
              nftAddress={token.nftAddress} 
              tokenId={token.tokenId} 
              filterStatus={filter}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-strong rounded-2xl border border-white/5">
          <div className="w-24 h-24 mb-6 rounded-full bg-neon-pink/10 flex items-center justify-center border border-neon-pink/20">
            <Gavel className="w-10 h-10 text-neon-pink" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No auctions found</h3>
          <p className="text-white/50 max-w-sm">
            There are currently no items listed for auction.
          </p>
        </div>
      )}
    </div>
  )
}
