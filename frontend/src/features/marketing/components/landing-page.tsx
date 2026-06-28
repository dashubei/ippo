import { Link } from 'react-router-dom'
import { BookOpen, Compass, Footprints, Sparkles } from 'lucide-react'
import { SafetyNote } from '@/components/safety-note'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QuickCheckTool } from '@/features/marketing/components/quick-check-tool'

const steps = [
  {
    icon: <Compass size={20} aria-hidden="true" />,
    title: '価値を決める',
    body: 'どんな人でありたいか、自分が大切にしたい「価値」を言葉にします。',
  },
  {
    icon: <Footprints size={20} aria-hidden="true" />,
    title: '小さな一歩を計画',
    body: '価値に向かって、少し不安があっても踏み出せそうな行動を記録します。',
  },
  {
    icon: <Sparkles size={20} aria-hidden="true" />,
    title: 'やってみて、振り返る',
    body: '実施前後の気持ちを記録し、これまでの一歩をカレンダーで振り返ります。',
  },
]

export const LandingPage = () => (
  <>
    {/* OG/Twitter/JSON-LD は index.html に静的記載（OG スクレイパは JS 非実行のため）。
        ここではクライアント遷移時のタイトルのみ設定する。 */}
    <title>ippo — 価値に紐づく小さな一歩を記録する</title>

    <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-10 px-6 py-12 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-wide text-accent">
          大切にしたいこと × 小さな一歩
        </p>
        <h1 className="text-4xl leading-tight font-bold text-ink">
          価値に紐づく、
          <br />
          小さな一歩を。
        </h1>
        <p className="leading-relaxed text-ink-soft">
          社交場面の不安に、自分が大切にしたい「価値」と結びつけて、少しずつ慣れていく取り組みを記録・振り返るセルフヘルプアプリです。
        </p>
      </header>

      {/* 登録前に試せるクイックチェック（ログイン不要・この端末に保存） */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-ink">まずは試してみる</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            気になっている行動が、いま挑戦するのにちょうどよい強さかを、ログインなしで確かめられます。
          </p>
        </div>
        <QuickCheckTool />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-ink">記録すると、できること</h2>
        {steps.map((step) => (
          <Card key={step.title} className="flex items-start gap-4 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
              {step.icon}
            </span>
            <div>
              <h3 className="font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          </Card>
        ))}
        <Link
          to="/learn"
          className="inline-flex items-center justify-center gap-1.5 self-center text-sm font-bold text-accent"
        >
          <BookOpen size={16} aria-hidden="true" />
          使い方・考え方を見る
        </Link>
      </section>

      <div className="flex flex-col gap-3">
        <p className="text-center text-sm leading-relaxed text-ink-soft">
          続けて記録し、価値に紐づけて振り返るには、アカウント登録を。
        </p>
        <Link to="/register">
          <Button className="w-full">アカウント登録</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            ログイン
          </Button>
        </Link>
      </div>

      <SafetyNote />
    </main>
  </>
)
