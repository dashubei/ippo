import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { BookOpen, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import { applyApiFieldErrors } from '@/lib/form'
import { useCreateValue } from '@/features/values/api/values'
import { detectValueHint } from '@/features/values/lib/value-hints'
import { valueSchema, type ValueInput } from '@/features/values/schemas'

export const ValueForm = () => {
  'use no memo'
  const createValue = useCreateValue()
  const {
    register,
    handleSubmit,
    reset,
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

      <p className="text-xs leading-relaxed text-ink-soft">
        書き出すヒント：もし不安にじゃまされないとしたら、人との関わりでどんな自分でいたい？
      </p>

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

      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-accent"
      >
        <BookOpen size={16} aria-hidden="true" />
        うまく書けないときは：価値ってなんだろう？
      </Link>

      <Button type="submit" loading={isSubmitting}>
        追加する
      </Button>
    </form>
  )
}
