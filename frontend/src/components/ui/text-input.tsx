import type { InputHTMLAttributes } from 'react'

export const TextInput = ({
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`min-h-11 w-full rounded-2xl border border-ink-soft/40 bg-white px-4 py-3 text-ink outline-none placeholder:text-ink-soft focus-visible:border-accent aria-[invalid=true]:border-danger ${className}`}
    {...rest}
  />
)
