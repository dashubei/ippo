import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** 背景タップで閉じる。入力フォームでは false にして誤消失を防ぐ。 */
  dismissibleByBackdrop?: boolean
}

// モバイルはボトムシート、デスクトップは中央ダイアログ。Esc・（任意で）背景タップで閉じる。
export const Modal = ({
  open,
  onClose,
  title,
  children,
  dismissibleByBackdrop = true,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const appRoot = document.getElementById('root')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    // 背後をフォーカス・SR から隔離（簡易フォーカストラップ）。
    appRoot?.setAttribute('inert', '')
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      appRoot?.removeAttribute('inert')
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  // Card 等の backdrop-filter/transform は position:fixed の包含ブロックになるため、
  // モーダルは body へポータルして画面全体を覆う。
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={dismissibleByBackdrop ? onClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 max-h-[90svh] w-full max-w-screen-sm animate-sheet-up overflow-y-auto rounded-t-3xl bg-cream p-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] shadow-[0_-2px_40px_rgba(75,63,54,0.2)] outline-none sm:animate-panel-rise sm:rounded-3xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-lg font-bold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white/70 text-ink-soft shadow-sm backdrop-blur-md transition-colors hover:bg-white/90"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
