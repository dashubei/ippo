import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from '@/components/ui/spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-[transform,box-shadow,background-color,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:hover:translate-y-0'

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-4 py-3',
  lg: 'min-h-13 px-6 py-3.5 text-lg',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_8px_20px_-8px_rgba(194,103,63,0.7)] hover:-translate-y-0.5 hover:bg-accent-deep hover:shadow-[0_12px_26px_-8px_rgba(194,103,63,0.8)]',
  secondary:
    'border border-white/70 bg-white/70 text-ink backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/90',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  danger:
    'bg-danger text-white shadow-[0_8px_20px_-8px_rgba(180,69,58,0.7)] hover:-translate-y-0.5 hover:brightness-95',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
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
    className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    {...rest}
  >
    {loading && <Spinner size={18} decorative />}
    {children}
  </button>
)
