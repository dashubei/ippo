import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, test } from 'vitest'
import { env } from '@/config/env'
import { ValuesPage } from '@/features/values/components/values-page'
import { server } from '@/test/server'
import { resetValuesStore } from '@/test/handlers/values'
import { renderWithProviders } from '@/test/test-utils'

describe('ValuesPage', () => {
  beforeEach(() => {
    resetValuesStore([
      { id: 1, name: '誠実でいること', created_at: '2026-06-01T00:00:00Z' },
      { id: 2, name: '挑戦を続けること', created_at: '2026-06-02T00:00:00Z' },
    ])
  })

  test('価値の一覧を描画する', async () => {
    renderWithProviders(<ValuesPage />)

    expect(await screen.findByText('誠実でいること')).toBeInTheDocument()
    expect(screen.getByText('挑戦を続けること')).toBeInTheDocument()
  })

  test('レスポンスが空なら空状態を表示する', async () => {
    resetValuesStore([])
    renderWithProviders(<ValuesPage />)

    expect(
      await screen.findByText(/まだ価値が登録されていません/),
    ).toBeInTheDocument()
  })

  test('空欄で送信するとバリデーションエラーを表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ValuesPage />)

    await user.click(await screen.findByRole('button', { name: '追加する' }))

    expect(
      await screen.findByText('大切にしたいことを入力してください'),
    ).toBeInTheDocument()
  })

  test('正常に作成するとリストへ反映される', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ValuesPage />)

    await user.type(
      await screen.findByLabelText('新しい価値'),
      '家族を大切にすること',
    )
    await user.click(screen.getByRole('button', { name: '追加する' }))

    expect(await screen.findByText('家族を大切にすること')).toBeInTheDocument()
  })

  test('重複登録(400)はフォームにエラーを表示する', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ValuesPage />)

    await user.type(
      await screen.findByLabelText('新しい価値'),
      '誠実でいること',
    )
    await user.click(screen.getByRole('button', { name: '追加する' }))

    expect(
      await screen.findByText('この価値はすでに登録されています'),
    ).toBeInTheDocument()
  })

  test('価値を編集して保存できる', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ValuesPage />)

    await user.click(
      await screen.findByRole('button', { name: '誠実でいること を編集' }),
    )
    const input = await screen.findByLabelText('価値を編集')
    await user.clear(input)
    await user.type(input, '正直でいること')
    await user.click(screen.getByRole('button', { name: '保存する' }))

    expect(await screen.findByText('正直でいること')).toBeInTheDocument()
    expect(screen.queryByText('誠実でいること')).not.toBeInTheDocument()
  })

  test('価値を削除できる', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ValuesPage />)

    await user.click(
      await screen.findByRole('button', { name: '挑戦を続けること を削除' }),
    )
    await user.click(await screen.findByRole('button', { name: '削除する' }))

    expect(await screen.findByText('誠実でいること')).toBeInTheDocument()
    expect(screen.queryByText('挑戦を続けること')).not.toBeInTheDocument()
  })

  test('続けて2件追加できる（追加後に入力が初期化されても次を受け付ける）', async () => {
    resetValuesStore([])
    const user = userEvent.setup()
    renderWithProviders(<ValuesPage />)

    await user.type(await screen.findByLabelText('新しい価値'), 'ひとつめ')
    await user.click(screen.getByRole('button', { name: '追加する' }))
    expect(await screen.findByText('ひとつめ')).toBeInTheDocument()

    await user.type(await screen.findByLabelText('新しい価値'), 'ふたつめ')
    await user.click(screen.getByRole('button', { name: '追加する' }))
    expect(await screen.findByText('ふたつめ')).toBeInTheDocument()
  })

  test('取得失敗時はエラーを表示する', async () => {
    server.use(
      http.get(
        `${env.apiBaseUrl}/values`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    renderWithProviders(<ValuesPage />)

    const list = await screen.findByText(/読み込めませんでした/)
    expect(list).toBeInTheDocument()
  })
})
