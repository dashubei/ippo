import { cloneElement, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { ErrorText } from '@/components/ui/error-text'

interface FieldProps {
  label: string
  htmlFor?: string
  error?: string
  children: ReactNode
}

interface ControlAria {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export const Field = ({ label, htmlFor, error, children }: FieldProps) => {
  const errorId = error && htmlFor ? `${htmlFor}-error` : undefined

  // エラー時は入力要素へ aria-describedby / aria-invalid を結び付けて SR に読み上げさせる。
  const control =
    errorId && isValidElement(children)
      ? cloneElement(children as ReactElement<ControlAria>, {
          'aria-describedby': errorId,
          'aria-invalid': true,
        })
      : children

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {control}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  )
}
