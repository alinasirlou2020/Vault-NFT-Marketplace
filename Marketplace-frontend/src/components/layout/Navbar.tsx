import { Link, useLocation } from 'wouter'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { LayoutDashboard, Menu, X, Hexagon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [location] = useLocation()
  const { isConnected } = useAccount()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/auctions', label: 'Auctions' },
    { href: '/rentals', label: 'Rentals' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        scrolled ? 'glass-strong border-white/10 py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-neon-purple group-hover:text-neon-cyan transition-colors" />
            <span className="text-xl font-bold tracking-tight gradient-text">NexusMarket</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:text-white',
                  location === link.href ? 'bg-white/10 text-white shadow-sm' : 'text-white/70'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="polygon-badge px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Amoy Testnet
          </div>
          
          {isConnected && (
            <Link
              href="/dashboard"
              className={cn(
                'p-2 rounded-full transition-colors hover:bg-white/10 text-white/70 hover:text-white',
                location === '/dashboard' && 'bg-white/10 text-white'
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}
          
          <ConnectButton showBalance={false} chainStatus="none" />
          
          {isConnected && (
            <Link
              href="/list"
              className="bg-gradient-primary hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover-glow"
            >
              List NFT
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass-strong border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  location === link.href ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-white/10 my-2" />
            
            {isConnected && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-3"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/list"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium bg-gradient-primary text-white text-center shadow-lg"
                >
                  List NFT
                </Link>
              </>
            )}
            
            <div className="flex justify-center mt-2 pb-2">
              <ConnectButton showBalance={false} chainStatus="none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
