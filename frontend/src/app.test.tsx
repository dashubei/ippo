import { render, screen } from '@testing-library/react'
import App from './app'

test('アプリのタイトルを表示する', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'ippo' })).toBeInTheDocument()
})
