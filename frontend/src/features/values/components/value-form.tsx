import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Disclosure } from '@/components/ui/disclosure'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import { applyApiFieldErrors } from '@/lib/form'
import { useCreateValue } from '@/features/values/api/values'
import { detectValueHint } from '@/features/values/lib/value-hints'
import { valueSchema, type ValueInput } from '@/features/values/schemas'
import { valueDomains, valueReflectionPrompts } from '@/lib/value-domains'

export const ValueForm = () => {
  'use no memo'
  const createValue = useCreateValue()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ValueInput>({
    resolver: zodResolver(valueSchema),
    defaultValues: { name: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createValue.mutateAsync(values)
      reset()
    } catch (error) {
      if (applyApiFieldErrors(error, setError)) return
      setError('name', {
        type: 'server',
        message: '保存に失敗しました。時間をおいて再度お試しください',
      })
    }
  })

  const current = watch('name') ?? ''
  const hint = errors.name ? null : detectValueHint(current)

  const pick = (text: string) => {
    setValue('name', text, { shouldValidate: true, shouldDirty: true })
    setFocus('name')
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Field
        label="新しい価値"
        htmlFor="value-name"
        error={errors.name?.message}
      >
        <TextInput
          id="value-name"
          placeholder="例: 人とのつながりを大切にする / 誠実でいる / 学び続ける"
          autoComplete="off"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
      </Field>

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

      <Disclosure
        summary="うまく書けないときは"
        icon={
          <Lightbulb size={18} aria-hidden="true" className="text-accent" />
        }
      >
        <p className="mb-3">
          近いものをタップすると下書きになります。あとから自由に書きかえられます。正解はありません。
        </p>
        <div className="flex flex-col gap-3">
          {valueDomains.map((domain) => (
            <div key={domain.label}>
              <p className="mb-1.5 font-bold text-ink">{domain.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {domain.examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => pick(example)}
                    className="min-h-9 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-ink transition-colors hover:bg-white/90"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="mb-1.5 font-bold text-ink">言葉にしにくいときの問い</p>
          <ul className="flex flex-col gap-1.5">
            {valueReflectionPrompts.map((prompt) => (
              <li key={prompt}>・{prompt}</li>
            ))}
          </ul>
        </div>
      </Disclosure>

      <Button type="submit" loading={isSubmitting}>
        追加する
      </Button>
    </form>
  )
}
