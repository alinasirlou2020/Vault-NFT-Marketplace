import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { useRentItem } from '@/hooks/useMarketplace'
import { formatMatic } from '@/utils/format'
import { parseContractError } from '@/utils/errors'
import { getTxUrl } from '@/config/contracts'
import { toast } from 'sonner'
import { useState } from 'react'

interface RentModalProps {
  isOpen: boolean
  onClose: () => void
  nftAddress: `0x${string}`
  tokenId: bigint
  pricePerDay: bigint
}

export function RentModal({ isOpen, onClose, nftAddress, tokenId, pricePerDay }: RentModalProps) {
  const { rentItem, isPending } = useRentItem()
  const [duration, setDuration] = useState(1)

  const handleRent = async () => {
    try {
      const totalCost = pricePerDay * BigInt(duration)
      const txHash = await rentItem(nftAddress, tokenId, BigInt(duration), totalCost)
      if (txHash) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Rented successfully for {duration} days!</span>
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

  const totalCost = formatMatic(pricePerDay * BigInt(duration))

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setDuration(1)
        onClose()
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass-strong border border-neon-cyan/30 p-6 shadow-2xl shadow-neon-cyan/10 rounded-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-cyan" />
              Rent NFT
            </Dialog.Title>
            <Dialog.Close className="text-white/50 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center text-sm bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-white/60">Rate</span>
              <span className="text-neon-cyan font-bold">{formatMatic(pricePerDay)} MATIC <span className="text-white/50 font-normal">/ day</span></span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/80">Duration</label>
                <span className="text-white font-medium bg-black/40 px-3 py-1 rounded-lg border border-white/10">{duration} Days</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>1 Day</span>
                <span>30 Days</span>
              </div>
            </div>

            <div className="h-px bg-white/10 my-2" />
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white">Total Cost</span>
                <span className="text-xs text-white/50">For {duration} days</span>
              </div>
              <span className="text-2xl font-bold text-neon-cyan">{totalCost} MATIC</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Dialog.Close asChild>
              <button className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleRent}
              disabled={isPending}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neon-cyan/20 disabled:hover:text-neon-cyan"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Rental'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
