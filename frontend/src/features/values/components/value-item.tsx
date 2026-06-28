import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import { applyApiFieldErrors } from '@/lib/form'
import { useDeleteValue, useUpdateValue } from '@/features/values/api/values'
import { valueSchema, type ValueInput } from '@/features/values/schemas'
import type { UserValue } from '@/types/api'

export const ValueItem = ({ value }: { value: UserValue }) => {
  // React Compiler は RHF の register（reset 後の onChange）と相性が悪いため除外する。
  'use no memo'
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const updateValue = useUpdateValue()
  const deleteValue = useDeleteValue()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ValueInput>({
    resolver: zodResolver(valueSchema),
    defaultValues: { name: value.name },
  })

  const startEditing = () => {
    reset({ name: value.name })
    setEditing(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateValue.mutateAsync({ id: value.id, ...values })
      setEditing(false)
    } catch (error) {
      if (applyApiFieldErrors(error, setError)) return
      setError('name', {
        type: 'server',
        message: '保存に失敗しました。時間をおいて再度お試しください',
      })
    }
  })

  if (confirmingDelete) {
    return (
      <div className="flex flex-col gap-3 px-4 py-3">
        <p className="text-sm text-ink">
          「{value.name}」を削除しますか？取り消せません。
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => setConfirmingDelete(false)}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex-1"
            loading={deleteValue.isPending}
            onClick={() => deleteValue.mutate(value.id)}
          >
            削除する
          </Button>
        </div>
      </div>
    )
  }

  if (editing) {
    return (
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-3 px-4 py-3"
      >
        <Field
          label="価値を編集"
          htmlFor={`value-${value.id}`}
          error={errors.name?.message}
        >
          <TextInput
            id={`value-${value.id}`}
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </Field>
        <div className="flex gap-2">
          <Button type="submit" loading={isSubmitting} className="flex-1">
            保存する
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setEditing(false)}
            className="flex-1"
          >
            キャンセル
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3">
      <span className="break-words font-medium text-ink">{value.name}</span>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          onClick={startEditing}
          aria-label={`${value.name} を編集`}
          className="px-3 py-2 text-sm text-accent"
        >
          編集
        </Button>
        <Button
          variant="ghost"
          onClick={() => setConfirmingDelete(true)}
          aria-label={`${value.name} を削除`}
          className="px-3 py-2 text-sm text-danger"
        >
          削除
        </Button>
      </div>
    </div>
  )
}
