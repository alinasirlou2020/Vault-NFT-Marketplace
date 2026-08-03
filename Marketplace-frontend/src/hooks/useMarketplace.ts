import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "@/config/contracts";

// ─── Shared Types ──────────────────────────────────────────────────────────────

export interface TokenIdentifier {
  nftAddress: `0x${string}`;
  tokenId: bigint;
}

// ─── Read: Marketplace Info ───────────────────────────────────────────────────

/// @dev Matches MarketQuery.MarketplaceInfo exactly: { totalListings, marketplaceFee, feeRecipient }.
/// There is no totalVolume/owner/paused field on-chain — use useOwner() / useIsMarketplacePaused() for those.
export interface MarketplaceInfo {
  totalListings: bigint;
  marketplaceFee: bigint;
  feeRecipient: `0x${string}`;
}

export function useMarketplaceInfo() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getMarketplaceInfo",
  }) as unknown as {
    data: MarketplaceInfo | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useTotalListings() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getTotalListings",
  });
}

export function useIsMarketplacePaused() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "isMarketplacePaused",
  });
}

export function useOwner() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "owner",
  }) as unknown as {
    data: `0x${string}` | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useFeeRecipient() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getFeeRecipient",
  }) as unknown as {
    data: `0x${string}` | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useMarketplaceFee() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getMarketplaceFee",
  }) as unknown as {
    data: bigint | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

// ─── Read: Listings ───────────────────────────────────────────────────────────

/// @dev Raw storage struct returned by getListing(nftAddress, tokenId).
/// No nftAddress/tokenId (you already have those as inputs); HAS index and active.
export interface Listing {
  seller: `0x${string}`;
  price: bigint;
  listedAt: bigint;
  index: bigint;
  active: boolean;
}

/// @dev Aggregated view struct returned by getListings / getListingsBySeller.
/// HAS nftAddress/tokenId; does NOT include active or index — every entry in
/// this array is implicitly active, since removed listings are swap-popped out.
export interface ListingView {
  price: bigint;
  tokenId: bigint;
  nftAddress: `0x${string}`;
  seller: `0x${string}`;
  listedAt: bigint;
}

export function useAllListingTokens() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAllListingTokens",
  }) as unknown as {
    data: TokenIdentifier[] | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useListingToken(index: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getListingToken",
    args: [index],
  }) as unknown as {
    data: TokenIdentifier | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useListings(offset: bigint, limit: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getListings",
    args: [offset, limit],
  }) as unknown as {
    data: ListingView[] | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useListingsBySeller(seller: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getListingsBySeller",
    args: seller ? [seller] : undefined,
    query: { enabled: !!seller },
  }) as unknown as {
    data: ListingView[] | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useListing(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getListing",
    args: [nftAddress, tokenId],
  }) as unknown as {
    data: Listing | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

// ─── Read: Auction ─────────────────────────────────────────────────────────────

/// @dev Raw storage struct returned by getAuction(nftAddress, tokenId).
export interface Auction {
  seller: `0x${string}`;
  highestBidder: `0x${string}`;
  highestBid: bigint;
  startingPrice: bigint;
  startTime: bigint;
  endTime: bigint;
  active: boolean;
  index: bigint;
}

/// @dev Aggregated view struct returned by getAuctions / getAuctionsBySeller.
export interface AuctionView {
  tokenId: bigint;
  nftAddress: `0x${string}`;
  seller: `0x${string}`;
  highestBidder: `0x${string}`;
  highestBid: bigint;
  startingPrice: bigint;
  startTime: bigint;
  endTime: bigint;
  active: boolean;
}

export function useAuction(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAuction",
    args: [nftAddress, tokenId],
  }) as unknown as {
    data: Auction | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useAllAuctionTokens() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAllAuctionTokens",
  }) as unknown as {
    data: TokenIdentifier[] | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useAuctionToken(index: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAuctionToken",
    args: [index],
  }) as unknown as {
    data: TokenIdentifier | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useTotalAuctions() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getTotalAuctions",
  }) as unknown as {
    data: bigint | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useAuctions(offset: bigint, limit: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAuctions",
    args: [offset, limit],
  }) as unknown as {
    data: AuctionView[] | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useAuctionsBySeller(seller: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAuctionsBySeller",
    args: seller ? [seller] : undefined,
    query: { enabled: !!seller },
  }) as unknown as {
    data: AuctionView[] | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useHighestBid(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getHighestBid",
    args: [nftAddress, tokenId],
  });
}

export function useHighestBidder(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getHighestBidder",
    args: [nftAddress, tokenId],
  });
}

export function useIsAuctionActive(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "isAuctionActive",
    args: [nftAddress, tokenId],
  });
}

export function useAuctionEndTime(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAuctionEndTime",
    args: [nftAddress, tokenId],
  });
}

// ─── Read: Offer ──────────────────────────────────────────────────────────────

export interface OfferInfo {
  buyer: `0x${string}`;
  amount: bigint;
  expiresAt: bigint;
  active: boolean;
}

export function useOffer(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getOffer",
    args: [nftAddress, tokenId],
  }) as unknown as {
    data: OfferInfo | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

// ─── Read: Rental ─────────────────────────────────────────────────────────────

/// @dev Raw storage struct returned by getRental(nftAddress, tokenId).
export interface Rental {
  landlord: `0x${string}`;
  tenant: `0x${string}`;
  pricePerDay: bigint;
  startedAt: bigint;
  expiresAt: bigint;
  active: boolean;
  useERC4907: boolean;
  index: bigint;
}

/// @dev Aggregated view struct returned by getRentals / getRentalsByLandlord.
export interface RentalView {
  pricePerDay: bigint;
  expiresAt: bigint;
  tokenId: bigint;
  nftAddress: `0x${string}`;
  landlord: `0x${string}`;
  tenant: `0x${string}`;
  active: boolean;
}

export function useRental(nftAddress: `0x${string}`, tokenId: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getRental",
    args: [nftAddress, tokenId],
  }) as unknown as {
    data: Rental | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useAllRentalTokens() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getAllRentalTokens",
  }) as unknown as {
    data: TokenIdentifier[] | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useRentalToken(index: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getRentalToken",
    args: [index],
  }) as unknown as {
    data: TokenIdentifier | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useTotalRentals() {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getTotalRentals",
  }) as unknown as {
    data: bigint | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useRentals(offset: bigint, limit: bigint) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getRentals",
    args: [offset, limit],
  }) as unknown as {
    data: RentalView[] | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

export function useRentalsByLandlord(landlord: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getRentalsByLandlord",
    args: landlord ? [landlord] : undefined,
    query: { enabled: !!landlord },
  }) as unknown as {
    data: RentalView[] | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

// ─── Read: Proceeds ───────────────────────────────────────────────────────────

export function useProceeds(account: `0x${string}` | undefined) {
  return useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getProceeds",
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  }) as unknown as {
    data: bigint | undefined;
    isLoading: boolean;
    refetch: () => void;
    error: unknown;
  };
}

// ─── Write: Listing ───────────────────────────────────────────────────────────

export function useListItem() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const listItem = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    priceEther: string,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "listItem",
      args: [nftAddress, tokenId, BigInt(parseEther(priceEther))],
    });
  };

  return {
    listItem,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useCancelListing() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const cancelListing = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "cancelListing",
      args: [nftAddress, tokenId],
    });
  };

  return {
    cancelListing,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useUpdateListingPrice() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const updatePrice = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    newPriceEther: string,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "updateListingPrice",
      args: [nftAddress, tokenId, BigInt(parseEther(newPriceEther))],
    });
  };

  return {
    updatePrice,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Write: Buy ───────────────────────────────────────────────────────────────

export function useBuyItem() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const buyItem = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    price: bigint,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "buyItem",
      args: [nftAddress, tokenId],
      value: price,
    });
  };

  return {
    buyItem,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Write: Rental ────────────────────────────────────────────────────────────

export function useListForRent() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const listForRent = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    pricePerDayEther: string,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "listForRent",
      args: [nftAddress, tokenId, BigInt(parseEther(pricePerDayEther))],
    });
  };

  return {
    listForRent,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useRentItem() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const rentItem = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    durationInDays: bigint,
    totalCost: bigint,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "rentItem",
      args: [nftAddress, tokenId, durationInDays],
      value: totalCost,
    });
  };

  return {
    rentItem,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useCancelRental() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const cancelRental = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "cancelRental",
      args: [nftAddress, tokenId],
    });
  };

  return {
    cancelRental,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useEndRental() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const endRental = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "endRental",
      args: [nftAddress, tokenId],
    });
  };

  return {
    endRental,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useUpdateRentalPrice() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const updateRentalPrice = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    newPriceEther: string,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "updateRentalPrice",
      args: [nftAddress, tokenId, BigInt(parseEther(newPriceEther))],
    });
  };

  return {
    updateRentalPrice,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Write: Offer ─────────────────────────────────────────────────────────────

export function useMakeOffer() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const makeOffer = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    amountEther: string,
    durationDays: bigint,
  ) => {
    const amountWei = BigInt(parseEther(amountEther));
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "makeOffer",
      args: [nftAddress, tokenId, amountWei, durationDays],
      value: amountWei,
    });
  };

  return {
    makeOffer,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

/// @dev IMPORTANT: unlike other payable functions, the contract expects msg.value
/// to be the *difference* between the new and current offer amount — NOT the full
/// new amount. If the new price is lower than the current one, msg.value must be 0
/// (the refund of the difference happens automatically on-chain). You must pass the
/// currently active offer amount (e.g. from useOffer) so the correct value can be computed.
export function useUpdateOfferPrice() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const updateOfferPrice = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    currentAmountEther: string,
    newAmountEther: string,
  ) => {
    const currentAmountWei = BigInt(parseEther(currentAmountEther));
    const newAmountWei = BigInt(parseEther(newAmountEther));

    const value =
      newAmountWei > currentAmountWei ? newAmountWei - currentAmountWei : 0n;

    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "updateOfferPrice",
      args: [nftAddress, tokenId, newAmountWei],
      value,
    });
  };

  return {
    updateOfferPrice,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useAcceptOffer() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const acceptOffer = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "acceptOffer",
      args: [nftAddress, tokenId],
    });
  };

  return {
    acceptOffer,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useCancelOffer() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const cancelOffer = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "cancelOffer",
      args: [nftAddress, tokenId],
    });
  };

  return {
    cancelOffer,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Write: Auction ───────────────────────────────────────────────────────────

export function useCreateAuction() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const createAuction = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    startingPriceEther: string,
    durationSeconds: bigint,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "createAuction",
      args: [
        nftAddress,
        tokenId,
        BigInt(parseEther(startingPriceEther)),
        durationSeconds,
      ],
    });
  };

  return {
    createAuction,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useBid() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const bid = async (
    nftAddress: `0x${string}`,
    tokenId: bigint,
    bidAmountEther: string,
  ) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "bid",
      args: [nftAddress, tokenId],
      value: BigInt(parseEther(bidAmountEther)),
    });
  };

  return {
    bid,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useEndAuction() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const endAuction = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "endAuction",
      args: [nftAddress, tokenId],
    });
  };

  return {
    endAuction,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useCancelAuction() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const cancelAuction = async (nftAddress: `0x${string}`, tokenId: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "cancelAuction",
      args: [nftAddress, tokenId],
    });
  };

  return {
    cancelAuction,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Write: Proceeds ─────────────────────────────────────────────────────────

export function useWithdrawProceeds() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const withdrawProceeds = async () => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "withdrawProceeds",
    });
  };

  return {
    withdrawProceeds,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

/// @dev Owner-only. Withdraws only the accumulated marketplace fee balance
/// (sProceeds[feeRecipient]) — never touches other users' pending proceeds.
export function useWithdrawMarketplaceFees() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const withdrawMarketplaceFees = async () => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "withdrawMarketplaceFees",
    });
  };

  return {
    withdrawMarketplaceFees,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Write: Admin ─────────────────────────────────────────────────────────────

export function useSetMarketplaceFee() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const setMarketplaceFee = async (newFeeBasisPoints: bigint) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "setMarketplaceFee",
      args: [newFeeBasisPoints],
    });
  };

  return {
    setMarketplaceFee,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useSetFeeRecipient() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const setFeeRecipient = async (newRecipient: `0x${string}`) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "setFeeRecipient",
      args: [newRecipient],
    });
  };

  return {
    setFeeRecipient,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function usePauseMarketplace() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const pauseMarketplace = async () => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "pauseMarketplace",
    });
  };

  return {
    pauseMarketplace,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useUnpauseMarketplace() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const unpauseMarketplace = async () => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "unpauseMarketplace",
    });
  };

  return {
    unpauseMarketplace,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

export function useTransferOwnership() {
  const { writeContractAsync, isPending, data, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const transferOwnership = async (newOwner: `0x${string}`) => {
    return writeContractAsync({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "transferOwnership",
      args: [newOwner],
    });
  };

  return {
    transferOwnership,
    isPending: isPending || isConfirming,
    isSuccess,
    txHash: data,
    error,
  };
}

// ─── Convenience: current user proceeds ───────────────────────────────────────

export function useMyProceeds() {
  const { address } = useAccount();
  return useProceeds(address);
}

export function useMyListings() {
  const { address } = useAccount();
  return useListingsBySeller(address);
}

export function useMyRentals() {
  const { address } = useAccount();
  return useRentalsByLandlord(address);
}

export function useMyAuctions() {
  const { address } = useAccount();
  return useAuctionsBySeller(address);
}
