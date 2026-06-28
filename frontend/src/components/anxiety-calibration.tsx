import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import type { AnxietyAnchors } from '@/lib/anxiety-anchors'

interface AnxietyCalibrationProps {
  initial: AnxietyAnchors | null
  onSave: (input: { low: string; mid: string; high: string }) => void
  onClose: () => void
}

// 0/50/100 を「過去の具体的な体験」に結びつけて、自分用の目盛りを作る。
export const AnxietyCalibration = ({
  initial,
  onSave,
  onClose,
}: AnxietyCalibrationProps) => {
  const [low, setLow] = useState(initial?.low ?? '')
  const [mid, setMid] = useState(initial?.mid ?? '')
  const [high, setHigh] = useState(initial?.high ?? '')

  const handleSave = () => {
    onSave({ low, mid, high })
    onClose()
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-ink">
        点数に「正解」はありません。一般的な状況ではなく、
        <strong className="font-bold">あなたが実際に体験した場面</strong>
        を思い出すと、目盛りが安定します。空欄のままでも大丈夫です。
      </p>
      <Field label="0 ＝ まったく平気だった場面" htmlFor="anchor-low">
        <TextInput
          id="anchor-low"
          placeholder="例: 家族とくつろいで話していたとき"
          autoComplete="off"
          value={low}
          onChange={(event) => setLow(event.target.value)}
        />
      </Field>
      <Field
        label="50 ＝ 落ち着かなかったが、なんとかいられた、過去の一場面"
        htmlFor="anchor-mid"
      >
        <TextInput
          id="anchor-mid"
          placeholder="例: 会議で意見を求められたとき"
          autoComplete="off"
          value={mid}
          onChange={(event) => setMid(event.target.value)}
        />
      </Field>
      <Field label="100 ＝ これまでで一番きつかった場面" htmlFor="anchor-high">
        <TextInput
          id="anchor-high"
          placeholder="例: 大勢の前で発表して頭が真っ白になったとき"
          autoComplete="off"
          value={high}
          onChange={(event) => setHigh(event.target.value)}
        />
      </Field>
      <p className="text-xs leading-relaxed text-ink-soft">
        ※ この目盛りはこの端末にのみ保存されます。
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          あとで
        </Button>
        <Button className="flex-1" onClick={handleSave}>
          この目盛りにする
        </Button>
      </div>
    </div>
  )
}
