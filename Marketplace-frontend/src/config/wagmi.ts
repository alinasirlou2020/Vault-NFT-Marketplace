import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { polygonAmoy } from './chain'

export const wagmiConfig = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "7bd4e51411045acebe02e4a7e9d240d2",
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(
      import.meta.env.VITE_RPC_URL ||
        "https://cold-silent-theorem.matic-amoy.quiknode.pro/f88dbb4e0fa6438699bb7207e0f1feee29b7edfe/",
    ),
  },
  ssr: false,
});
