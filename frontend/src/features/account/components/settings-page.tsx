import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DeleteAccountDialog } from '@/features/account/components/delete-account-dialog'
import { useAuth } from '@/stores/auth'

export const SettingsPage = () => {
  const { email } = useAuth()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div className="mx-auto flex w-full max-w-screen-sm flex-col gap-6 py-6">
      <title>設定 | ippo</title>
      <header className="flex flex-col gap-1">
        <h1 className="font-rounded text-2xl font-bold text-ink">設定</h1>
        <p className="text-sm text-ink-soft">
          アカウントの情報を確認できます。
        </p>
      </header>

      <Card className="flex flex-col gap-1 p-5">
        <span className="text-sm text-ink-soft">
          ログイン中のメールアドレス
        </span>
        <span className="font-bold break-all text-ink">{email}</span>
      </Card>

      <Card className="flex flex-col gap-3 border border-danger/30 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-ink">退会する</h2>
          <p className="text-sm text-ink-soft">
            退会すると、これまでの記録や価値はすべて削除され、元に戻すことはできません。
          </p>
        </div>
        <Button
          variant="danger"
          className="self-start"
          onClick={() => setConfirmingDelete(true)}
        >
          退会手続きへ
        </Button>
      </Card>

      <DeleteAccountDialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
      />
    </div>
  )
}
