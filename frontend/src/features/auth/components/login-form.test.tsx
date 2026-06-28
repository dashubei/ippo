import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import { env } from '@/config/env'
import { LoginPage } from '@/features/auth/components/login-page'
import { server } from '@/test/server'
import { renderWithProviders } from '@/test/test-utils'

const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/exposures', element: <div>記録一覧</div> },
]

describe('LoginForm', () => {
  test('空欄で送信するとバリデーションエラーを表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/login' })

    await user.click(await screen.findByRole('button', { name: 'ログイン' }))

    expect(
      await screen.findByText('パスワードを入力してください'),
    ).toBeInTheDocument()
  })

  test('正常入力でログインし記録一覧へ遷移する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/login' })

    await user.type(
      await screen.findByLabelText('メールアドレス'),
      'test@example.com',
    )
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    expect(await screen.findByText('記録一覧')).toBeInTheDocument()
  })

  test('認証失敗(401)でエラーメッセージを表示する', async () => {
    server.use(
      http.post(
        `${env.apiBaseUrl}/login`,
        () => new HttpResponse(null, { status: 401 }),
      ),
    )
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/login' })

    await user.type(
      await screen.findByLabelText('メールアドレス'),
      'test@example.com',
    )
    await user.type(screen.getByLabelText('パスワード'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    expect(
      await screen.findByText(
        'メールアドレスまたはパスワードが正しくありません',
      ),
    ).toBeInTheDocument()
  })
})
