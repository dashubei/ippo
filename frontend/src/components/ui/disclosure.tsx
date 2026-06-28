import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface DisclosureProps {
  summary: ReactNode
  children: ReactNode
  icon?: ReactNode
  defaultOpen?: boolean
}

// 一度に情報を詰め込まないためのプログレッシブ開示。<details> でゼロ JS・SR 対応。
export const Disclosure = ({
  summary,
  children,
  icon,
  defaultOpen = false,
}: DisclosureProps) => (
  <details
    open={defaultOpen}
    className="group rounded-2xl border border-white/70 bg-white/60 backdrop-blur-md"
  >
    <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-3 font-bold text-ink [&::-webkit-details-marker]:hidden">
      {icon}
      <span className="flex-1">{summary}</span>
      <ChevronDown
        size={18}
        aria-hidden="true"
        className="shrink-0 text-ink-soft transition-transform group-open:rotate-180"
      />
    </summary>
    <div className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">
      {children}
    </div>
  </details>
)
