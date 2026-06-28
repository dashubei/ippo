import type { ReactNode } from 'react'

interface ErrorTextProps {
  id?: string
  children: ReactNode
}

export const ErrorText = ({ id, children }: ErrorTextProps) => (
  <p
    id={id}
    role="alert"
    className="rounded-lg bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger"
  >
    {children}
  </p>
)
