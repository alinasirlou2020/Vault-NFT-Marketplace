import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { useBid } from '@/hooks/useMarketplace'
import { formatMatic, parseMatic } from '@/utils/format'
import { parseContractError } from '@/utils/errors'
import { getTxUrl } from '@/config/contracts'
import { toast } from 'sonner'
import { useState } from 'react'

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  nftAddress: `0x${string}`
  tokenId: bigint
  currentPrice: bigint
  isFirstBid: boolean
}

export function BidModal({ isOpen, onClose, nftAddress, tokenId, currentPrice, isFirstBid }: BidModalProps) {
  const { bid, isPending } = useBid()
  const [bidAmount, setBidAmount] = useState('')
  
  const minBidMatic = isFirstBid ? formatMatic(currentPrice) : (Number(formatMatic(currentPrice)) * 1.05).toFixed(4)

  const handleBid = async () => {
    if (!bidAmount || isNaN(Number(bidAmount))) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      const txHash = await bid(nftAddress, tokenId, bidAmount)
      if (txHash) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Bid placed successfully!</span>
            <a href={getTxUrl(txHash)} target="_blank" rel="noreferrer" className="text-xs underline text-white/70 hover:text-white">
              View transaction
            </a>
          </div>
        )
        onClose()
      }
    } catch (e) {
      toast.error(parseContractError(e))
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setBidAmount('')
        onClose()
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass-strong border border-neon-pink/30 p-6 shadow-2xl shadow-neon-pink/10 rounded-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
              Place a Bid
            </Dialog.Title>
            <Dialog.Close className="text-white/50 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="text-white/60">{isFirstBid ? 'Starting Price' : 'Current Highest Bid'}</span>
              <span className="text-white font-medium">{formatMatic(currentPrice)} MATIC</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Your Bid (MATIC)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min={minBidMatic}
                  placeholder={`Min ${minBidMatic}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink/50 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium">
                  MATIC
                </div>
              </div>
              <p className="text-xs text-white/40">
                You must bid at least {minBidMatic} MATIC. Funds will be locked in the contract until you are outbid or the auction ends.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Dialog.Close asChild>
              <button className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleBid}
              disabled={isPending || !bidAmount || Number(bidAmount) < Number(minBidMatic)}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-pink text-white hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Place Bid'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
