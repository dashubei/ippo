import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'
import { applyApiFieldErrors } from '@/lib/form'
import { useCreateValue } from '@/features/values/api/values'
import { valueSchema, type ValueInput } from '@/features/values/schemas'

export const ValueForm = () => {
  'use no memo'
  const createValue = useCreateValue()
  const {
    register,
    handleSubmit,
    reset,
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
      <Button type="submit" loading={isSubmitting}>
        追加する
      </Button>
    </form>
  )
}
