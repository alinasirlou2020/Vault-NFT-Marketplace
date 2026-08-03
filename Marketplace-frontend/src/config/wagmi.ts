import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { polygonAmoy } from './chain'

export const wagmiConfig = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "542c06313f51345944e5c24809c43754",
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(
      import.meta.env.VITE_RPC_URL ||
        "https://polygon-amoy.g.alchemy.com/v2/alch_8Th5MQpThiuUqaFeYUkwe",
    ),
  },
  ssr: false,
});
