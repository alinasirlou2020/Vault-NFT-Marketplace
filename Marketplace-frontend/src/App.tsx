import '@rainbow-me/rainbowkit/styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { Route, Switch, Router as WouterRouter } from 'wouter'

import { wagmiConfig } from '@/config/wagmi'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toaster'

import { HomePage } from '@/pages/HomePage'
import { ExplorePage } from '@/pages/ExplorePage'
import { AuctionsPage } from '@/pages/AuctionsPage'
import { RentalsPage } from '@/pages/RentalsPage'
import { NftDetailPage } from '@/pages/NftDetailPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ListPage } from '@/pages/ListPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 15_000,
      refetchOnWindowFocus: false,
    },
  },
})

const rkTheme = darkTheme({
  accentColor: '#8b5cf6',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
})

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/auctions" component={AuctionsPage} />
      <Route path="/rentals" component={RentalsPage} />
      <Route path="/nft/:nftAddress/:tokenId" component={NftDetailPage} />
      <Route path="/profile/:address" component={ProfilePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/list" component={ListPage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme} modalSize="compact">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </WouterRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
