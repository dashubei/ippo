import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, type Location, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/error-text'
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { TextInput } from '@/components/ui/text-input'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import { useAuth } from '@/stores/auth'

interface FromState {
  from?: Location
}

export const LoginForm = () => {
  // React Compiler は RHF の register と相性が悪いため除外する。
  'use no memo'
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const from =
    (location.state as FromState | null)?.from?.pathname ?? '/exposures'

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setFormError('メールアドレスまたはパスワードが正しくありません')
        return
      }
      setFormError('ログインに失敗しました。時間をおいて再度お試しください')
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
        label="パスワード"
        htmlFor="password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </Field>
      <Button type="submit" loading={isSubmitting}>
        ログイン
      </Button>
      <p className="text-center text-sm text-ink-soft">
        アカウントがない方は{' '}
        <Link to="/register" className="font-bold text-accent">
          新規登録
        </Link>
      </p>
    </form>
  )
}
