import { Lightbulb } from 'lucide-react'
import { Disclosure } from '@/components/ui/disclosure'
import { LearnSliderDemo } from '@/features/learn/components/learn-slider-demo'
import type { LearnTopic } from '@/features/learn/types/learn'
import { approachPairs, actionExamples } from '@/lib/exposure-examples'
import { valueDomains, valueReflectionPrompts } from '@/lib/value-domains'

const ContentIcon = () => (
  <Lightbulb size={18} aria-hidden="true" className="text-accent" />
)

// 目標（達成して終わる）と方向（ずっと向かい続けられる）の対比。正解を示すのではなく、
// 自分で「これはどっち？」と発見してもらうための材料。
const goalDirectionPairs: { goal: string; direction: string }[] = [
  { goal: '毎日運動する', direction: '健康を大切にする' },
  { goal: '会話を続ける', direction: '人とのつながりを大切にする' },
  { goal: '3人に話しかける', direction: '人に誠実に関わる' },
]

export const valueTopic: LearnTopic = {
  id: 'values',
  title: '価値ってなんだろう',
  estMinutes: 1,
  steps: [
    {
      illustration: {
        src: '/illustrations/peeps/person-standing.svg',
        alt: 'これから歩き出そうとしている人',
      },
      headline: '価値って、進む「方向」のこと',
      body: 'たとえば、久しぶりに会う人にどう接するか迷ったとき。「あたたかく接したい」と思えたら、それがあなたの価値です。価値は、迷ったときに指す“方向”のようなもの。目的地（ゴール）ではなく、歩き続ける方角です。',
    },
    {
      illustration: {
        src: '/illustrations/peeps/pointing.svg',
        alt: '道の先を指している人',
      },
      headline: 'ゴールとは、ちょっと違う',
      body: 'ゴールは、着いたら終わるもの。価値は、その先もずっと歩き続けられる方向です。「資格に合格する」はゴール、「学び続ける」が価値。合格しても、学び続けたい気持ちはなくなりませんよね。',
      extra: (
        <Disclosure
          summary="「これは目標？方向？」を見てみる"
          icon={<ContentIcon />}
        >
          <ul className="flex flex-col gap-2">
            {goalDirectionPairs.map((pair) => (
              <li key={pair.goal}>
                <span className="text-ink">
                  {pair.goal}
                  <span className="text-xs text-ink-soft">（目標）</span>
                </span>
                {' ／ '}
                <span className="font-bold text-ink">
                  {pair.direction}
                  <span className="text-xs font-normal text-accent">
                    （方向）
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Disclosure>
      ),
    },
    {
      illustration: {
        src: '/illustrations/peeps/easing.svg',
        alt: '肩の力をぬいている人',
      },
      headline: '気分や、人の目では決まらない',
      body: '「人からどう見られるか」で選ぶと、いつのまにか自分の方向を見失いがちです。価値は、あなた自身が「大切にしたい」と思うこと。気分が乗らない日も、それで価値そのものが変わるわけではありません。',
      extra: (
        <Disclosure summary="もう少しくわしく" icon={<ContentIcon />}>
          <ul className="flex flex-col gap-1.5">
            <li>・他人の評価より、自分の「大切」を基準に。</li>
            <li>
              ・「不安をなくす」より「不安があっても、大切にしたいことをする」。
            </li>
            <li>
              ・例：気が乗らない朝でも、「あいさつを大切にする人」ではいられる。
            </li>
          </ul>
        </Disclosure>
      ),
    },
    {
      illustration: {
        src: '/illustrations/peeps/walking.svg',
        alt: '歩いている人',
      },
      headline: 'あなたの「方向」を探してみよう',
      body: '正解はありません。少し気になった問いに、ひとつだけ答えてみましょう。',
      extra: (
        <div className="flex flex-col gap-3">
          <p className="text-base font-bold leading-relaxed text-ink">
            {valueReflectionPrompts[0]}
          </p>
          <Disclosure summary="ほかの問いも見る" icon={<ContentIcon />}>
            <ul className="flex flex-col gap-1.5">
              {valueReflectionPrompts.slice(1).map((prompt) => (
                <li key={prompt} className="text-ink">
                  ・{prompt}
                </li>
              ))}
            </ul>
          </Disclosure>
          <div className="flex flex-wrap gap-1.5">
            {valueDomains.map((domain) => (
              <span
                key={domain.label}
                className="rounded-full bg-white/70 px-3 py-1 text-sm text-ink"
              >
                {domain.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-soft">
            気になったものから、で大丈夫。
          </p>
        </div>
      ),
    },
  ],
  finalCta: { label: '価値を書いてみる', to: '/values' },
}

export const actionTopic: LearnTopic = {
  id: 'action',
  title: '行動の決め方',
  estMinutes: 1,
  steps: [
    {
      illustration: {
        src: '/illustrations/peeps/walking.svg',
        alt: '歩き出している人',
      },
      headline: '価値に向かう、小さな一歩',
      body: '価値（＝どんな自分でありたいかの方向）が見えてきたら、そちらへ「少し不安があっても踏み出せそうな一歩」を選びます。不安を下げるためではなく、価値に近づくために。たとえば「人とのつながりを大切にする」なら、“雑談に一言だけ加わってみる”のように。',
    },
    {
      illustration: {
        src: '/illustrations/peeps/pointing.svg',
        alt: '方向を指している人',
      },
      headline: '「避ける」より「近づく」',
      body: '「〜しないようにする」ではなく「自分から〜する」の形にすると、一歩が具体的になります。',
      extra: (
        <Disclosure summary="言いかえと、コツを見る" icon={<ContentIcon />}>
          <ul className="mb-3 flex flex-col gap-1.5">
            {approachPairs.map((pair) => (
              <li key={pair.approach}>
                <span className="text-ink-soft line-through">{pair.avoid}</span>
                {' → '}
                <span className="font-bold text-ink">{pair.approach}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-1.5">
            <li>・具体的に：誰に・どこで・どのくらい、まで決める。</li>
            <li>
              ・「お守り」（スマホ・付き添い・お酒など）を一つ手放して、自分の力でやってみるのも一つの選び方。
            </li>
            <li>
              ・やる前に「何が起きると怖い？」を書いておき、あとで実際と見くらべる。
            </li>
          </ul>
        </Disclosure>
      ),
    },
    {
      illustration: {
        src: '/illustrations/peeps/person-standing.svg',
        alt: '立って準備している人',
      },
      headline: '小さな行動を選んでみよう',
      body: '自分の価値（＝大切にしたい方向）に近づきそうなものを、気になるものだけ、ひとつ。',
      extra: (
        <ul className="flex flex-wrap gap-1.5">
          {actionExamples.map((example) => (
            <li
              key={example}
              className="rounded-full bg-white/70 px-3 py-1 text-sm text-ink"
            >
              {example}
            </li>
          ))}
        </ul>
      ),
    },
  ],
  finalCta: { label: '記録をはじめる', to: '/exposures/new' },
}

export const scoreTopic: LearnTopic = {
  id: 'score',
  title: '点数の付け方',
  estMinutes: 1,
  steps: [
    {
      illustration: {
        src: '/illustrations/peeps/resting.svg',
        alt: 'ひと息ついている人',
      },
      headline: '点数は、不安の「強さ」の目安',
      body: '0〜100は、不安の強さをはかる目盛りです。点数を下げることが目的ではありません。怖さがあっても、価値に向かって一歩進めたこと自体が前進です。',
    },
    {
      headline: '動かして、感じをつかもう',
      body: '「0＝まったく平気」「100＝自分にとって一番きつい」。今の感じは、どのあたり？ 下のバーを動かしてみてください。',
      extra: (
        <div className="flex flex-col gap-2">
          <LearnSliderDemo />
          <p className="text-xs text-ink-soft">
            ※これは一般的な目安です。感じ方には個人差があります（次で、自分の目盛りを決めます）。
          </p>
        </div>
      ),
    },
    {
      illustration: {
        src: '/illustrations/peeps/sitting-relax.svg',
        alt: '落ち着いてすわっている人',
      },
      headline: '自分の目盛りを決めておこう',
      body: '記録画面のスライダーにある「自分の目盛りを決める」から、あなたの 0・50・100 を設定できます。まんなかより少し上（ドキドキするけれど、なんとかやれそう）が、練習にちょうどよい目安です。',
      extra: (
        <div className="flex flex-col gap-1.5 rounded-2xl bg-white/60 p-3 text-sm text-ink-soft">
          <p className="font-bold text-ink">
            目盛りの決め方の例（人によって違います）
          </p>
          <p>・0：家でひとり、くつろいでいるとき</p>
          <p>・50：その中間くらい、少しそわそわする場面</p>
          <p>・100：これまでで一番きつかった場面</p>
        </div>
      ),
    },
  ],
  finalCta: { label: '記録をはじめる', to: '/exposures/new' },
}

export const learnTopics = [valueTopic, actionTopic, scoreTopic]
