import { useState } from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import { AnxietySlider } from '@/components/anxiety-slider'
import { renderWithProviders } from '@/test/test-utils'

const Harness = () => {
  const [value, setValue] = useState(50)
  return <AnxietySlider id="anx" value={value} onChange={setValue} />
}

describe('AnxietySlider', () => {
  beforeEach(() => localStorage.clear())

  test('既定値はちょうどよいゾーンを示す', () => {
    renderWithProviders(<Harness />)
    expect(screen.getByText('ちょうどよい挑戦の目安')).toBeInTheDocument()
  })

  test('目盛り設定モーダルが開き、保存するとアンカーが表示される', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Harness />)

    await user.click(
      screen.getByRole('button', { name: /自分の目盛りを決める/ }),
    )
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/まったく平気/), '朝のあいさつ')
    await user.click(screen.getByRole('button', { name: 'この目盛りにする' }))

    expect(await screen.findByText(/朝のあいさつ/)).toBeInTheDocument()
    // 設定後はボタンの文言が「編集」に変わる
    expect(
      screen.getByRole('button', { name: /目盛りを編集/ }),
    ).toBeInTheDocument()
  })
})
