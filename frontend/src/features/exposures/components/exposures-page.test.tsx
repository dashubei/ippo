import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, test } from 'vitest'
import { env } from '@/config/env'
import { ExposuresPage } from '@/features/exposures/components/exposures-page'
import type { ExposureRecord } from '@/types/api'
import { resetExposuresStore } from '@/test/handlers/exposures'
import { resetValuesStore } from '@/test/handlers/values'
import { server } from '@/test/server'
import { renderWithProviders } from '@/test/test-utils'

// カレンダーの当月に確実に表示されるよう、当月内の 2 日を done_at に使う。
const now = new Date()
const dayA = new Date(now.getFullYear(), now.getMonth(), 10, 9, 0, 0)
const dayB = new Date(now.getFullYear(), now.getMonth(), 20, 9, 0, 0)
const emptyDay = new Date(now.getFullYear(), now.getMonth(), 15)

// react-calendar のタイルのアクセシブル名（abbr の aria-label）= "YYYY年M月D日"
const tileLabel = (date: Date) =>
  `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`

const records: ExposureRecord[] = [
  {
    id: 1,
    user: 1,
    value: 1,
    action: '朝会で発言する',
    anxiety_before: 60,
    anxiety_after: 30,
    memo_before: null,
    memo_after: null,
    done_at: dayA.toISOString(),
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 2,
    user: 1,
    value: 1,
    action: '同僚に質問する',
    anxiety_before: 50,
    anxiety_after: 20,
    memo_before: null,
    memo_after: null,
    done_at: dayB.toISOString(),
    created_at: '2026-06-02T00:00:00Z',
  },
  {
    id: 3,
    user: 1,
    value: 1,
    action: 'まだやっていない行動',
    anxiety_before: 70,
    anxiety_after: null,
    memo_before: null,
    memo_after: null,
    done_at: null,
    created_at: '2026-06-03T00:00:00Z',
  },
]

describe('ExposuresPage', () => {
  beforeEach(() => {
    resetExposuresStore(records)
    resetValuesStore([
      { id: 1, name: '誠実でいること', created_at: '2026-06-01T00:00:00Z' },
    ])
  })

  test('取得中はスケルトンを表示する', async () => {
    renderWithProviders(<ExposuresPage />)

    expect(screen.queryByText('同僚に質問する')).not.toBeInTheDocument()
    // 取得後にカレンダーのタイル（当月1日）が現れる
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    expect(
      await screen.findByRole('button', { name: tileLabel(firstDay) }),
    ).toBeInTheDocument()
  })

  test('取得失敗時はエラーを表示する', async () => {
    server.use(
      http.get(
        `${env.apiBaseUrl}/exposures`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    renderWithProviders(<ExposuresPage />)

    expect(
      await screen.findByText(/記録を読み込めませんでした/),
    ).toBeInTheDocument()
  })

  test('未実施の記録を一覧に表示する', async () => {
    renderWithProviders(<ExposuresPage />)

    const pending = await screen.findByRole('heading', {
      name: 'これからの一歩',
    })
    expect(pending).toBeInTheDocument()
    expect(screen.getByText('まだやっていない行動')).toBeInTheDocument()
  })

  test('カレンダーで日付をタップするとその日の記録だけ表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ExposuresPage />)

    const tile = await screen.findByRole('button', { name: tileLabel(dayA) })
    await user.click(tile)

    expect(
      await screen.findByRole('heading', { name: `${tileLabel(dayA)}の記録` }),
    ).toBeInTheDocument()
    expect(screen.getByText('朝会で発言する')).toBeInTheDocument()
    // 別の日の記録は出ない
    expect(screen.queryByText('同僚に質問する')).not.toBeInTheDocument()
  })

  test('記録のない日をタップするとその日の記録なしと表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ExposuresPage />)

    const tile = await screen.findByRole('button', {
      name: tileLabel(emptyDay),
    })
    await user.click(tile)

    expect(
      await screen.findByText('この日の記録はありません'),
    ).toBeInTheDocument()
  })
})
