import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Compass,
  Footprints,
  Gauge,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react'
import { SafetyNote } from '@/components/safety-note'
import { SliderGuide } from '@/components/slider-guide'
import { Card } from '@/components/ui/card'
import { Disclosure } from '@/components/ui/disclosure'
import { approachPairs, actionExamples } from '@/lib/exposure-examples'
import { valueReflectionPrompts } from '@/lib/value-domains'

const Section = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) => (
  <Card className="flex flex-col gap-3 p-5">
    <div className="flex items-center gap-3">
      <span
        className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
    </div>
    {children}
  </Card>
)

export const LearnPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <title>ippo の使い方・考え方</title>
      <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-5 px-4 py-6 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            戻る
          </button>
        </div>

        <header className="flex flex-col gap-2">
          <h1 className="font-rounded text-2xl font-bold text-ink">
            使い方・考え方
          </h1>
          <p className="text-sm leading-relaxed text-ink-soft">
            むずかしく考えなくて大丈夫。気になるところだけ読んでみてください。
          </p>
        </header>

        <Section icon={<Compass size={20} />} title="価値ってなんだろう">
          <p className="text-sm leading-relaxed text-ink">
            価値とは「どんな自分でありたいか」という心の方向です。ゴール（達成して終わること）とは少し違って、ずっと向かい続けられるもの。正解も完成もありません。
          </p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft">
            <li>
              <span className="font-bold text-ink">目標とのちがい：</span>
              「資格に合格する」は目標、「学び続ける」が価値。
            </li>
            <li>
              <span className="font-bold text-ink">気持ちとのちがい：</span>
              「不安をなくす」より「不安があっても誠実でいる」。
            </li>
            <li>
              <span className="font-bold text-ink">自分を中心に：</span>
              他の人の評価ではなく、あなたが大切にしたいことを。
            </li>
          </ul>
          <Disclosure
            summary="言葉にしにくいときは"
            icon={
              <Lightbulb size={18} aria-hidden="true" className="text-accent" />
            }
          >
            <p className="mb-2">
              下の問いに、ひとつだけ答えてみると見つかりやすくなります。
            </p>
            <ul className="flex flex-col gap-1.5">
              {valueReflectionPrompts.map((prompt) => (
                <li key={prompt} className="text-ink">
                  ・{prompt}
                </li>
              ))}
            </ul>
          </Disclosure>
        </Section>

        <Section icon={<Footprints size={20} />} title="行動の決め方">
          <p className="text-sm leading-relaxed text-ink">
            価値に向かって、少し不安があっても踏み出せそうな
            <strong>小さな一歩</strong>
            を選びます。下げるためでなく、近づくために。
          </p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft">
            <li>
              <span className="font-bold text-ink">避けるより、近づく：</span>
              「〜しないようにする」ではなく「自分から〜する」の形に。
            </li>
            <li>
              <span className="font-bold text-ink">具体的に：</span>
              誰に・どこで・どのくらい、まで決めると動きやすい。
            </li>
            <li>
              <span className="font-bold text-ink">お守りを一つ手放す：</span>
              スマホ・付き添い・お酒など、いつも頼るものを一つだけ。
            </li>
            <li>
              <span className="font-bold text-ink">やる前に予想を：</span>
              「何が起きると怖い？」を書いておき、あとで実際と見くらべると、新しい発見につながります。
            </li>
          </ul>
          <Disclosure
            summary="行動の例を見る"
            icon={
              <Lightbulb size={18} aria-hidden="true" className="text-accent" />
            }
          >
            <p className="mb-2 font-bold text-ink">
              避ける → 近づく に言いかえると
            </p>
            <ul className="mb-3 flex flex-col gap-1.5">
              {approachPairs.map((pair) => (
                <li key={pair.approach}>
                  <span className="text-ink-soft line-through">
                    {pair.avoid}
                  </span>
                  {' → '}
                  <span className="font-bold text-ink">{pair.approach}</span>
                </li>
              ))}
            </ul>
            <p className="mb-2 font-bold text-ink">小さな行動の例</p>
            <ul className="flex flex-wrap gap-1.5">
              {actionExamples.map((example) => (
                <li
                  key={example}
                  className="rounded-full bg-white/70 px-3 py-1 text-ink"
                >
                  {example}
                </li>
              ))}
            </ul>
          </Disclosure>
        </Section>

        <Section icon={<Gauge size={20} />} title="点数の付け方">
          <SliderGuide />
          <p className="text-xs leading-relaxed text-ink-soft">
            記録画面のスライダーにある「自分の目盛りを決める」から、あなたの
            0・50・100 を設定できます。
          </p>
        </Section>

        <Section icon={<ShieldCheck size={20} />} title="安全に使うために">
          <p className="text-sm leading-relaxed text-ink">
            ippo
            は医療・診断・治療のためのものではなく、セルフヘルプ／教育のツールです。うまくいかない日があっても大丈夫。無理はしないでください。
          </p>
          <div className="rounded-2xl bg-white/60 p-4">
            <p className="text-sm font-bold text-ink">
              次のようなときは、自分だけで取り組まず、専門の窓口や支援者に相談してください。
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-ink-soft">
              <li>・強い希死念慮や、自分を傷つけたい気持ちがあるとき</li>
              <li>
                ・抑えられないパニックや、強い動悸・息苦しさが繰り返し起きるとき
              </li>
              <li>・現実感のなさや、つらい記憶のフラッシュバックがあるとき</li>
              <li>・飲酒や薬に頼らないと取り組めないとき</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              取り組んで調子が悪くなったときも、いったん中断して専門家に相談を。
            </p>
          </div>
          <SafetyNote />
        </Section>

        <div className="pb-[calc(env(safe-area-inset-bottom)+1rem)] text-center">
          <Link to="/exposures" className="text-sm font-bold text-accent">
            記録をはじめる
          </Link>
        </div>
      </main>
    </>
  )
}
