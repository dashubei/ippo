import type { TextareaHTMLAttributes } from 'react'

export const Textarea = ({
  className = '',
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full rounded-2xl border border-ink-soft/40 bg-white px-4 py-3 text-ink outline-none placeholder:text-ink-soft focus-visible:border-accent aria-[invalid=true]:border-danger ${className}`}
    {...rest}
  />
)
