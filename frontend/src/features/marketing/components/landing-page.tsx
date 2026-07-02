import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { SafetyNote } from '@/components/safety-note'
import { Button } from '@/components/ui/button'
import { Illustration } from '@/components/ui/illustration'
import { LandingFeatureRow } from '@/features/marketing/components/landing-feature-row'
import { LandingHero } from '@/features/marketing/components/landing-hero'
import { QuickCheckTool } from '@/features/marketing/components/quick-check-tool'

const helps = [
  {
    src: '/illustrations/peeps/resting.svg',
    width: 240,
    height: 324,
    title: '不安な気持ちに気づく',
    body: '人と関わる場面でドキドキしたり、緊張したりする気持ちを、そのまま受け止めます。',
  },
  {
    src: '/illustrations/peeps/pointing.svg',
    width: 240,
    height: 324,
    title: '大切にしたいことを見つける',
    body: '不安をなくすことより、自分がどんなふうに過ごしたいかに目を向けます。',
  },
  {
    src: '/illustrations/peeps/walking.svg',
    width: 240,
    height: 324,
    title: '小さな一歩を踏み出す',
    body: 'できそうなことを、ひとつずつ。無理のないペースで、少しずつ楽になっていきます。',
  },
]

const steps = [
  {
    src: '/illustrations/peeps/sitting-crossed.svg',
    width: 240,
    height: 324,
    title: '大切にしたいことを決める',
    body: 'どんなふうに過ごしたいか、自分が大切にしたいことを言葉にできます。',
  },
  {
    src: '/illustrations/peeps/easing.svg',
    width: 240,
    height: 324,
    title: '小さな一歩を計画する',
    body: '大切にしたいことに向けて、少し勇気のいる行動を計画できます。',
  },
  {
    src: '/illustrations/peeps/sitting-relax.svg',
    width: 240,
    height: 324,
    title: 'やってみて、振り返る',
    body: 'やってみた前後の気持ちを残し、これまでの一歩をカレンダーで振り返れます。',
  },
]

export const LandingPage = () => (
  <>
    {/* OG/Twitter/JSON-LD は index.html に静的記載（OG スクレイパは JS 非実行のため）。
        ここではクライアント遷移時のタイトルのみ設定する。 */}
    <title>ippo — 価値に紐づく小さな一歩を記録する</title>

    {/* ログイン/登録は各所に散らさずヘッダーに常設し、いつでも登録できる状態を保つ。 */}
    <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between gap-2 px-6 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2">
        <span className="font-rounded text-xl font-bold tracking-tight text-accent">
          ippo
        </span>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" className="px-3 py-2 text-sm">
              ログイン
            </Button>
          </Link>
          <Link to="/register">
            <Button className="px-4 py-2 text-sm">無料で登録</Button>
          </Link>
        </div>
      </div>
    </header>

    <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-12 px-6 pt-6 pb-12">
      <LandingHero />

      {/* 登録前に触れてもらう操作カード。説明より先に手を動かせる導線として残す。 */}
      <section className="flex flex-col gap-4">
        <p className="text-center text-sm leading-relaxed text-ink-soft">
          まずは、お試しに。これは評価ではありません。誰にも見られず、正解もありません。
        </p>
        <QuickCheckTool />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-bold tracking-widest text-accent">
            WHAT IT DOES
          </p>
          <h2 className="text-xl font-bold text-ink">
            これが、何の役に立つの？
          </h2>
        </div>
        <div className="stagger flex flex-col gap-3">
          {helps.map((help, index) => (
            <LandingFeatureRow
              key={help.title}
              reverse={index % 2 === 1}
              {...help}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-bold tracking-widest text-accent">
            WHAT YOU CAN DO
          </p>
          <h2 className="text-xl font-bold text-ink">登録すると、できること</h2>
        </div>
        <div className="stagger flex flex-col gap-3">
          {steps.map((step, index) => (
            <LandingFeatureRow
              key={step.title}
              reverse={index % 2 === 1}
              {...step}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 text-center">
        <Illustration
          src="/illustrations/peeps/sitting-mid.svg"
          width={240}
          height={324}
          className="animate-float-slow w-32"
        />
        <h2 className="text-xl leading-snug font-bold text-ink">
          あなたのペースで、はじめよう。
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
          焦らなくて大丈夫。今日できそうな、小さな一歩から。
        </p>
        <Link to="/register" className="w-full">
          <Button size="lg" className="w-full">
            無料で登録
          </Button>
        </Link>
        <Link
          to="/learn"
          className="mt-1 inline-flex items-center justify-center gap-1.5 self-center text-sm font-bold text-accent"
        >
          <BookOpen size={16} aria-hidden="true" />
          詳しい使い方・考え方を見る
        </Link>
      </section>

      <SafetyNote />
    </main>
  </>
)
