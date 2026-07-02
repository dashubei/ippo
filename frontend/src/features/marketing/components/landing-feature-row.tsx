import { Card } from '@/components/ui/card'
import { Illustration } from '@/components/ui/illustration'

interface FeatureRowProps {
  src: string
  width: number
  height: number
  title: string
  body: string
  /** 交互配置でリズムを出すため、奇数番はイラストを右に寄せる。 */
  reverse?: boolean
}

export const LandingFeatureRow = ({
  src,
  width,
  height,
  title,
  body,
  reverse = false,
}: FeatureRowProps) => (
  <Card
    className={`flex items-center gap-4 p-4 sm:gap-6 sm:p-5 ${
      reverse ? 'flex-row-reverse' : 'flex-row'
    }`}
  >
    <span className="grid size-20 shrink-0 place-items-center rounded-full bg-accent/10 sm:size-24">
      <Illustration
        src={src}
        width={width}
        height={height}
        className="w-14 sm:w-16"
      />
    </span>
    <div className="flex-1">
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  </Card>
)
