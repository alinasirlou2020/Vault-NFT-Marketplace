import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: { 
          background: 'hsl(240,8%,7%)', 
          border: '1px solid rgba(139,92,246,0.3)', 
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        },
        classNames: { 
          success: 'border-emerald-500/30 text-emerald-100', 
          error: 'border-red-500/30 text-red-100' 
        }
      }}
    />
  )
}
