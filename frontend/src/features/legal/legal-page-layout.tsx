import type { MouseEvent, ReactNode } from 'react'
import { ArrowUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

const LAST_UPDATED = '2026年6月29日'

export interface LegalSectionData {
  id: string
  title: string
  body: ReactNode
  // 相談窓口など、条番号を振らずやわらかく強調したいセクション
  highlight?: boolean
}

interface LegalPageLayoutProps {
  documentTitle: string
  heading: string
  intro?: ReactNode
  sections: LegalSectionData[]
}

// スムーズスクロールは prefers-reduced-motion を尊重する（scrollIntoView は CSS 上書きの影響を受けない）。
const smoothScrollTo = (target: Element | null) => {
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: reduce ? 'auto' : 'smooth',
    block: 'start',
  })
}

export const LegalPageLayout = ({
  documentTitle,
  heading,
  intro,
  sections,
}: LegalPageLayoutProps) => {
  let counter = 0
  const items = sections.map((section) => {
    if (section.highlight) return { ...section, number: null }
    counter += 1
    return { ...section, number: counter }
  })

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    smoothScrollTo(document.getElementById(id))
    history.replaceState(null, '', `#${id}`)
  }

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <>
      <title>{documentTitle}</title>
      <main className="stagger mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-6 px-4 py-6 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <header className="flex flex-col gap-2">
          <p className="font-rounded text-sm font-bold tracking-wide text-accent">
            ippo
          </p>
          <h1 className="font-rounded text-2xl font-bold text-ink">
            {heading}
          </h1>
          {intro}
        </header>

        {/* 公開前に弁護士等の確認を要する雛形。本番文面としても読めるよう、控えめな注記として残す。 */}
        <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-xs leading-relaxed text-ink-soft">
          本ページは現在準備中の暫定版です。内容は予告なく変更される場合があり、公開にあたっては専門家による確認を行います。
        </p>

        <nav
          aria-label="目次"
          className="rounded-2xl border border-white/70 bg-white/55 p-4"
        >
          <p className="mb-2 text-xs font-bold tracking-wide text-ink-soft">
            目次
          </p>
          <ol className="flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => jumpTo(event, item.id)}
                  className="flex min-h-11 items-center gap-2 text-sm leading-relaxed text-ink-soft transition-colors hover:text-accent"
                >
                  <span className="w-5 shrink-0 text-right font-bold text-accent/70 tabular-nums">
                    {item.number ?? '·'}
                  </span>
                  <span
                    className={item.number == null ? 'font-bold text-ink' : ''}
                  >
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Card className="flex flex-col divide-y divide-ink/5 overflow-hidden p-0">
          {items.map((item) => (
            <section
              key={item.id}
              id={item.id}
              className={`flex scroll-mt-6 flex-col gap-3 p-5 ${
                item.highlight ? 'bg-accent/8' : ''
              }`}
            >
              <h2 className="flex items-baseline gap-2 text-base font-bold text-ink">
                {item.number != null && (
                  <span className="text-accent tabular-nums">
                    {item.number}.
                  </span>
                )}
                {item.title}
              </h2>
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink">
                {item.body}
              </div>
            </section>
          ))}
        </Card>

        <div className="flex items-center justify-between gap-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <p className="text-xs text-ink-soft">最終改定日: {LAST_UPDATED}</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowUp size={16} aria-hidden="true" />
            先頭へ戻る
          </button>
        </div>
      </main>
    </>
  )
}
