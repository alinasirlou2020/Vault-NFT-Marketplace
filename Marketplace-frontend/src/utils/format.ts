import { formatEther, parseEther } from 'viem'

/** Format a bigint wei value to a human-readable MATIC string */
export function formatMatic(wei: bigint | undefined | null, decimals = 4): string {
  if (wei == null) return '0'
  const eth = formatEther(wei)
  const num = parseFloat(eth)
  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'
  return num.toFixed(decimals).replace(/\.?0+$/, '')
}

/** Parse a MATIC string to bigint wei */
export function parseMatic(matic: string): bigint {
  try {
    return parseEther(matic)
  } catch {
    return 0n
  }
}

/** Shorten an Ethereum address */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/** Format a Unix timestamp to a readable date */
export function formatDate(timestamp: number | bigint): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp
  if (!ts || ts === 0) return 'N/A'
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Format a Unix timestamp to a relative time (e.g. "2 hours ago") */
export function timeAgo(timestamp: number | bigint): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp
  if (!ts) return ''
  const diff = Date.now() / 1000 - ts
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

/** Calculate time remaining until a Unix timestamp */
export function timeUntil(endTimestamp: number | bigint): string {
  const ts = typeof endTimestamp === 'bigint' ? Number(endTimestamp) : endTimestamp
  const diff = ts - Date.now() / 1000
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const mins = Math.floor((diff % 3600) / 60)
  const secs = Math.floor(diff % 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
}

/** Check if a timestamp is in the future */
export function isActive(endTimestamp: number | bigint): boolean {
  const ts = typeof endTimestamp === 'bigint' ? Number(endTimestamp) : endTimestamp
  return ts > Date.now() / 1000
}

/** Format a number with commas */
export function formatNumber(n: number | bigint): string {
  return Number(n).toLocaleString()
}

/** Clamp a string to a max length with ellipsis */
export function truncate(str: string, maxLen = 32): string {
  if (!str) return ''
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str
}
