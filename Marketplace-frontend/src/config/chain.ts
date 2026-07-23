import { defineChain } from 'viem'

export const polygonAmoy = defineChain({
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        import.meta.env.VITE_RPC_URL ||
          'https://rpc-amoy.polygon.technology',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: import.meta.env.VITE_EXPLORER_URL || 'https://amoy.polygonscan.com',
      apiUrl: 'https://api-amoy.polygonscan.com/api',
    },
  },
  testnet: true,
})
