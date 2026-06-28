import type { ReactNode } from 'react'

interface CardProps {
  className?: string
  children: ReactNode
}

export const Card = ({ className = '', children }: CardProps) => (
  <div
    className={`rounded-3xl border border-white/70 bg-white/65 shadow-[0_-2px_40px_rgba(75,63,54,0.12)] backdrop-blur-2xl ${className}`}
  >
    {children}
  </div>
)
