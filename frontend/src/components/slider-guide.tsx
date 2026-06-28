import { Ruler, Scale, Sprout } from 'lucide-react'
import type { ReactNode } from 'react'

const Point = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) => (
  <section className="flex gap-3">
    <span
      className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent"
      aria-hidden="true"
    >
      {icon}
    </span>
    <div className="flex flex-col gap-1">
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink">{children}</p>
    </div>
  </section>
)

// 「点数の付け方」の心理教育。スライダーのモーダルと /learn の両方から使う共有コンテンツ。
export const SliderGuide = () => (
  <div className="flex flex-col gap-5">
    <Point
      icon={<Ruler size={18} />}
      title="点数は「正解」ではなく、あなたの目盛り"
    >
      0〜100
      は他人と比べるためのものではありません。「0＝まったく平気」「100＝自分にとって一番きつい」を思い出して、今回はそのどのあたりか、で大丈夫です。自分の目盛りを一度決めておくと、毎回つけやすくなります。
    </Point>
    <Point
      icon={<Scale size={18} />}
      title="ちょうどよい強さは、まんなかより少し上くらい"
    >
      やさしすぎると練習になりにくく、きつすぎると続けづらくなります。「ドキドキするけれど、なんとかやれそう」くらいが、一歩を踏み出す練習にちょうどよい目安です。最適な強さは人によって違います。
    </Point>
    <Point
      icon={<Sprout size={18} />}
      title="点数を下げることは、目標ではありません"
    >
      不安が下がったかどうかで、うまくいったかを決めなくて大丈夫。怖さがあっても、自分の価値に向かって一歩進めたこと自体が前進です。
    </Point>
  </div>
)
