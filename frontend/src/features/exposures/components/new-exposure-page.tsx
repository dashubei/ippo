import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Field } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { TextInput } from '@/components/ui/text-input'
import { Textarea } from '@/components/ui/textarea'
import { applyApiFieldErrors } from '@/lib/form'
import { useCreateExposure } from '@/features/exposures/api/exposures'
import { useValueOptions } from '@/features/exposures/api/value-options'
import {
  createExposureSchema,
  type CreateExposureForm,
  type CreateExposureInput,
} from '@/features/exposures/schemas'

export const NewExposurePage = () => {
  // React Compiler は RHF の register と相性が悪いため除外する。
  'use no memo'
  const navigate = useNavigate()
  const createExposure = useCreateExposure()
  const values = useValueOptions()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateExposureForm, unknown, CreateExposureInput>({
    resolver: zodResolver(createExposureSchema),
  })

  const onSubmit = handleSubmit(async (input) => {
    try {
      await createExposure.mutateAsync(input)
      navigate('/exposures', { replace: true })
    } catch (error) {
      if (applyApiFieldErrors(error, setError)) return
      setError('action', {
        type: 'server',
        message: '保存に失敗しました。時間をおいて再度お試しください',
      })
    }
  })

  const noValues = values.isSuccess && values.data.length === 0

  return (
    <div className="flex animate-soft-fade flex-col gap-4 py-4">
      <h1 className="text-lg font-bold text-ink">新しい記録</h1>

      {values.isError && (
        <ErrorText>
          価値を読み込めませんでした。時間をおいて再度お試しください
        </ErrorText>
      )}

      {noValues ? (
        <Card className="flex flex-col gap-3 p-5 text-center text-ink-soft">
          <p>
            まずは大切にしたいこと（価値）を一つ登録してみましょう。そこから一歩が始まります。
          </p>
          <Link to="/values" className="font-bold text-accent">
            価値を登録する
          </Link>
        </Card>
      ) : (
        <Card className="p-5">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <Field label="価値" htmlFor="value" error={errors.value?.message}>
              {values.isPending ? (
                <div className="flex min-h-11 items-center text-ink-soft">
                  <Spinner size={18} />
                </div>
              ) : (
                <select
                  id="value"
                  defaultValue=""
                  aria-invalid={Boolean(errors.value)}
                  className="min-h-11 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-ink outline-none backdrop-blur-md focus-visible:border-accent aria-[invalid=true]:border-danger"
                  {...register('value')}
                >
                  <option value="">選択してください</option>
                  {values.data?.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="行動" htmlFor="action" error={errors.action?.message}>
              <TextInput
                id="action"
                placeholder="例: 朝会で1回発言する"
                autoComplete="off"
                aria-invalid={Boolean(errors.action)}
                {...register('action')}
              />
            </Field>

            <Field
              label="実施前の不安度（0〜100）"
              htmlFor="anxiety_before"
              error={errors.anxiety_before?.message}
            >
              <TextInput
                id="anxiety_before"
                type="number"
                inputMode="numeric"
                min={0}
                max={100}
                aria-invalid={Boolean(errors.anxiety_before)}
                {...register('anxiety_before')}
              />
            </Field>
            <p className="-mt-2 text-xs leading-relaxed text-ink-soft">
              高い数字でも大丈夫。良し悪しではなく、今の状態のメモです。
            </p>

            <Field
              label="メモ（任意）"
              htmlFor="memo_before"
              error={errors.memo_before?.message}
            >
              <Textarea
                id="memo_before"
                rows={3}
                placeholder="どんな気持ちか、何が不安かなど"
                aria-invalid={Boolean(errors.memo_before)}
                {...register('memo_before')}
              />
            </Field>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/exposures')}
              >
                キャンセル
              </Button>
              <Button type="submit" className="flex-1" loading={isSubmitting}>
                記録する
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
