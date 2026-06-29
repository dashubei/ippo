import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'

interface OnboardingConfirmStepProps {
  draft: string
  saving: boolean
  error: string | null
  onBack: () => void
  onSave: () => void
}

export const OnboardingConfirmStep = ({
  draft,
  saving,
  error,
  onBack,
  onSave,
}: OnboardingConfirmStepProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <h2 className="font-bold text-ink">これで保存しますか</h2>
      <p className="text-sm leading-relaxed text-ink-soft">
        完璧な言葉でなくて大丈夫です。あとからいつでも変えられます。
      </p>
    </div>

    <Card className="p-5">
      <p className="text-xs text-ink-soft">あなたが大切にしたいこと</p>
      <p className="mt-1 text-lg leading-relaxed font-bold text-ink">{draft}</p>
    </Card>

    {error && <ErrorText>{error}</ErrorText>}

    <div className="flex gap-3">
      <Button
        variant="secondary"
        className="flex-1"
        onClick={onBack}
        disabled={saving}
      >
        もどる
      </Button>
      <Button className="flex-1" loading={saving} onClick={onSave}>
        保存する
      </Button>
    </div>
  </div>
)
