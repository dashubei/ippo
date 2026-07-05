import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnxietySlider } from '@/components/anxiety-slider'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import { Textarea } from '@/components/ui/textarea'
import { applyApiFieldErrors } from '@/lib/form'
import { useUpdateExposure } from '@/features/exposures/api/exposures'
import { localInputToIso, nowLocalInput } from '@/features/exposures/lib/date'
import {
  completeExposureSchema,
  type CompleteExposureForm as CompleteExposureFormValues,
  type CompleteExposureInput,
} from '@/features/exposures/schemas'

interface CompleteExposureFormProps {
  id: number
  onCompleted?: () => void
}

export const CompleteExposureForm = ({
  id,
  onCompleted,
}: CompleteExposureFormProps) => {
  // React Compiler は RHF の register と相性が悪いため除外する。
  'use no memo'
  const updateExposure = useUpdateExposure()
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompleteExposureFormValues, unknown, CompleteExposureInput>({
    resolver: zodResolver(completeExposureSchema),
    defaultValues: { done_at: nowLocalInput(), anxiety_after: 50 },
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
      onCompleted?.()
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
        label="実施後の不安の強さ（0〜100）"
        htmlFor="anxiety_after"
        error={errors.anxiety_after?.message}
      >
        <Controller
          control={control}
          name="anxiety_after"
          render={({ field }) => (
            <AnxietySlider
              id="anxiety_after"
              value={Number(field.value ?? 50)}
              onChange={field.onChange}
              invalid={Boolean(errors.anxiety_after)}
            />
          )}
        />
      </Field>
      <p className="-mt-1 text-xs leading-relaxed text-ink-soft">
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
