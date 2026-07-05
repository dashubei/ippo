import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import { ExposureDetailPage } from '@/features/exposures/components/exposure-detail-page'
import type { ExposureRecord } from '@/types/api'
import { resetExposuresStore } from '@/test/handlers/exposures'
import { resetValuesStore } from '@/test/handlers/values'
import { renderWithProviders } from '@/test/test-utils'

const pendingRecord: ExposureRecord = {
  id: 1,
  user: 1,
  value: 1,
  action: '朝会で発言する',
  anxiety_before: 60,
  anxiety_after: null,
  memo_before: null,
  memo_after: null,
  done_at: null,
  created_at: '2026-06-10T00:00:00Z',
}

const routes = [
  { path: '/exposures/:id', element: <ExposureDetailPage /> },
  { path: '/history', element: <div>記録一覧</div> },
]

describe('ExposureDetailPage', () => {
  beforeEach(() => {
    resetValuesStore([
      { id: 1, name: '誠実でいること', created_at: '2026-06-01T00:00:00Z' },
    ])
  })

  test('未実施の記録に実施後の追記をPATCHで送る', async () => {
    resetExposuresStore([pendingRecord])
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/exposures/1' })

    expect(await screen.findByText('朝会で発言する')).toBeInTheDocument()
    expect(screen.getByText('これから')).toBeInTheDocument()

    // 実施日時は現在時刻が初期入力され、不安度はスライダー初期値のまま送信できる。
    await user.click(screen.getByRole('button', { name: '振り返りを記録する' }))

    expect(await screen.findByText('実施済み')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '振り返りを記録する' }),
    ).not.toBeInTheDocument()
  })

  test('削除すると一覧へ遷移する', async () => {
    resetExposuresStore([pendingRecord])
    const user = userEvent.setup()
    renderWithProviders(<div />, { routes, route: '/exposures/1' })

    await user.click(await screen.findByRole('button', { name: '削除' }))
    await user.click(await screen.findByRole('button', { name: '削除する' }))

    expect(await screen.findByText('記録一覧')).toBeInTheDocument()
  })

  test('取得中はスケルトンを表示する', async () => {
    resetExposuresStore([pendingRecord])
    renderWithProviders(<div />, { routes, route: '/exposures/1' })

    const main = document.body
    expect(within(main).queryByText('朝会で発言する')).not.toBeInTheDocument()
    // 取得完了後に内容が出る
    expect(await screen.findByText('朝会で発言する')).toBeInTheDocument()
  })
})
