import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from '@/components/ui/spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white',
  secondary: 'border border-white/70 bg-white/70 text-ink backdrop-blur-md',
  ghost: 'bg-transparent text-ink',
  danger: 'bg-danger text-white',
}

export const Button = ({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading}
    className={`${base} ${variants[variant]} ${className}`}
    {...rest}
  >
    {loading && <Spinner size={18} decorative />}
    {children}
  </button>
)
