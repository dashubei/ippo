import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import type { LearnTopic } from '@/features/learn/types/learn'
import { TopicStepModal } from '@/features/learn/components/topic-step-modal'
import { renderWithProviders } from '@/test/test-utils'

const sampleTopic: LearnTopic = {
  id: 'values',
  title: '価値ってなんだろう',
  estMinutes: 2,
  steps: [
    {
      illustration: { src: '/illustrations/peeps/sitting-mid.svg', alt: '' },
      headline: '価値は心の方向',
      body: '正解も完成もありません。',
    },
    {
      headline: '小さな一歩を選ぶ',
      body: '不安があっても踏み出せそうな一歩を。',
      extra: <p>補足情報</p>,
    },
    {
      headline: '最後のステップ',
      body: 'ここまで読んでくれてありがとう。',
    },
  ],
  finalCta: { label: '記録をはじめる', to: '/exposures/new' },
}

describe('TopicStepModal', () => {
  // ステップの続きは localStorage に残るため、テスト間で持ち越さないよう毎回消す。
  beforeEach(() => {
    localStorage.clear()
  })

  test('open時は最初のステップが表示される', async () => {
    renderWithProviders(
      <TopicStepModal topic={sampleTopic} open onClose={() => {}} />,
    )

    expect(await screen.findByText('価値は心の方向')).toBeInTheDocument()
    expect(screen.getByText('3つ中1つ目')).toBeInTheDocument()
  })

  test('「次へ」で次のステップに進み、進捗表示が移動する', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <TopicStepModal topic={sampleTopic} open onClose={() => {}} />,
    )

    await user.click(await screen.findByRole('button', { name: /次へ/ }))

    expect(await screen.findByText('小さな一歩を選ぶ')).toBeInTheDocument()
    expect(screen.getByText('3つ中2つ目')).toBeInTheDocument()
  })

  test('「こまったときは」で安全情報を表示し、「もどる」でステップに戻る', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <TopicStepModal topic={sampleTopic} open onClose={() => {}} />,
    )

    await user.click(
      await screen.findByRole('button', { name: 'こまったときは' }),
    )

    expect(
      await screen.findByText(/専門の窓口や支援者に相談してください/),
    ).toBeInTheDocument()
    expect(screen.queryByText('価値は心の方向')).not.toBeInTheDocument()

    await user.click(
      await screen.findByRole('button', { name: /ステップにもどる/ }),
    )

    expect(await screen.findByText('価値は心の方向')).toBeInTheDocument()
  })

  test('最終ステップでは finalCta のリンクが表示される', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <TopicStepModal topic={sampleTopic} open onClose={() => {}} />,
    )

    await user.click(await screen.findByRole('button', { name: /次へ/ }))
    await user.click(await screen.findByRole('button', { name: /次へ/ }))

    const link = await screen.findByRole('link', { name: '記録をはじめる' })
    expect(link).toHaveAttribute('href', '/exposures/new')
  })
})
