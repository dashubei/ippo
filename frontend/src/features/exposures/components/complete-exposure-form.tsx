import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import { Textarea } from '@/components/ui/textarea'
import { applyApiFieldErrors } from '@/lib/form'
import { useAnxietyAnchors } from '@/hooks/use-anxiety-anchors'
import { useUpdateExposure } from '@/features/exposures/api/exposures'
import { localInputToIso } from '@/features/exposures/lib/date'
import {
  completeExposureSchema,
  type CompleteExposureForm as CompleteExposureFormValues,
  type CompleteExposureInput,
} from '@/features/exposures/schemas'

export const CompleteExposureForm = ({ id }: { id: number }) => {
  // React Compiler は RHF の register と相性が悪いため除外する。
  'use no memo'
  const updateExposure = useUpdateExposure()
  const { anchors } = useAnxietyAnchors()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompleteExposureFormValues, unknown, CompleteExposureInput>({
    resolver: zodResolver(completeExposureSchema),
  })

  const onSubmit = handleSubmit(async (input) => {
    const doneAtIso = localInputToIso(input.done_at)
    if (!doneAtIso) {
      setError('done_at', {
        type: 'validate',
        message: '日時の形式が正しくありません',
      })
      return
    }
    try {
      await updateExposure.mutateAsync({ id, ...input, done_at: doneAtIso })
    } catch (error) {
      if (applyApiFieldErrors(error, setError)) return
      setError('anxiety_after', {
        type: 'server',
        message: '保存に失敗しました。時間をおいて再度お試しください',
      })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="実施日時" htmlFor="done_at" error={errors.done_at?.message}>
        <TextInput
          id="done_at"
          type="datetime-local"
          aria-invalid={Boolean(errors.done_at)}
          {...register('done_at')}
        />
      </Field>

      <Field
        label="実施後の不安度（0〜100）"
        htmlFor="anxiety_after"
        error={errors.anxiety_after?.message}
      >
        <TextInput
          id="anxiety_after"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          aria-invalid={Boolean(errors.anxiety_after)}
          {...register('anxiety_after')}
        />
      </Field>
      {anchors && (
        <p className="-mt-2 text-xs leading-relaxed text-ink">
          あなたの目盛り： 0＝{anchors.low || '—'} ／ 50＝{anchors.mid || '—'}{' '}
          ／ 100＝{anchors.high || '—'}
        </p>
      )}
      <p className="text-xs leading-relaxed text-ink-soft">
        下がっていなくても問題ありません。取り組めたこと自体が一歩です。
      </p>

      <Field
        label="振り返りメモ（任意）"
        htmlFor="memo_after"
        error={errors.memo_after?.message}
      >
        <Textarea
          id="memo_after"
          rows={3}
          placeholder="いちばん怖かったことは、実際に起きた？ 予想と実際はどう違った？ 気づいたことなど"
          aria-invalid={Boolean(errors.memo_after)}
          {...register('memo_after')}
        />
      </Field>

      <Button type="submit" loading={isSubmitting}>
        振り返りを記録する
      </Button>
    </form>
  )
}
