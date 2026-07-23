import { useState } from 'react'
import { useLocation } from 'wouter'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Gavel, Key, Loader2, Info } from 'lucide-react'
import { 
  useListItem, 
  useCreateAuction, 
  useListForRent 
} from '@/hooks/useMarketplace'
import { parseContractError } from '@/utils/errors'
import { getTxUrl } from '@/config/contracts'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ListMode = 'fixed' | 'auction' | 'rent'

export function ListPage() {
  const { isConnected } = useAccount()
  const [, setLocation] = useLocation()
  
  if (!isConnected) {
    setLocation('/')
    return null
  }

  const [mode, setMode] = useState<ListMode>('fixed')
  const [nftAddress, setNftAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  
  // Fixed Price
  const [price, setPrice] = useState('')
  const { listItem, isPending: listPending } = useListItem()
  
  // Auction
  const [startingPrice, setStartingPrice] = useState('')
  const [duration, setDuration] = useState('86400') // default 1 day
  const { createAuction, isPending: auctionPending } = useCreateAuction()
  
  // Rent
  const [pricePerDay, setPricePerDay] = useState('')
  const { listForRent, isPending: rentPending } = useListForRent()

  const isPending = listPending || auctionPending || rentPending

  const validateBase = () => {
    if (!nftAddress || !/^0x[a-fA-F0-9]{40}$/.test(nftAddress)) {
      toast.error('Invalid NFT Contract Address')
      return false
    }
    if (!tokenId || isNaN(Number(tokenId))) {
      toast.error('Invalid Token ID')
      return false
    }
    return true
  }

  const handleListFixed = async () => {
    if (!validateBase() || !price || isNaN(Number(price))) {
      if (!price) toast.error('Enter a valid price')
      return
    }
    try {
      const tx = await listItem(nftAddress as `0x${string}`, BigInt(tokenId), price)
      if (tx) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Successfully listed for sale!</span>
            <a href={getTxUrl(tx)} target="_blank" rel="noreferrer" className="text-xs underline text-white/70 hover:text-white">View tx</a>
          </div>
        )
        setLocation(`/nft/${nftAddress}/${tokenId}`)
      }
    } catch (e) {
      toast.error(parseContractError(e))
    }
  }

  const handleCreateAuction = async () => {
    if (!validateBase() || !startingPrice || isNaN(Number(startingPrice))) {
      if (!startingPrice) toast.error('Enter a valid starting price')
      return
    }
    try {
      const tx = await createAuction(nftAddress as `0x${string}`, BigInt(tokenId), startingPrice, BigInt(duration))
      if (tx) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Auction created successfully!</span>
            <a href={getTxUrl(tx)} target="_blank" rel="noreferrer" className="text-xs underline text-white/70 hover:text-white">View tx</a>
          </div>
        )
        setLocation(`/nft/${nftAddress}/${tokenId}`)
      }
    } catch (e) {
      toast.error(parseContractError(e))
    }
  }

  const handleListRent = async () => {
    if (!validateBase() || !pricePerDay || isNaN(Number(pricePerDay))) {
      if (!pricePerDay) toast.error('Enter a valid price per day')
      return
    }
    try {
      const tx = await listForRent(nftAddress as `0x${string}`, BigInt(tokenId), pricePerDay)
      if (tx) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Successfully listed for rent!</span>
            <a href={getTxUrl(tx)} target="_blank" rel="noreferrer" className="text-xs underline text-white/70 hover:text-white">View tx</a>
          </div>
        )
        setLocation(`/nft/${nftAddress}/${tokenId}`)
      }
    } catch (e) {
      toast.error(parseContractError(e))
    }
  }

  const onSubmit = () => {
    if (mode === 'fixed') handleListFixed()
    else if (mode === 'auction') handleCreateAuction()
    else if (mode === 'rent') handleListRent()
  }

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">List Your Asset</h1>
        <p className="text-white/50">Choose how you want to offer your NFT to the market.</p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <button
          onClick={() => setMode('fixed')}
          className={cn(
            "p-6 rounded-2xl border transition-all text-left relative overflow-hidden group",
            mode === 'fixed' 
              ? "bg-neon-purple/10 border-neon-purple shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
              : "bg-white/5 border-white/10 hover:bg-white/10"
          )}
        >
          {mode === 'fixed' && <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent pointer-events-none" />}
          <Tag className={cn("w-8 h-8 mb-4", mode === 'fixed' ? "text-neon-purple" : "text-white/50")} />
          <h3 className={cn("text-xl font-bold mb-2", mode === 'fixed' ? "text-white" : "text-white/70")}>Fixed Price</h3>
          <p className="text-sm text-white/50">List your item at a set price for immediate purchase.</p>
        </button>

        <button
          onClick={() => setMode('auction')}
          className={cn(
            "p-6 rounded-2xl border transition-all text-left relative overflow-hidden group",
            mode === 'auction' 
              ? "bg-neon-pink/10 border-neon-pink shadow-[0_0_20px_rgba(236,72,153,0.15)]" 
              : "bg-white/5 border-white/10 hover:bg-white/10"
          )}
        >
          {mode === 'auction' && <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/20 to-transparent pointer-events-none" />}
          <Gavel className={cn("w-8 h-8 mb-4", mode === 'auction' ? "text-neon-pink" : "text-white/50")} />
          <h3 className={cn("text-xl font-bold mb-2", mode === 'auction' ? "text-white" : "text-white/70")}>Auction</h3>
          <p className="text-sm text-white/50">Set a starting price and let buyers bid.</p>
        </button>

        <button
          onClick={() => setMode('rent')}
          className={cn(
            "p-6 rounded-2xl border transition-all text-left relative overflow-hidden group",
            mode === 'rent' 
              ? "bg-neon-cyan/10 border-neon-cyan shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
              : "bg-white/5 border-white/10 hover:bg-white/10"
          )}
        >
          {mode === 'rent' && <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent pointer-events-none" />}
          <Key className={cn("w-8 h-8 mb-4", mode === 'rent' ? "text-neon-cyan" : "text-white/50")} />
          <h3 className={cn("text-xl font-bold mb-2", mode === 'rent' ? "text-white" : "text-white/70")}>Rental</h3>
          <p className="text-sm text-white/50">Earn passive income by renting out utility.</p>
        </button>
      </div>

      <div className="glass-strong border border-white/10 rounded-3xl p-6 md:p-10 relative">
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-8">
          <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200/90 leading-relaxed">
            <strong>Important:</strong> You must approve the marketplace contract to manage your NFT before listing. 
            This interface assumes approval is done. If transactions fail, ensure you've called <code className="bg-black/30 px-1 py-0.5 rounded">setApprovalForAll</code> on your NFT contract first.
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">NFT Contract Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Token ID</label>
              <input
                type="text"
                placeholder="e.g. 1"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="h-px bg-white/10 my-8" />

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'fixed' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Price (MATIC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="Amount"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-purple transition-all text-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">MATIC</div>
                  </div>
                </div>
              )}

              {mode === 'auction' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Starting Price (MATIC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        placeholder="Amount"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink transition-all text-lg"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">MATIC</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Duration</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { label: '1h', val: '3600' },
                        { label: '6h', val: '21600' },
                        { label: '12h', val: '43200' },
                        { label: '24h', val: '86400' },
                        { label: '3d', val: '259200' },
                        { label: '7d', val: '604800' },
                      ].map(d => (
                        <button
                          key={d.val}
                          onClick={() => setDuration(d.val)}
                          className={cn(
                            "py-2 rounded-lg text-sm font-medium border transition-colors",
                            duration === d.val 
                              ? "bg-neon-pink/20 border-neon-pink text-white" 
                              : "bg-black/20 border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {mode === 'rent' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Price Per Day (MATIC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="Amount"
                      value={pricePerDay}
                      onChange={(e) => setPricePerDay(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-cyan transition-all text-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">MATIC / Day</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pt-6">
            <button
              onClick={onSubmit}
              disabled={isPending}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-lg shadow-lg",
                mode === 'fixed' ? "bg-gradient-primary hover:opacity-90" : 
                mode === 'auction' ? "bg-gradient-pink hover:opacity-90" : 
                "bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90",
                isPending && "opacity-70 cursor-not-allowed"
              )}
            >
              {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                mode === 'fixed' ? 'Complete Listing' :
                mode === 'auction' ? 'Start Auction' :
                'List for Rent'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
