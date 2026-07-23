import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { polygonAmoy } from './chain'

export const wagmiConfig = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(
      import.meta.env.VITE_RPC_URL ||
        'https://rpc-amoy.polygon.technology',
    ),
  },
  ssr: false,
})
