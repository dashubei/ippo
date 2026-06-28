import { getAnxietyJudgment } from '@/lib/judgment'

// 5 ゾーンの色に調和させたトラックのグラデーション。
const trackGradient = `linear-gradient(to right,
  #8fb8c9 0%,
  #e0c07a 28%,
  #8dbe9a 48%,
  #8dbe9a 62%,
  #eca878 80%,
  #e08c86 100%)`

interface AnxietySliderProps {
  id?: string
  value: number
  onChange: (value: number) => void
  invalid?: boolean
}

export const AnxietySlider = ({
  id,
  value,
  onChange,
  invalid,
}: AnxietySliderProps) => {
  const judgment = getAnxietyJudgment(value)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid place-items-center py-1">
        <div className="relative grid place-items-center">
          <div
            className="absolute size-24 rounded-full opacity-50 blur-2xl transition-colors duration-500"
            style={{ backgroundColor: judgment.accent }}
          />
          <span
            key={judgment.level}
            role="img"
            aria-label={judgment.label}
            className="relative block animate-emoji-pop text-7xl leading-none"
          >
            {judgment.emoji}
          </span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-end justify-end">
          <span
            className="text-4xl font-bold tabular-nums transition-colors duration-500"
            style={{ color: judgment.text }}
          >
            {value}
          </span>
        </div>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-invalid={invalid}
          aria-valuetext={`${value}（${judgment.label}）`}
          className="ippo-anxiety-range h-9 w-full cursor-pointer appearance-none rounded-full"
          style={{ background: trackGradient }}
        />
        <div className="mt-2 flex justify-between text-xs text-ink-soft">
          <span>0 おだやか</span>
          <span>50</span>
          <span>100 とても強い</span>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 transition-colors duration-500"
        style={{
          backgroundColor: judgment.tint,
          border: `1px solid ${judgment.accent}55`,
        }}
        role="status"
        aria-live="polite"
      >
        <h3 className="font-bold" style={{ color: judgment.text }}>
          {judgment.label}
        </h3>
        <p className="mt-1 text-sm text-ink">{judgment.message}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          {judgment.recommendation}
        </p>
      </div>

      <p className="text-center text-xs leading-relaxed text-ink-soft">
        ※
        挑戦の強さの目安です。最適な強さは人によって異なり、専門家の判断に代わるものではありません。
      </p>
    </div>
  )
}
