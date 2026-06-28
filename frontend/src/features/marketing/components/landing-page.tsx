import { Link } from 'react-router-dom'
import { SafetyNote } from '@/components/safety-note'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const steps = [
  {
    title: '価値を決める',
    body: 'どんな人でありたいか、自分が大切にしたい「価値」を言葉にします。',
  },
  {
    title: '小さな一歩を計画',
    body: '価値に向かって、少し不安があっても踏み出せそうな行動を記録します。',
  },
  {
    title: 'やってみて、振り返る',
    body: '実施前後の気持ちを記録し、これまでの一歩をカレンダーで振り返ります。',
  },
]

export const LandingPage = () => (
  <>
    {/* OG/Twitter/JSON-LD は index.html に静的記載（OG スクレイパは JS 非実行のため）。
        ここではクライアント遷移時のタイトルのみ設定する。 */}
    <title>ippo — 価値に紐づく小さな一歩を記録する</title>

    <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col justify-center gap-10 px-6 py-16 pt-[calc(env(safe-area-inset-top)+2.5rem)]">
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
          社交場面の不安に、自分が大切にしたい「価値」と結びつけて、少しずつ慣れていく取り組み（曝露）を記録・振り返るセルフヘルプアプリです。
        </p>
      </header>

      <section className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <Card key={step.title} className="flex items-start gap-4 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 font-bold text-accent">
              {index + 1}
            </span>
            <div>
              <h2 className="font-bold text-ink">{step.title}</h2>
              <p className="text-sm leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <div className="flex flex-col gap-3">
        <Link to="/register">
          <Button className="w-full">新規登録</Button>
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
