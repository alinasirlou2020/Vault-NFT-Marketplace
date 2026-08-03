import MARKETPLACE_ABI from "@/abi/Marketplace.json";

export { MARKETPLACE_ABI };

export const MARKETPLACE_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ||
  ("0x1A38c0D63f7c985BB8a33E39D4133FA70D10a413" as const);

export const MARKETPLACE_CONTRACT = {
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
} as const;

export const EXPLORER_URL =
  import.meta.env.VITE_EXPLORER_URL || "https://amoy.polygonscan.com";

export function getTxUrl(hash: string) {
  return `${EXPLORER_URL}/tx/${hash}`;
}

export function getAddressUrl(address: string) {
  return `${EXPLORER_URL}/address/${address}`;
}

export function getTokenUrl(address: string, tokenId: string) {
  return `${EXPLORER_URL}/token/${address}?a=${tokenId}`;
}
