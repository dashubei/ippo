import { Link } from 'react-router-dom'
import {
  BookOpen,
  Compass,
  Footprints,
  Heart,
  HeartHandshake,
  Sparkles,
} from 'lucide-react'
import { SafetyNote } from '@/components/safety-note'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QuickCheckTool } from '@/features/marketing/components/quick-check-tool'

const helps = [
  {
    icon: <Heart size={20} aria-hidden="true" />,
    title: '不安な気持ちに気づく',
    body: '人と関わる場面でドキドキしたり、緊張したりする気持ちを、そのまま受け止めます。',
  },
  {
    icon: <HeartHandshake size={20} aria-hidden="true" />,
    title: '大切にしたいことを見つける',
    body: '不安をなくすことより、自分がどんなふうに過ごしたいかに目を向けます。',
  },
  {
    icon: <Footprints size={20} aria-hidden="true" />,
    title: '小さな一歩を踏み出す',
    body: 'できそうなことを、ひとつずつ。無理のないペースで、少しずつ楽になっていきます。',
  },
]

const steps = [
  {
    icon: <Compass size={20} aria-hidden="true" />,
    title: '大切にしたいことを決める',
    body: 'どんなふうに過ごしたいか、自分が大切にしたいことを言葉にできます。',
  },
  {
    icon: <Footprints size={20} aria-hidden="true" />,
    title: '小さな一歩を計画する',
    body: '大切にしたいことに向けて、少し勇気のいる行動を計画できます。',
  },
  {
    icon: <Sparkles size={20} aria-hidden="true" />,
    title: 'やってみて、振り返る',
    body: 'やってみた前後の気持ちを残し、これまでの一歩をカレンダーで振り返れます。',
  },
]

export const LandingPage = () => (
  <>
    {/* OG/Twitter/JSON-LD は index.html に静的記載（OG スクレイパは JS 非実行のため）。
        ここではクライアント遷移時のタイトルのみ設定する。 */}
    <title>ippo — 価値に紐づく小さな一歩を記録する</title>

    <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-10 px-6 py-12 pt-[calc(env(safe-area-inset-top)+2rem)]">
      {/* ファーストビューは操作カードを最上段に。説明より先に触れてもらう。 */}
      <section className="flex flex-col gap-4">
        <p className="text-center text-sm leading-relaxed text-ink-soft">
          これは評価ではありません。誰にも見られず、正解もありません。
        </p>
        <QuickCheckTool />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-ink">これが、何の役に立つの？</h2>
        {helps.map((help) => (
          <Card key={help.title} className="flex items-start gap-4 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
              {help.icon}
            </span>
            <div>
              <h3 className="font-bold text-ink">{help.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                {help.body}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <div className="flex flex-col gap-3">
        <p className="text-center text-sm leading-relaxed text-ink-soft">
          続けて記録するには、無料で登録できます。
        </p>
        <Link to="/register">
          <Button className="w-full">無料で登録</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            ログイン
          </Button>
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-ink">登録すると、できること</h2>
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
      </section>

      {/* キャッチコピー・サービス説明はファーストビューから下部へ。 */}
      <section className="flex flex-col gap-3">
        <img
          src="/illustrations/hero-person.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="mx-auto w-40 sm:w-48"
        />
        <p className="text-sm font-bold tracking-wide text-accent">
          大切にしたいこと × 小さな一歩
        </p>
        <h2 className="text-3xl leading-tight font-bold text-ink">
          価値に紐づく、
          <br />
          小さな一歩を。
        </h2>
        <p className="leading-relaxed text-ink-soft">
          人と関わる場面の不安に、自分が大切にしたいことと結びつけて、少しずつ慣れていく取り組みを記録・振り返るセルフヘルプアプリです。
        </p>
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
