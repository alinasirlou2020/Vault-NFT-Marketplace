import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { parseEther } from 'viem'
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from '@/config/contracts'

// ─── Read: Marketplace Info ───────────────────────────────────────────────────

export function useMarketplaceInfo() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getMarketplaceInfo',
  })
}

export function useTotalListings() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getTotalListings',
  })
}

export function useIsMarketplacePaused() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'isMarketplacePaused',
  })
}

// ─── Read: Listings ───────────────────────────────────────────────────────────

export function useAllListingTokens() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getAllListingTokens',
  })
}

export function useListings(offset: bigint, limit: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListings',
    args: [offset, limit],
  })
}

export function useListingsBySeller(seller: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListingsBySeller',
    args: seller ? [seller] : undefined,
    query: { enabled: !!seller },
  })
}

export function useListing(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListing',
    args: [nftAddress, tokenId],
  })
}

// ─── Read: Auction ─────────────────────────────────────────────────────────────

export function useAuction(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getAuction',
    args: [nftAddress, tokenId],
  })
}

export function useHighestBid(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getHighestBid',
    args: [nftAddress, tokenId],
  })
}

export function useHighestBidder(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getHighestBidder',
    args: [nftAddress, tokenId],
  })
}

export function useIsAuctionActive(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'isAuctionActive',
    args: [nftAddress, tokenId],
  })
}

export function useAuctionEndTime(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getAuctionEndTime',
    args: [nftAddress, tokenId],
  })
}

// ─── Read: Offer ──────────────────────────────────────────────────────────────

export function useOffer(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getOffer',
    args: [nftAddress, tokenId],
  })
}

// ─── Read: Rental ─────────────────────────────────────────────────────────────

export function useRental(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getRental',
    args: [nftAddress, tokenId],
  })
}

// ─── Read: Proceeds ───────────────────────────────────────────────────────────

export function useProceeds(account: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getProceeds',
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  })
}

// ─── Write: Listing ───────────────────────────────────────────────────────────

export function useListItem() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const listItem = async (nftAddress: `0x${string}`, tokenId: bigint, priceEther: string) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'listItem',
      args: [nftAddress, tokenId, BigInt(parseEther(priceEther))],
    })
  }

  return { listItem, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useCancelListing() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const cancelListing = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelListing',
      args: [nftAddress, tokenId],
    })
  }

  return { cancelListing, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useUpdateListingPrice() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const updatePrice = async (nftAddress: `0x${string}`, tokenId: bigint, newPriceEther: string) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'updateListingPrice',
      args: [nftAddress, tokenId, BigInt(parseEther(newPriceEther))],
    })
  }

  return { updatePrice, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

// ─── Write: Buy ───────────────────────────────────────────────────────────────

export function useBuyItem() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const buyItem = async (nftAddress: `0x${string}`, tokenId: bigint, price: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'buyItem',
      args: [nftAddress, tokenId],
      value: price,
    })
  }

  return { buyItem, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

// ─── Write: Rental ────────────────────────────────────────────────────────────

export function useListForRent() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const listForRent = async (nftAddress: `0x${string}`, tokenId: bigint, pricePerDayEther: string) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'listForRent',
      args: [nftAddress, tokenId, BigInt(parseEther(pricePerDayEther))],
    })
  }

  return { listForRent, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useRentItem() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const rentItem = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    durationInDays: bigint,
    totalCost: bigint,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'rentItem',
      args: [nftAddress, tokenId, durationInDays],
      value: totalCost,
    })
  }

  return { rentItem, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useCancelRental() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const cancelRental = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelRental',
      args: [nftAddress, tokenId],
    })
  }

  return { cancelRental, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useEndRental() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const endRental = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'endRental',
      args: [nftAddress, tokenId],
    })
  }

  return { endRental, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useUpdateRentalPrice() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const updateRentalPrice = async (nftAddress: `0x${string}`, tokenId: bigint, newPriceEther: string) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'updateRentalPrice',
      args: [nftAddress, tokenId, BigInt(parseEther(newPriceEther))],
    })
  }

  return { updateRentalPrice, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

// ─── Write: Offer ─────────────────────────────────────────────────────────────

export function useMakeOffer() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const makeOffer = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    amountEther: string,
    durationDays: bigint,
  ) => {
    const amountWei = BigInt(parseEther(amountEther))
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'makeOffer',
      args: [nftAddress, tokenId, amountWei, durationDays],
      value: amountWei,
    })
  }

  return { makeOffer, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useAcceptOffer() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const acceptOffer = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'acceptOffer',
      args: [nftAddress, tokenId],
    })
  }

  return { acceptOffer, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useCancelOffer() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const cancelOffer = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelOffer',
      args: [nftAddress, tokenId],
    })
  }

  return { cancelOffer, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

// ─── Write: Auction ───────────────────────────────────────────────────────────

export function useCreateAuction() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const createAuction = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    startingPriceEther: string,
    durationSeconds: bigint,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'createAuction',
      args: [nftAddress, tokenId, BigInt(parseEther(startingPriceEther)), durationSeconds],
    })
  }

  return { createAuction, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useBid() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const bid = async (nftAddress: `0x${string}`, tokenId: bigint, bidAmountEther: string) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'bid',
      args: [nftAddress, tokenId],
      value: BigInt(parseEther(bidAmountEther)),
    })
  }

  return { bid, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useEndAuction() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const endAuction = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'endAuction',
      args: [nftAddress, tokenId],
    })
  }

  return { endAuction, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

export function useCancelAuction() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const cancelAuction = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'cancelAuction',
      args: [nftAddress, tokenId],
    })
  }

  return { cancelAuction, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

// ─── Write: Proceeds ─────────────────────────────────────────────────────────

export function useWithdrawProceeds() {
  const { writeContractAsync, isPending, data, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: data })

  const withdrawProceeds = async () => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: 'withdrawProceeds',
    })
  }

  return { withdrawProceeds, isPending: isPending || isConfirming, isSuccess, txHash: data, error }
}

// ─── Convenience: current user proceeds ───────────────────────────────────────

export function useMyProceeds() {
  const { address } = useAccount()
  return useProceeds(address)
}

export function useMyListings() {
  const { address } = useAccount()
  return useListingsBySeller(address)
}
