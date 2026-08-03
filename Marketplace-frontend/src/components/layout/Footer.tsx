import { Link } from 'wouter'
import { Hexagon, Twitter, Github, MessageCircle } from 'lucide-react'
import { MARKETPLACE_ADDRESS, getAddressUrl } from '@/config/contracts'
import { shortenAddress } from '@/utils/format'
import { useState } from 'react'

export function Footer() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(MARKETPLACE_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] pt-16 pb-8 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <Hexagon className="w-6 h-6 text-neon-purple group-hover:text-neon-cyan transition-colors" />
              <span className="text-xl font-bold tracking-tight text-white">Vault Market</span>
            </Link>
            <p className="text-white/50 mb-6 max-w-sm">
              The future of digital ownership. Trade, auction, and rent extraordinary NFTs on the Polygon Amoy Testnet.
            </p>
            <div className="polygon-badge inline-flex px-3 py-1.5 rounded-full text-xs font-semibold items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              Built on Polygon Amoy
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-3">
              <li><Link href="/explore" className="text-white/50 hover:text-neon-cyan transition-colors text-sm">Explore</Link></li>
              <li><Link href="/auctions" className="text-white/50 hover:text-neon-pink transition-colors text-sm">Auctions</Link></li>
              <li><Link href="/rentals" className="text-white/50 hover:text-neon-blue transition-colors text-sm">Rentals</Link></li>
              <li><Link href="/dashboard" className="text-white/50 hover:text-white transition-colors text-sm">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contract</h4>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5 mb-3 flex items-center justify-between">
              <span className="text-sm font-mono text-white/70">{shortenAddress(MARKETPLACE_ADDRESS, 6)}</span>
              <button 
                onClick={copyAddress}
                className="text-xs text-neon-purple hover:text-white transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <a 
              href={getAddressUrl(MARKETPLACE_ADDRESS)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-neon-cyan hover:underline inline-flex items-center gap-1"
            >
              View on Explorer ↗
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Vault Market. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
