import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import type { NavItem } from '@/components/nav/nav-items'

interface AppMenuProps {
  items: NavItem[]
  onLogout: () => void
}

// モバイル用のハンバーガーメニュー。sm 以上ではヘッダーの横並びタブに切り替わるため描画しない。
export const AppMenu = ({ items, onLogout }: AppMenuProps) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // 開いている間だけ背景スクロールを止め、フォーカスをシートへ移す。閉じたらトリガーへ戻す。
  useEffect(() => {
    if (!open) return
    const trigger = buttonRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
      trigger?.focus()
    }
  }, [open])

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label="メニューを開く"
        aria-expanded={open}
        aria-controls="app-menu-panel"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-2xl text-ink transition-colors hover:bg-ink/5"
      >
        <Menu size={24} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 animate-soft-fade bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            id="app-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="メニュー"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 flex animate-sheet-up flex-col gap-2 rounded-t-3xl border-t border-white/70 bg-cream/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-8px_44px_-12px_rgba(75,63,54,0.28)] backdrop-blur-2xl outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="ml-2 text-sm font-bold text-ink-soft">
                メニュー
              </span>
              <button
                type="button"
                aria-label="メニューを閉じる"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-2xl text-ink-soft transition-colors hover:bg-ink/5"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center rounded-2xl px-4 text-base font-bold transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-ink hover:bg-ink/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-1 border-t border-ink/5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onLogout()
                }}
                className="flex min-h-12 w-full items-center gap-2 rounded-2xl px-4 text-base font-bold text-ink-soft transition-colors hover:bg-ink/5"
              >
                <LogOut size={18} aria-hidden="true" />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
