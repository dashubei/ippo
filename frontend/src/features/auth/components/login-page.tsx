import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NoIndex } from '@/components/seo/no-index'
import { Card } from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'
import { ACCOUNT_DELETED_KEY } from '@/stores/auth'

export const LoginPage = () => {
  // 退会直後のリダイレクトで一度だけ完了メッセージを出す（sessionStorage 経由で橋渡し）。
  const [accountDeleted] = useState(() => {
    if (sessionStorage.getItem(ACCOUNT_DELETED_KEY) !== '1') return false
    sessionStorage.removeItem(ACCOUNT_DELETED_KEY)
    return true
  })

  return (
    <>
      <title>ログイン | ippo</title>
      <NoIndex />
      <div className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col justify-center px-6 py-12 pt-[calc(env(safe-area-inset-top)+2rem)]">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 self-start text-sm text-ink-soft transition-colors hover:text-accent"
        >
          ← トップへ
        </Link>
        {accountDeleted && (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm text-ink"
          >
            退会が完了しました。ご利用ありがとうございました。
          </div>
        )}
        <Card className="animate-panel-rise p-6">
          <h1 className="text-center font-rounded text-2xl font-bold text-ink">
            ログイン
          </h1>
          <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
            おかえりなさい。あなたのペースで続けましょう。
          </p>
          <LoginForm />
        </Card>
      </div>
    </>
  )
}
