import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { Card } from '@/components/ui/card'

const LAST_UPDATED = '2026年6月29日'

interface LegalSectionProps {
  title: string
  children: ReactNode
}

// 規約・PP・免責で共通の見出し付きセクション。番号付き条文と本文を同じ体裁で並べる。
export const LegalSection = ({ title, children }: LegalSectionProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-base font-bold text-ink">{title}</h2>
    <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink">
      {children}
    </div>
  </section>
)

interface LegalPageLayoutProps {
  documentTitle: string
  heading: string
  intro?: ReactNode
  children: ReactNode
}

export const LegalPageLayout = ({
  documentTitle,
  heading,
  intro,
  children,
}: LegalPageLayoutProps) => {
  const navigate = useNavigate()

  return (
    <>
      <title>{documentTitle}</title>
      <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-5 px-4 py-6 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            戻る
          </button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
          >
            <Home size={18} aria-hidden="true" />
            トップ
          </Link>
        </div>

        <header className="flex flex-col gap-2">
          <h1 className="font-rounded text-2xl font-bold text-ink">
            {heading}
          </h1>
          {intro}
        </header>

        {/* 公開前に弁護士等の確認を要する雛形。本番文面としても読めるよう、控えめな注記として残す。 */}
        <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-xs leading-relaxed text-ink-soft">
          本ページは現在準備中の暫定版です。内容は予告なく変更される場合があり、公開にあたっては専門家による確認を行います。
        </p>

        <Card className="flex flex-col gap-6 p-5">{children}</Card>

        <p className="pb-[calc(env(safe-area-inset-bottom)+1rem)] text-xs text-ink-soft">
          最終改定日: {LAST_UPDATED}
        </p>
      </main>
    </>
  )
}
