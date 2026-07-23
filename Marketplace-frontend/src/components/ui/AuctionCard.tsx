import { Link } from 'wouter'
import { useNftMetadata, useCollectionName, getNftPlaceholderStyle } from '@/hooks/useNftMetadata'
import { formatMatic } from '@/utils/format'
import { SkeletonCard } from './SkeletonCard'
import { CountdownTimer } from './CountdownTimer'
import { cn } from '@/lib/utils'

interface AuctionCardProps {
  nftAddress: `0x${string}`
  tokenId: bigint
  auction: {
    highestBid: bigint
    startingPrice: bigint
    endTime: bigint
    active: boolean
  }
}

export function AuctionCard({ nftAddress, tokenId, auction }: AuctionCardProps) {
  const { metadata, isLoading } = useNftMetadata(nftAddress, tokenId)
  const { data: collectionName } = useCollectionName(nftAddress)

  if (isLoading) return <SkeletonCard />

  const placeholderStyle = getNftPlaceholderStyle(nftAddress, tokenId.toString())
  const imgUrl = metadata?.image
  
  const currentPrice = auction.highestBid > 0n ? auction.highestBid : auction.startingPrice
  const hasBids = auction.highestBid > 0n

  return (
    <Link href={`/nft/${nftAddress}/${tokenId}`}>
      <div className={cn(
        "group cursor-pointer rounded-xl overflow-hidden glass border nft-card relative h-full flex flex-col",
        auction.active ? "border-neon-pink/30 hover:border-neon-pink/50" : "border-white/5 opacity-70"
      )}>
        <div className="aspect-square w-full relative overflow-hidden bg-black/40">
          {imgUrl ? (
            <img 
              src={imgUrl} 
              alt={metadata?.name || `Token #${tokenId}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full" style={{ background: placeholderStyle }} />
          )}
          
          <div className="absolute top-3 left-3 flex gap-2">
            {auction.active ? (
              <div className="badge-auction px-2 py-1 rounded text-xs font-semibold shadow-lg backdrop-blur-md">
                Live Auction
              </div>
            ) : (
              <div className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs font-semibold backdrop-blur-md">
                Ended
              </div>
            )}
          </div>
          
          {auction.active && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <div className="bg-gradient-pink text-white font-semibold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                Place Bid
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-1 border-t border-white/5 bg-black/20 flex-1">
          <div className="text-xs text-white/50 font-medium truncate mb-1">
            {collectionName || 'Unknown Collection'}
          </div>
          
          <div className="font-semibold text-white truncate text-lg">
            {metadata?.name || `Token #${tokenId.toString()}`}
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex flex-col">
              <span className="text-xs text-white/50 mb-0.5">
                {hasBids ? 'Highest Bid' : 'Starting Price'}
              </span>
              <span className="text-neon-pink font-bold flex items-center gap-1">
                {formatMatic(currentPrice)} MATIC
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/50 mb-0.5">Time Left</span>
              <CountdownTimer endTime={auction.endTime} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
