import { NoIndex } from '@/components/seo/no-index'
import { Card } from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'

export const LoginPage = () => (
  <>
    <title>ログイン | ippo</title>
    <NoIndex />
    <div className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col justify-center px-6 py-12 pt-[calc(env(safe-area-inset-top)+2rem)]">
      <Card className="animate-panel-rise p-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-ink">
          ログイン
        </h1>
        <LoginForm />
      </Card>
    </div>
  </>
)
