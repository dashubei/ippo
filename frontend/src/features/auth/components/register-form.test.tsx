import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import { RegisterPage } from '@/features/auth/components/register-page'
import { renderWithProviders } from '@/test/test-utils'

const routes = [
  { path: '/register', element: <RegisterPage /> },
  { path: '/exposures', element: <div>記録一覧</div> },
]

const fill = async (
  user: ReturnType<typeof userEvent.setup>,
  { password, confirm }: { password: string; confirm: string },
) => {
  await user.type(await screen.findByLabelText('名前'), 'たろう')
  await user.type(screen.getByLabelText('メールアドレス'), 'taro@example.com')
  await user.type(screen.getByLabelText('パスワード（8文字以上）'), password)
  await user.type(screen.getByLabelText('パスワード（確認）'), confirm)
  await user.click(screen.getByRole('button', { name: '登録する' }))
}

describe('RegisterForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('パスワードが8文字未満ならエラーを表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/register' })

    await fill(user, { password: 'short', confirm: 'short' })

    expect(
      await screen.findByText('パスワードは8文字以上で入力してください'),
    ).toBeInTheDocument()
  })

  test('確認用パスワードが一致しなければエラーを表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/register' })

    await fill(user, { password: 'password123', confirm: 'password999' })

    expect(
      await screen.findByText('パスワードが一致しません'),
    ).toBeInTheDocument()
  })

  test('正常入力で登録し記録一覧へ遷移する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/register' })

    await fill(user, { password: 'password123', confirm: 'password123' })

    expect(await screen.findByText('記録一覧')).toBeInTheDocument()
  })
})
