import { Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { detectValueHint } from '@/features/values/lib/value-hints'
import type { ValueDomain } from '@/lib/value-domains'

interface OnboardingValueStepProps {
  domain: ValueDomain
  draft: string
  onChange: (value: string) => void
  onBack: () => void
  onNext: () => void
}

export const OnboardingValueStep = ({
  domain,
  draft,
  onChange,
  onBack,
  onNext,
}: OnboardingValueStepProps) => {
  const hint = detectValueHint(draft)
  const canProceed = draft.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-ink">どんな自分でいたいですか</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          近いものをタップすると下書きになります。そのまま使っても、自由に書きかえても大丈夫。正解はありません。
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-ink">{domain.label}</p>
        <div className="flex flex-wrap gap-1.5">
          {domain.examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange(example)}
              className="min-h-9 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-ink transition-colors hover:bg-white/90"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="onboarding-value"
          className="text-sm font-medium text-ink"
        >
          言葉にしてみる
        </label>
        <TextInput
          id="onboarding-value"
          value={draft}
          onChange={(event) => onChange(event.target.value)}
          placeholder="例: 人とのつながりを大切にする"
          autoComplete="off"
        />
      </div>

      {hint && (
        <p
          role="note"
          className="flex items-start gap-1.5 rounded-2xl bg-accent/10 px-3 py-2 text-xs leading-relaxed text-ink"
        >
          <Lightbulb
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-accent"
          />
          <span>{hint}</span>
        </p>
      )}

      {/* 価値・目標・気持ちの違いをやさしく補足。専門語は使わない。 */}
      <p className="rounded-2xl bg-white/60 px-3 py-2 text-xs leading-relaxed text-ink-soft">
        「大切にしたいこと」は、達成して終わるゴールや、そのときの気持ちとは少し違います。どんなふうに過ごしたいか、という向きのことばで大丈夫です。
      </p>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          もどる
        </Button>
        <Button className="flex-1" disabled={!canProceed} onClick={onNext}>
          すすむ
        </Button>
      </div>
    </div>
  )
}
