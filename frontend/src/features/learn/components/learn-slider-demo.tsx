import { useState } from 'react'

// 記録画面の不安スライダーと同じ見た目の練習用デモ。値はどこにも保存されず、
// フォームや記録には一切影響しない（触って感覚を掴んでもらうためだけの部品）。
const demoTrackGradient = 'linear-gradient(to right, #f8e6d6 0%, #c2673f 100%)'

const getDemoMessage = (value: number) => {
  if (value <= 33) return 'まったく平気'
  if (value <= 66) return 'ドキドキするけど、やれそう'
  return '自分にとって、かなりきつい'
}

export const LearnSliderDemo = () => {
  const [value, setValue] = useState(50)

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/60 p-4">
      <label
        htmlFor="learn-slider-demo"
        className="text-sm font-medium text-ink"
      >
        試しに動かしてみる
      </label>
      <p
        className="text-center text-3xl font-bold text-accent tabular-nums"
        aria-hidden="true"
      >
        {value}
      </p>
      <input
        id="learn-slider-demo"
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        aria-valuetext={`${value}（${getDemoMessage(value)}）`}
        className="ippo-anxiety-range h-9 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: demoTrackGradient }}
      />
      <div className="flex justify-between text-xs text-ink-soft">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <p
        className="text-center text-sm font-bold text-ink"
        role="status"
        aria-live="polite"
      >
        {getDemoMessage(value)}
      </p>
    </div>
  )
}
