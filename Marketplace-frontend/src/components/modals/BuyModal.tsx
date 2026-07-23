import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'
import { useBuyItem, useMarketplaceInfo } from '@/hooks/useMarketplace'
import { formatMatic } from '@/utils/format'
import { parseContractError } from '@/utils/errors'
import { getTxUrl } from '@/config/contracts'
import { toast } from 'sonner'

interface BuyModalProps {
  isOpen: boolean
  onClose: () => void
  nftAddress: `0x${string}`
  tokenId: bigint
  price: bigint
  nftName?: string
  imageUrl?: string
}

export function BuyModal({ isOpen, onClose, nftAddress, tokenId, price, nftName, imageUrl }: BuyModalProps) {
  const { buyItem, isPending } = useBuyItem()
  const { data: info } = useMarketplaceInfo()
  
  const handleBuy = async () => {
    try {
      const txHash = await buyItem(nftAddress, tokenId, price)
      if (txHash) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span>Purchase successful!</span>
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

  const feeBps = info ? info.marketplaceFee : 0n
  // For display only, the smart contract calculates the fee internally, but the buyer pays the `price` exact.
  // Wait, does the buyer pay `price` + `fee` or just `price`?
  // Let's assume the buyer sends exact `price` as MSG.VALUE and seller receives price - fee.

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass-strong border border-white/10 p-6 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-white">Complete Purchase</Dialog.Title>
            <Dialog.Close className="text-white/50 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="flex gap-4 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden flex-shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt={nftName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-cyan opacity-50" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm text-white/50 mb-1">You are buying</div>
              <div className="font-semibold text-white truncate max-w-[200px]">{nftName || `Token #${tokenId.toString()}`}</div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Item Price</span>
              <span className="text-white font-medium">{formatMatic(price)} MATIC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Marketplace Fee</span>
              <span className="text-white/60">Included ({Number(feeBps) / 100}%)</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-white">Total</span>
              <span className="text-xl font-bold text-neon-purple">{formatMatic(price)} MATIC</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Dialog.Close asChild>
              <button className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleBuy}
              disabled={isPending}
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Purchase'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
