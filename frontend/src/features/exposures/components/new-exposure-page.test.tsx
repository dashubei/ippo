import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import { NewExposurePage } from '@/features/exposures/components/new-exposure-page'
import { clearQuickCheck } from '@/lib/quick-check-storage'
import { resetExposuresStore } from '@/test/handlers/exposures'
import { resetValuesStore } from '@/test/handlers/values'
import { renderWithProviders } from '@/test/test-utils'

const routes = [
  { path: '/exposures/new', element: <NewExposurePage /> },
  { path: '/exposures/:id', element: <div>記録詳細</div> },
]

describe('NewExposurePage', () => {
  beforeEach(() => {
    clearQuickCheck()
    resetExposuresStore([])
    resetValuesStore([
      { id: 1, name: '誠実でいること', created_at: '2026-06-01T00:00:00Z' },
      { id: 2, name: '挑戦を続けること', created_at: '2026-06-02T00:00:00Z' },
    ])
  })

  test('スライダーを動かすと挑戦の難易度の目安が変わる', async () => {
    renderWithProviders(<div />, { routes, route: '/exposures/new' })

    const slider = await screen.findByLabelText('実施前の不安の強さ（0〜100）')
    // 既定値（50）は最適ゾーン
    expect(screen.getByText('ちょうどよい挑戦の目安')).toBeInTheDocument()

    fireEvent.change(slider, { target: { value: '90' } })
    expect(
      await screen.findByText('ひとつ小さくしてみよう'),
    ).toBeInTheDocument()
  })

  test('価値を未選択で送信するとエラーを表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/exposures/new' })

    await user.type(await screen.findByLabelText('行動'), '朝会で発言する')
    await user.click(screen.getByRole('button', { name: '記録する' }))

    // 選択肢の placeholder と文言が重なるため、エラー表示（role=alert）で確認する。
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('価値を選択してください')
  })

  test('正常入力で送信すると作成した記録の詳細へ遷移する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/exposures/new' })

    await user.selectOptions(await screen.findByLabelText('価値'), '1')
    await user.type(screen.getByLabelText('行動'), '朝会で発言する')
    await user.click(screen.getByRole('button', { name: '記録する' }))

    expect(await screen.findByText('記録詳細')).toBeInTheDocument()
  })
})
