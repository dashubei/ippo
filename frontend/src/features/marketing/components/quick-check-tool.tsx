import { useState } from 'react'
import { AnxietySlider } from '@/components/anxiety-slider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import {
  clearQuickCheck,
  loadQuickCheck,
  saveQuickCheck,
} from '@/features/marketing/lib/quick-check-storage'

// ログイン不要で「いまの行動の強さ」を確かめ、端末に 1 件だけ保存できるツール。
// トップページ（LP）に埋め込んで、登録前にお試ししてもらう。
export const QuickCheckTool = () => {
  const [action, setAction] = useState('')
  const [anxiety, setAnxiety] = useState(50)
  const [saved, setSaved] = useState(() => loadQuickCheck())

  const handleSave = () => {
    setSaved(saveQuickCheck({ action: action.trim(), anxiety }))
  }

  const handleClear = () => {
    clearQuickCheck()
    setSaved(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-5">
        <Field label="やってみたい行動（任意）" htmlFor="quick-action">
          <TextInput
            id="quick-action"
            placeholder="例: 会議で1回発言する"
            autoComplete="off"
            value={action}
            onChange={(event) => setAction(event.target.value)}
          />
        </Field>
        <AnxietySlider
          id="quick-anxiety"
          value={anxiety}
          onChange={setAnxiety}
        />
        <Button onClick={handleSave}>この端末に保存（1件）</Button>
      </Card>

      {saved && (
        <Card className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-ink">保存した内容</h3>
            <Button
              variant="ghost"
              className="px-3 py-1.5 text-sm text-ink-soft"
              onClick={handleClear}
            >
              消す
            </Button>
          </div>
          <p className="text-ink">{saved.action || '（行動の記入なし）'}</p>
          <p className="text-sm text-ink-soft">不安の強さ: {saved.anxiety}</p>
          <p className="text-xs leading-relaxed text-ink-soft">
            ※ この端末にのみ 1
            件だけ保存されます。ブラウザのデータを消すと失われます。
          </p>
        </Card>
      )}
    </div>
  )
}
