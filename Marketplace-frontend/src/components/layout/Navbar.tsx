import { Link, useLocation } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import {
  LayoutDashboard,
  Menu,
  X,
  Hexagon,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/auctions", label: "Auctions" },
    { href: "/rentals", label: "Rentals" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-[#0b0a10]/85 backdrop-blur-md border-white/10 py-3 shadow-lg shadow-black/20"
          : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-neon-purple group-hover:text-neon-cyan transition-colors" />
            <span className="text-xl font-bold tracking-tight gradient-text">
              NexusMarket
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:text-white",
                  location === link.href
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/70",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="polygon-badge px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Amoy Testnet
          </div>

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  className="flex items-center gap-3"
                  ref={dropdownRef}
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="bg-gradient-primary hover:opacity-90 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover-glow"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3">
                        {/* منوی دراپ‌داون ولت */}
                        <div className="relative">
                          <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/10 px-2.5 py-1.5 rounded-full transition-all">
                            <button
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                              className="flex items-center gap-2 text-white text-sm font-medium focus:outline-none"
                            >
                              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-[10px]">
                                💎
                              </div>
                              <span>{account.displayName}</span>
                            </button>

                            <div className="h-4 w-px bg-white/20 mx-1" />

                            <button
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                              className="text-white/70 hover:text-white p-1 transition-transform duration-200 focus:outline-none"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 transition-transform duration-200",
                                  dropdownOpen && "rotate-180",
                                )}
                              />
                            </button>
                          </div>

                          <AnimatePresence>
                            {dropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-56 bg-[#121118]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-1"
                              >
                                <Link
                                  href={
                                    address ? `/profile/${address}` : "/profile"
                                  }
                                  onClick={() => setDropdownOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <User className="w-4 h-4 text-purple-400" />
                                  <span>Profile</span>
                                </Link>

                                <Link
                                  href="/dashboard"
                                  onClick={() => setDropdownOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                                  <span>Dashboard</span>
                                </Link>

                                <div className="h-px bg-white/10 my-1" />

                                <button
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    setDisconnectModalOpen(true);
                                  }}
                                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                >
                                  <LogOut className="w-4 h-4 text-red-400" />
                                  <span>Disconnect</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {disconnectModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                              <div className="w-full max-w-md bg-[#121118]/90 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col items-center text-center relative animate-in fade-in zoom-in duration-200">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                                  <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                  </svg>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">
                                  Disconnect Wallet
                                </h3>
                                <p className="text-white/60 text-sm mb-6">
                                  Are you sure you want to disconnect your
                                  wallet? You can always reconnect anytime.
                                </p>

                                <div className="flex items-center gap-3 w-full">
                                  <button
                                    onClick={() =>
                                      setDisconnectModalOpen(false)
                                    }
                                    className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    onClick={() => {
                                      setDisconnectModalOpen(false);
                                      disconnect();
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-lg shadow-red-600/20"
                                  >
                                    Disconnect
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* دکمه List NFT که فقط زمان اتصال ولت در کنار منو ظاهر می‌شود */}
                        <Link
                          href="/list"
                          className="bg-gradient-primary hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover-glow shadow-md whitespace-nowrap"
                        >
                          List NFT
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0b0a10]/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                  location === link.href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-2" />

            {isConnected && (
              <>
                <Link
                  href={address ? `/profile/${address}` : "/profile"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-3"
                >
                  <User className="w-5 h-5 text-purple-400" />
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-3"
                >
                  <LayoutDashboard className="w-5 h-5 text-purple-400" />
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
  );
}
