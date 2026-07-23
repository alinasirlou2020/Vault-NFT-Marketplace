import { useState } from 'react'
import { useParams } from 'wouter'
import { ExternalLink, Copy, Box, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useListingsBySeller, useProceeds, useAllListingTokens, useRental } from '@/hooks/useMarketplace'
import { NftCard } from '@/components/ui/NftCard'
import { RentalCard } from '@/components/ui/RentalCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { shortenAddress, formatMatic } from '@/utils/format'
import { getAddressUrl } from '@/config/contracts'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { Link } from 'wouter'

function ProfileRentalLoader({ 
  nftAddress, 
  tokenId,
  profileAddress
}: { 
  nftAddress: `0x${string}`
  tokenId: bigint
  profileAddress: string
}) {
  const { data: rental, isLoading } = useRental(nftAddress, tokenId)

  if (isLoading) return <SkeletonCard />
  
  if (!rental || rental.pricePerDay === 0n) return null

  const isRelated = rental.landlord.toLowerCase() === profileAddress.toLowerCase() || 
                    rental.tenant.toLowerCase() === profileAddress.toLowerCase()
  
  if (!isRelated) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <RentalCard nftAddress={nftAddress} tokenId={tokenId} rental={rental} />
    </motion.div>
  )
}

export function ProfilePage() {
  const params = useParams()
  const address = params.address as `0x${string}`
  const { address: connectedWallet } = useAccount()
  const [tab, setTab] = useState<'listed' | 'rentals'>('listed')

  const { data: proceeds } = useProceeds(address)
  const { data: listings, isLoading: listingsLoading } = useListingsBySeller(address)
  const { data: allTokens, isLoading: tokensLoading } = useAllListingTokens()

  const isOwner = connectedWallet?.toLowerCase() === address.toLowerCase()

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied')
  }

  // Generate a deterministic gradient avatar based on address
  const seed = parseInt(address.slice(2, 10), 16)
  const hue = seed % 360
  const avatarStyle = { background: `linear-gradient(135deg, hsl(${hue}, 80%, 60%), hsl(${(hue + 60) % 360}, 70%, 40%))` }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Profile Header */}
      <div className="relative border-b border-white/10 bg-black/40 pt-12 pb-8 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: `hsl(${hue}, 80%, 50%)` }} />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-2xl relative" style={avatarStyle}>
              {isOwner && (
                <div className="absolute -bottom-2 -right-2 bg-neon-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-background">
                  You
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight flex items-center justify-center md:justify-start gap-3">
                {shortenAddress(address, 6)}
                <div className="flex gap-2">
                  <button onClick={copyAddress} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer">
                    <Copy className="w-5 h-5" />
                  </button>
                  <a href={getAddressUrl(address)} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="glass-strong px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Total Listed</span>
                    <span className="text-xl font-bold text-white leading-none">{listings?.length || 0}</span>
                  </div>
                </div>
                <div className="glass-strong px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Earned Proceeds</span>
                    <span className="text-xl font-bold text-emerald-400 leading-none">{formatMatic(proceeds)} MATIC</span>
                  </div>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="mt-4 md:mt-0">
                <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-12">
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setTab('listed')}
            className={`px-6 py-4 font-semibold text-lg flex items-center gap-2 border-b-2 transition-all ${
              tab === 'listed' 
                ? 'border-neon-purple text-white bg-white/5 rounded-t-xl' 
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Box className="w-5 h-5" />
            Listed Items
          </button>
          <button
            onClick={() => setTab('rentals')}
            className={`px-6 py-4 font-semibold text-lg flex items-center gap-2 border-b-2 transition-all ${
              tab === 'rentals' 
                ? 'border-neon-cyan text-white bg-white/5 rounded-t-xl' 
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Activity className="w-5 h-5" />
            Active Rentals
          </button>
        </div>

        {tab === 'listed' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listingsLoading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : listings && listings.length > 0 ? (
              listings.map((listing, i) => (
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
              <div className="col-span-full py-20 text-center glass rounded-2xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Box className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Listings</h3>
                <p className="text-white/50">This user hasn't listed any items for sale.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'rentals' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tokensLoading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : allTokens && allTokens.length > 0 ? (
              allTokens.map(token => (
                <ProfileRentalLoader 
                  key={`rent-${token.nftAddress}-${token.tokenId}`}
                  nftAddress={token.nftAddress} 
                  tokenId={token.tokenId} 
                  profileAddress={address}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-2xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Rentals</h3>
                <p className="text-white/50">This user isn't involved in any rentals.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
