import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/error-text'
import { Field } from '@/components/ui/field'
import { Modal } from '@/components/ui/modal'
import { PasswordInput } from '@/components/ui/password-input'
import { useDeleteAccount } from '@/features/account/api/account'
import {
  deleteAccountSchema,
  type DeleteAccountInput,
} from '@/features/account/schemas'
import { applyApiFieldErrors } from '@/lib/form'
import { queryClient } from '@/lib/query-client'
import { ACCOUNT_DELETED_KEY, useAuth } from '@/stores/auth'

interface DeleteAccountDialogProps {
  open: boolean
  onClose: () => void
}

export const DeleteAccountDialog = ({
  open,
  onClose,
}: DeleteAccountDialogProps) => {
  // React Compiler は RHF の register と相性が悪いため除外する。
  'use no memo'
  const { clearSession } = useAuth()
  const deleteAccount = useDeleteAccount()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await deleteAccount.mutateAsync(values)
      // 退会成功。キャッシュを消してから認証状態をクリアすると、ProtectedRoute が
      // ログイン画面へ送り、そこで完了メッセージを表示する。
      sessionStorage.setItem(ACCOUNT_DELETED_KEY, '1')
      queryClient.clear()
      clearSession()
    } catch (error) {
      if (applyApiFieldErrors(error, setError)) return
      setFormError('退会に失敗しました。時間をおいて再度お試しください')
    }
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="退会の確認"
      dismissibleByBackdrop={false}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft">
          退会すると、これまでの記録や価値はすべて削除され、元に戻すことはできません。よろしければ、本人確認のためパスワードを入力してください。
        </p>
        {formError && <ErrorText>{formError}</ErrorText>}
        <Field
          label="パスワード"
          htmlFor="delete-password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="delete-password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </Field>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="danger"
            className="flex-1"
            loading={isSubmitting || deleteAccount.isPending}
          >
            退会する
          </Button>
        </div>
      </form>
    </Modal>
  )
}
