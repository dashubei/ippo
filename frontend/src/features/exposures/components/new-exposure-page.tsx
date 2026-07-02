import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Field } from '@/components/ui/field'
import { Illustration } from '@/components/ui/illustration'
import { Spinner } from '@/components/ui/spinner'
import { TextInput } from '@/components/ui/text-input'
import { Textarea } from '@/components/ui/textarea'
import { applyApiFieldErrors } from '@/lib/form'
import { useCreateExposure } from '@/features/exposures/api/exposures'
import { useValueOptions } from '@/features/exposures/api/value-options'
import { ActionHelper } from '@/features/exposures/components/action-helper'
import { AnxietySlider } from '@/components/anxiety-slider'
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
    control,
    handleSubmit,
    setValue,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateExposureForm, unknown, CreateExposureInput>({
    resolver: zodResolver(createExposureSchema),
    defaultValues: { anxiety_before: 50 },
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
    <div className="flex animate-soft-fade flex-col gap-5 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-rounded text-2xl font-bold text-ink">新しい記録</h1>
        <p className="text-sm leading-relaxed text-ink-soft">
          これから、あるいはやってみた一歩を書き留めましょう。うまくいってもいかなくても大丈夫です。
        </p>
      </header>

      {values.isError && (
        <ErrorText>
          価値を読み込めませんでした。時間をおいて再度お試しください
        </ErrorText>
      )}

      {noValues ? (
        <Card className="flex flex-col items-center gap-4 p-6 text-center text-ink-soft">
          <Illustration
            src="/illustrations/peeps/sitting-relax.svg"
            width={240}
            height={324}
            className="w-36"
          />
          <p className="leading-relaxed">
            まずは大切にしたいこと（価値）を一つ登録してみましょう。そこから一歩が始まります。
          </p>
          <Link to="/values">
            <Button size="lg">価値を登録する</Button>
          </Link>
        </Card>
      ) : (
        <Card className="p-5">
          <form
            onSubmit={onSubmit}
            noValidate
            className="stagger flex flex-col gap-4"
          >
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
                  className="min-h-11 w-full rounded-2xl border border-ink-soft/40 bg-white px-4 py-3 text-ink outline-none focus-visible:border-accent aria-[invalid=true]:border-danger"
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

            <ActionHelper
              onPick={(text) => {
                setValue('action', text, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
                setFocus('action')
              }}
            />

            <Field
              label="実施前の不安の強さ（0〜100）"
              htmlFor="anxiety_before"
              error={errors.anxiety_before?.message}
            >
              <Controller
                control={control}
                name="anxiety_before"
                render={({ field }) => (
                  <AnxietySlider
                    id="anxiety_before"
                    value={Number(field.value ?? 50)}
                    onChange={field.onChange}
                    invalid={Boolean(errors.anxiety_before)}
                  />
                )}
              />
            </Field>

            <Field
              label="やる前のメモ（書かなくてもOK）"
              htmlFor="memo_before"
              error={errors.memo_before?.message}
            >
              <Textarea
                id="memo_before"
                rows={3}
                placeholder="何が起きると怖い？（例: 笑われる／無視される） それはどれくらい起きそう？ 予想を書いておくと、あとで実際と見くらべられます。"
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
