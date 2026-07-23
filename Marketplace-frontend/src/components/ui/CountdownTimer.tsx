import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function CountdownTimer({ 
  endTime, 
  urgent = false 
}: { 
  endTime: bigint | number; 
  urgent?: boolean 
}) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isEnded, setIsEnded] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    const end = typeof endTime === 'bigint' ? Number(endTime) : endTime
    
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      const diff = end - now
      
      if (diff <= 0) {
        setTimeLeft('Ended')
        setIsEnded(true)
        setIsUrgent(false)
        return
      }

      setIsEnded(false)
      setIsUrgent(urgent || diff < 3600) // Less than 1 hour

      const days = Math.floor(diff / 86400)
      const hours = Math.floor((diff % 86400) / 3600)
      const mins = Math.floor((diff % 3600) / 60)
      const secs = Math.floor(diff % 60)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${mins}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`)
      } else {
        setTimeLeft(`${mins}m ${secs}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [endTime, urgent])

  return (
    <div className={cn(
      "font-mono font-medium tracking-tight",
      isEnded ? "text-white/50" : isUrgent ? "text-neon-pink pulse-urgent" : "text-white"
    )}>
      {timeLeft}
    </div>
  )
}
