import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useCreateValue } from '@/features/values/api/values'
import { OnboardingConfirmStep } from '@/features/onboarding/components/onboarding-confirm-step'
import { OnboardingDomainStep } from '@/features/onboarding/components/onboarding-domain-step'
import { OnboardingValueStep } from '@/features/onboarding/components/onboarding-value-step'
import { valueSchema } from '@/features/values/schemas'
import type { ValueDomain } from '@/lib/value-domains'

type Step = 'domain' | 'value' | 'confirm'

const stepOrder: Step[] = ['domain', 'value', 'confirm']

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const createValue = useCreateValue()
  const [step, setStep] = useState<Step>('domain')
  const [domain, setDomain] = useState<ValueDomain | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  // スキップしても価値なしでホームに戻れる（必須にしない）。
  const finish = () => navigate('/home', { replace: true })

  const handleSave = async () => {
    const parsed = valueSchema.safeParse({ name: draft.trim() })
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          '保存できませんでした。入力を確認してください',
      )
      return
    }
    try {
      await createValue.mutateAsync(parsed.data)
      finish()
    } catch {
      setError('保存に失敗しました。時間をおいて再度お試しください')
    }
  }

  const stepIndex = stepOrder.indexOf(step)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-6 px-6 py-10 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold tracking-wide text-accent">
            ステップ {stepIndex + 1} / {stepOrder.length}
          </p>
          <Button
            variant="ghost"
            className="px-3 py-2 text-sm text-ink-soft"
            onClick={finish}
          >
            スキップ
          </Button>
        </div>
        {/* 冒頭ステップのみ。同一人物の胸像で「これからの体験」を物語る（装飾）。 */}
        {step === 'domain' && (
          <img
            src="/illustrations/onboarding-person.svg"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="mx-auto -mb-1 w-24"
          />
        )}
        <h1 className="font-rounded text-2xl font-bold text-ink">
          大切にしたいことを決める
        </h1>
        <p className="text-sm leading-relaxed text-ink-soft">
          まずは一つだけ。完璧な価値でなくて大丈夫です。あとからいつでも変えられます。
        </p>
        {/* 進捗バー。装飾なので SR からは隠す。 */}
        <div aria-hidden="true" className="flex gap-1.5">
          {stepOrder.map((value, index) => (
            <span
              key={value}
              className={`h-1.5 flex-1 rounded-full ${
                index <= stepIndex ? 'bg-accent' : 'bg-ink/10'
              }`}
            />
          ))}
        </div>
      </header>

      {step === 'domain' && (
        <OnboardingDomainStep
          onSelect={(selected) => {
            setDomain(selected)
            setStep('value')
          }}
        />
      )}

      {step === 'value' && domain && (
        <OnboardingValueStep
          domain={domain}
          draft={draft}
          onChange={(value) => {
            setDraft(value)
            if (error) setError(null)
          }}
          onBack={() => setStep('domain')}
          onNext={() => setStep('confirm')}
        />
      )}

      {step === 'confirm' && (
        <OnboardingConfirmStep
          draft={draft.trim()}
          saving={createValue.isPending}
          error={error}
          onBack={() => setStep('value')}
          onSave={handleSave}
        />
      )}
    </main>
  )
}
