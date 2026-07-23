import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { Hexagon } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8 backdrop-blur-md shadow-[0_0_50px_rgba(139,92,246,0.15)]">
          <Hexagon className="w-12 h-12 text-neon-purple/50" />
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-white mb-4 tracking-tighter mix-blend-screen glitch-text relative">
          <span className="absolute -left-1 text-neon-pink/70 z-[-1]">404</span>
          404
          <span className="absolute left-1 text-neon-cyan/70 z-[-1]">404</span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Block Not Found</h2>
        <p className="text-white/50 max-w-md mx-auto mb-10">
          The asset, profile, or contract you're looking for doesn't exist on this chain.
        </p>
        
        <Link 
          href="/" 
          className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm flex items-center gap-2"
        >
          Return to Hub
        </Link>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .glitch-text {
          text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75);
          animation: glitch 500ms infinite;
        }
        @keyframes glitch {
          0% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.05em -0.025em 0 rgba(0,255,0,0.75), -0.025em 0.05em 0 rgba(0,0,255,0.75); }
          14% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.05em -0.025em 0 rgba(0,255,0,0.75), -0.025em 0.05em 0 rgba(0,0,255,0.75); }
          15% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75), 0.025em 0.025em 0 rgba(0,255,0,0.75), -0.05em -0.05em 0 rgba(0,0,255,0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75), 0.025em 0.025em 0 rgba(0,255,0,0.75), -0.05em -0.05em 0 rgba(0,0,255,0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75), 0.05em 0 0 rgba(0,255,0,0.75), 0 -0.05em 0 rgba(0,0,255,0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75), 0.05em 0 0 rgba(0,255,0,0.75), 0 -0.05em 0 rgba(0,0,255,0.75); }
          100% { text-shadow: -0.025em 0 0 rgba(255,0,0,0.75), -0.025em -0.025em 0 rgba(0,255,0,0.75), -0.025em -0.05em 0 rgba(0,0,255,0.75); }
        }
      `}} />
    </div>
  )
}
