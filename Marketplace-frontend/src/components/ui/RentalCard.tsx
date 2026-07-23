import { Link } from 'wouter'
import { useNftMetadata, useCollectionName, getNftPlaceholderStyle } from '@/hooks/useNftMetadata'
import { formatMatic, shortenAddress } from '@/utils/format'
import { SkeletonCard } from './SkeletonCard'
import { CountdownTimer } from './CountdownTimer'
import { cn } from '@/lib/utils'

interface RentalCardProps {
  nftAddress: `0x${string}`
  tokenId: bigint
  rental: {
    landlord: `0x${string}`
    tenant: `0x${string}`
    pricePerDay: bigint
    expiresAt: bigint
    active: boolean
  }
}

export function RentalCard({ nftAddress, tokenId, rental }: RentalCardProps) {
  const { metadata, isLoading } = useNftMetadata(nftAddress, tokenId)
  const { data: collectionName } = useCollectionName(nftAddress)

  if (isLoading) return <SkeletonCard />

  const placeholderStyle = getNftPlaceholderStyle(nftAddress, tokenId.toString())
  const imgUrl = metadata?.image
  
  const isRented = rental.active && rental.expiresAt > Math.floor(Date.now() / 1000)

  return (
    <Link href={`/nft/${nftAddress}/${tokenId}`}>
      <div className={cn(
        "group cursor-pointer rounded-xl overflow-hidden glass border nft-card relative h-full flex flex-col",
        isRented ? "border-white/5 opacity-80" : "border-neon-cyan/30 hover:border-neon-cyan/50"
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
            {!isRented ? (
              <div className="badge-rental px-2 py-1 rounded text-xs font-semibold shadow-lg backdrop-blur-md">
                Available to Rent
              </div>
            ) : (
              <div className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs font-semibold backdrop-blur-md">
                Currently Rented
              </div>
            )}
          </div>
          
          {!isRented && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <div className="bg-gradient-primary text-white font-semibold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                Rent Now
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
              <span className="text-xs text-white/50 mb-0.5">Price / Day</span>
              <span className="text-neon-cyan font-bold flex items-center gap-1">
                {formatMatic(rental.pricePerDay)} MATIC
              </span>
            </div>
            
            {isRented ? (
              <div className="flex flex-col items-end">
                <span className="text-xs text-white/50 mb-0.5">Expires in</span>
                <CountdownTimer endTime={rental.expiresAt} />
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-xs text-white/50 mb-0.5">Landlord</span>
                <span className="text-sm text-white/80">{shortenAddress(rental.landlord)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
