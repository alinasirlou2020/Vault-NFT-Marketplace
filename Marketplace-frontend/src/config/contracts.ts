import { MARKETPLACE_ABI } from '@/abi/marketplace'

export { MARKETPLACE_ABI }

export const MARKETPLACE_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x400f2202F0688399b67B9C9c5dBb8696639c1bec'

export const MARKETPLACE_CONTRACT = {
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
} as const

export const EXPLORER_URL =
  import.meta.env.VITE_EXPLORER_URL || 'https://amoy.polygonscan.com'

export function getTxUrl(hash: string) {
  return `${EXPLORER_URL}/tx/${hash}`
}

export function getAddressUrl(address: string) {
  return `${EXPLORER_URL}/address/${address}`
}

export function getTokenUrl(address: string, tokenId: string) {
  return `${EXPLORER_URL}/token/${address}?a=${tokenId}`
}
