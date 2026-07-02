import { Link } from 'react-router-dom'
import { NoIndex } from '@/components/seo/no-index'
import { Card } from '@/components/ui/card'
import { RegisterForm } from '@/features/auth/components/register-form'

export const RegisterPage = () => (
  <>
    <title>新規登録 | ippo</title>
    <NoIndex />
    <div className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col justify-center px-6 py-12 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 self-start text-sm text-ink-soft transition-colors hover:text-accent"
      >
        ← トップへ
      </Link>
      <Card className="animate-panel-rise p-6">
        <h1 className="text-center font-rounded text-2xl font-bold text-ink">
          新規登録
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
          ここから、あなたの一歩が始まります。
        </p>
        <RegisterForm />
      </Card>
    </div>
  </>
)
