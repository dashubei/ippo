import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, test } from 'vitest'
import { ProtectedRoute } from '@/app/protected-route'
import { env } from '@/config/env'
import { SettingsPage } from '@/features/account/components/settings-page'
import { LoginPage } from '@/features/auth/components/login-page'
import { server } from '@/test/server'
import { renderWithProviders } from '@/test/test-utils'

// 認証必須のページなので ProtectedRoute でくるみ、退会後の /login への遷移まで検証する。
const routes = [
  {
    element: <ProtectedRoute />,
    children: [{ path: '/settings', element: <SettingsPage /> }],
  },
  { path: '/login', element: <LoginPage /> },
]

const renderSettings = () => {
  // 起動時 bootstrap で /me probe が走るよう、ログイン済み端末を模す。
  localStorage.setItem('ippo:email', 'test@example.com')
  return renderWithProviders(<div />, { routes, route: '/settings' })
}

describe('SettingsPage 退会', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  test('ログイン中のメールアドレスを表示する', async () => {
    renderSettings()
    expect(await screen.findByText('test@example.com')).toBeInTheDocument()
  })

  test('パスワード未入力で退会するとバリデーションエラーを表示する', async () => {
    const user = userEvent.setup()
    renderSettings()

    await user.click(
      await screen.findByRole('button', { name: '退会手続きへ' }),
    )
    await user.click(screen.getByRole('button', { name: '退会する' }))

    expect(
      await screen.findByText('パスワードを入力してください'),
    ).toBeInTheDocument()
  })

  test('退会に成功するとセッションを破棄しログイン画面へ遷移する', async () => {
    const user = userEvent.setup()
    renderSettings()

    await user.click(
      await screen.findByRole('button', { name: '退会手続きへ' }),
    )
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.click(screen.getByRole('button', { name: '退会する' }))

    expect(
      await screen.findByText(
        '退会が完了しました。ご利用ありがとうございました。',
      ),
    ).toBeInTheDocument()
    expect(localStorage.getItem('ippo:email')).toBeNull()
  })

  test('パスワードが違うとサーバのフィールドエラーを表示する', async () => {
    server.use(
      http.post(`${env.apiBaseUrl}/delete-account`, () =>
        HttpResponse.json(
          { password: ['パスワードが正しくありません'] },
          { status: 400 },
        ),
      ),
    )
    const user = userEvent.setup()
    renderSettings()

    await user.click(
      await screen.findByRole('button', { name: '退会手続きへ' }),
    )
    await user.type(screen.getByLabelText('パスワード'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: '退会する' }))

    expect(
      await screen.findByText('パスワードが正しくありません'),
    ).toBeInTheDocument()
  })
})
