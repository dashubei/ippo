import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/error-text'
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { TextInput } from '@/components/ui/text-input'
import { applyApiFieldErrors } from '@/lib/form'
import { registerSchema, type RegisterFormInput } from '@/features/auth/schemas'
import { useAuth } from '@/stores/auth'

export const RegisterForm = () => {
  // React Compiler は RHF の register と相性が悪いため除外する。
  'use no memo'
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await registerAccount({
        email: values.email,
        password: values.password,
      })
      navigate('/home', { replace: true })
    } catch (error) {
      if (applyApiFieldErrors(error, setError)) return
      setFormError('登録に失敗しました。時間をおいて再度お試しください')
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {formError && <ErrorText>{formError}</ErrorText>}
      <Field
        label="メールアドレス"
        htmlFor="email"
        error={errors.email?.message}
      >
        <TextInput
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </Field>
      <Field
        label="パスワード（8文字以上）"
        htmlFor="password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </Field>
      <Field
        label="パスワード（確認）"
        htmlFor="passwordConfirm"
        error={errors.passwordConfirm?.message}
      >
        <PasswordInput
          id="passwordConfirm"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.passwordConfirm)}
          {...register('passwordConfirm')}
        />
      </Field>
      <p className="text-center text-xs leading-relaxed text-ink-soft">
        登録すると、
        <Link to="/terms" className="font-bold text-accent">
          利用規約
        </Link>
        と
        <Link to="/privacy" className="font-bold text-accent">
          プライバシーポリシー
        </Link>
        に同意したものとみなします。
      </p>
      <Button type="submit" loading={isSubmitting}>
        登録する
      </Button>
      <p className="text-center text-sm text-ink-soft">
        すでにアカウントをお持ちの方は{' '}
        <Link to="/login" className="font-bold text-accent">
          ログイン
        </Link>
      </p>
    </form>
  )
}
