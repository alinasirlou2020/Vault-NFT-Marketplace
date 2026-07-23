import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'

// ERC721 minimal ABI for tokenURI and name
const ERC721_ABI = [
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

export interface NftMetadata {
  name?: string
  description?: string
  image?: string
  attributes?: Array<{ trait_type: string; value: string | number }>
  external_url?: string
}

function resolveIpfs(uri: string): string {
  if (!uri) return ''
  if (uri.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`
  }
  if (uri.startsWith('https://') || uri.startsWith('http://')) {
    return uri
  }
  return uri
}

export function useTokenURI(
  nftAddress: `0x${string}` | undefined,
  tokenId: bigint | undefined,
) {
  return useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: !!nftAddress && tokenId !== undefined },
  })
}

export function useCollectionName(nftAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'name',
    query: { enabled: !!nftAddress },
  })
}

export function useNftMetadata(
  nftAddress: `0x${string}` | undefined,
  tokenId: bigint | undefined,
) {
  const { data: tokenURI } = useTokenURI(nftAddress, tokenId)
  const [metadata, setMetadata] = useState<NftMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tokenURI) return
    setIsLoading(true)
    setError(null)

    const url = resolveIpfs(tokenURI)

    fetch(url)
      .then((r) => r.json())
      .then((data: NftMetadata) => {
        // Resolve image IPFS
        if (data.image) {
          data.image = resolveIpfs(data.image)
        }
        setMetadata(data)
      })
      .catch((e) => {
        setError(e.message)
        // Fallback metadata
        setMetadata({
          name: `Token #${tokenId?.toString()}`,
          image: undefined,
        })
      })
      .finally(() => setIsLoading(false))
  }, [tokenURI, tokenId])

  return { metadata, isLoading, error, tokenURI }
}

// Generate a deterministic placeholder gradient for NFTs without images
export function getNftPlaceholderStyle(nftAddress: string, tokenId: bigint | string): string {
  const seed = parseInt(nftAddress.slice(2, 10), 16) + Number(tokenId)
  const hue1 = (seed * 137) % 360
  const hue2 = (hue1 + 60) % 360
  return `linear-gradient(135deg, hsl(${hue1},80%,40%), hsl(${hue2},70%,60%))`
}
