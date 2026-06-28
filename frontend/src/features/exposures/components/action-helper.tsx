import { Lightbulb } from 'lucide-react'
import { Disclosure } from '@/components/ui/disclosure'
import {
  approachPairs,
  actionExamples,
  safetyBehaviorExamples,
  specificityPrompts,
} from '@/lib/exposure-examples'

// 「行動」を回避でなく接近の形で、具体的に決めるための足場かけ。
// タップで入力欄に下書きを入れる（自動提案ではなく本人が選ぶ）。
export const ActionHelper = ({
  onPick,
}: {
  onPick: (text: string) => void
}) => (
  <Disclosure
    summary="行動が決められないときは"
    icon={<Lightbulb size={18} aria-hidden="true" className="text-accent" />}
  >
    <p className="mb-3">
      近いものをタップすると下書きになります。自由に書きかえられます。
    </p>

    <div className="mb-4 flex flex-wrap gap-1.5">
      {actionExamples.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onPick(example)}
          className="min-h-9 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-ink transition-colors hover:bg-white/90"
        >
          {example}
        </button>
      ))}
    </div>

    <p className="mb-1.5 font-bold text-ink">「避ける」より「近づく」に</p>
    <ul className="mb-4 flex flex-col gap-1.5">
      {approachPairs.map((pair) => (
        <li key={pair.approach}>
          <button
            type="button"
            onClick={() => onPick(pair.approach)}
            className="flex min-h-11 w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/60"
          >
            <span className="text-ink-soft line-through">{pair.avoid}</span>
            <span aria-hidden="true">→</span>
            <span className="font-bold text-ink">{pair.approach}</span>
          </button>
        </li>
      ))}
    </ul>

    <p className="mb-1">
      <span className="font-bold text-ink">具体的にするには：</span>
      {specificityPrompts.join(' / ')}
    </p>
    <p>
      <span className="font-bold text-ink">手放す「お守り」の例：</span>
      {safetyBehaviorExamples.join(' / ')}
    </p>
  </Disclosure>
)
