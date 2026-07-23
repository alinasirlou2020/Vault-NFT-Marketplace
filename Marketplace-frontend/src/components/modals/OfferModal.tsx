import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { useMakeOffer } from '@/hooks/useMarketplace'
import { parseContractError } from '@/utils/errors'
import { getTxUrl } from '@/config/contracts'
import { toast } from 'sonner'
import { useState } from 'react'

interface OfferModalProps {
  isOpen: boolean
  onClose: () => void
  nftAddress: `0x${string}`
  tokenId: bigint
}

export function OfferModal({ isOpen, onClose, nftAddress, tokenId }: OfferModalProps) {
  const { makeOffer, isPending } = useMakeOffer()
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('7')

  const handleOffer = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!duration || isNaN(Number(duration)) || Number(duration) < 1 || Number(duration) > 30) {
      toast.error('Duration must be between 1 and 30 days')
      return
    }

    try {
      const txHash = await makeOffer(nftAddress, tokenId, amount, BigInt(duration))
      if (txHash) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Offer made successfully!</span>
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
        setAmount('')
        setDuration('7')
        onClose()
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass-strong border border-white/10 p-6 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-white">Make an Offer</Dialog.Title>
            <Dialog.Close className="text-white/50 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-5 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Offer Amount (MATIC)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 5.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium">
                  MATIC
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Duration (Days)</label>
              <div className="flex gap-2">
                {[1, 3, 7, 30].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d.toString())}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      duration === d.toString() 
                        ? 'bg-neon-purple/20 border-neon-purple text-white' 
                        : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">
                Your MATIC will be locked in the contract. You can cancel your offer anytime before it expires.
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
              onClick={handleOffer}
              disabled={isPending || !amount || Number(amount) <= 0}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Offer'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
