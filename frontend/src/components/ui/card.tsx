import type { ReactNode } from 'react'

interface CardProps {
  className?: string
  children: ReactNode
  /** ホバーで浮き上がる装飾を付ける（リンク・ボタン的なカードで使う）。 */
  interactive?: boolean
}

const baseCard =
  'rounded-3xl border border-white/70 bg-white/65 shadow-[0_-2px_40px_rgba(75,63,54,0.12)] backdrop-blur-2xl'

const interactiveCard =
  'transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_18px_44px_-12px_rgba(75,63,54,0.28)] active:scale-[0.99]'

export const Card = ({
  className = '',
  children,
  interactive = false,
}: CardProps) => (
  <div
    className={`${baseCard} ${interactive ? interactiveCard : ''} ${className}`}
  >
    {children}
  </div>
)
