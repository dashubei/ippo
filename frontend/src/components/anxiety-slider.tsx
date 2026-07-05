import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Ruler } from 'lucide-react'
import { getAnxietyJudgment } from '@/lib/judgment'
import { useAnxietyAnchors } from '@/hooks/use-anxiety-anchors'
import { Modal } from '@/components/ui/modal'
import { AnxietyCalibration } from '@/components/anxiety-calibration'
import { SliderGuide } from '@/components/slider-guide'
import { SafetyNote } from '@/components/safety-note'

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
  const { anchors, saveAnchors } = useAnxietyAnchors()
  const [guideOpen, setGuideOpen] = useState(false)
  const [calibrateOpen, setCalibrateOpen] = useState(false)
  const [safetyOpen, setSafetyOpen] = useState(false)

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
            className="text-base font-bold tabular-nums transition-colors duration-500"
            style={{ color: judgment.text }}
          >
            {value}
          </span>
          <span className="ml-1 pb-0.5 text-xs text-ink-soft">あたり</span>
        </div>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="不安の強さ（0〜100）"
          aria-invalid={invalid}
          aria-valuetext={`${value}（${judgment.label}）`}
          className="ippo-anxiety-range h-9 w-full cursor-pointer appearance-none rounded-full"
          style={{ background: trackGradient }}
        />
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs leading-snug text-ink-soft">
          <span className="line-clamp-2">
            <span className="font-bold text-ink">0</span>{' '}
            {anchors?.low || 'おだやか'}
          </span>
          <span className="line-clamp-2 text-center">
            <span className="font-bold text-ink">50</span>{' '}
            {anchors?.mid || 'その中間'}
          </span>
          <span className="line-clamp-2 text-right">
            <span className="font-bold text-ink">100</span>{' '}
            {anchors?.high || 'とても強い'}
          </span>
        </div>
        <p className="mt-2 text-center text-xs leading-relaxed text-ink-soft">
          ぴったりの数字でなくて大丈夫。今の気持ちの目安で動かしてください。
        </p>
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
        <p className="font-bold" style={{ color: judgment.text }}>
          {judgment.label}
        </p>
        <p className="mt-1 text-sm text-ink">{judgment.message}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          {judgment.recommendation}
        </p>
      </div>

      {judgment.level === 'hard' && (
        <button
          type="button"
          onClick={() => setSafetyOpen(true)}
          className="text-center text-xs font-bold text-accent underline"
        >
          不安が強すぎると感じたら：安全に使うために
        </button>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 text-xs font-bold text-ink backdrop-blur-md transition-colors hover:bg-white/80"
        >
          <HelpCircle size={16} aria-hidden="true" className="text-accent" />
          点数の付け方
        </button>
        <button
          type="button"
          onClick={() => setCalibrateOpen(true)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 text-xs font-bold text-ink backdrop-blur-md transition-colors hover:bg-white/80"
        >
          <Ruler size={16} aria-hidden="true" className="text-accent" />
          {anchors ? '目盛りを編集' : '自分の目盛りを決める'}
        </button>
      </div>

      {!anchors && (
        <p className="text-center text-xs leading-relaxed text-ink-soft">
          自分の「0・50・100」を決めておくと、点数がつけやすくなります。
        </p>
      )}

      <p className="text-center text-xs leading-relaxed text-ink-soft">
        ※
        挑戦の強さの目安です。最適な強さは人によって異なり、専門家の判断に代わるものではありません。
      </p>

      <Modal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        title="点数の付け方"
      >
        <SliderGuide />
      </Modal>
      <Modal
        open={calibrateOpen}
        onClose={() => setCalibrateOpen(false)}
        title="自分の目盛りを決める"
        dismissibleByBackdrop={false}
      >
        <AnxietyCalibration
          initial={anchors}
          onSave={saveAnchors}
          onClose={() => setCalibrateOpen(false)}
        />
      </Modal>
      <Modal
        open={safetyOpen}
        onClose={() => setSafetyOpen(false)}
        title="安全に使うために"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-ink">
            不安がとても強いときは、無理をせず、いったん立ち止まって大丈夫です。挑戦はもう少し取り組みやすい一歩に分けてみましょう。
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
          </div>
          <SafetyNote />
          <Link
            to="/learn"
            className="text-center text-sm font-bold text-accent underline"
          >
            詳しい使い方・考え方を見る
          </Link>
        </div>
      </Modal>
    </div>
  )
}
