import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import { QuickCheckTool } from '@/features/marketing/components/quick-check-tool'

describe('QuickCheckTool', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('行動と不安の強さを端末に保存し、再表示時に復元する', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<QuickCheckTool />)

    await user.type(
      screen.getByLabelText('やってみたい行動（書かなくてもOK）'),
      '会議で発言する',
    )
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } })
    await user.click(screen.getByRole('button', { name: '保存' }))

    expect(await screen.findByText('保存した内容')).toBeInTheDocument()
    expect(screen.getByText('会議で発言する')).toBeInTheDocument()
    expect(screen.getByText('不安の強さ: 80')).toBeInTheDocument()

    unmount()
    render(<QuickCheckTool />)
    expect(await screen.findByText('保存した内容')).toBeInTheDocument()
    expect(screen.getByText('会議で発言する')).toBeInTheDocument()
  })

  test('スライダーの値で挑戦の目安が変わる', async () => {
    render(<QuickCheckTool />)
    expect(screen.getByText('ちょうどよい挑戦の目安')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('slider'), { target: { value: '10' } })
    expect(
      await screen.findByText('いまは挑戦しなくても大丈夫'),
    ).toBeInTheDocument()
  })
})
