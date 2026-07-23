import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { polygonAmoy } from './chain'

export const wagmiConfig = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(
      import.meta.env.VITE_RPC_URL ||
        "https://black-morning-leaf.matic-amoy.quiknode.pro/c2187aafe6d9a121628b152731cf5dd3cb3e6b59/",
    ),
  },
  ssr: false,
});
