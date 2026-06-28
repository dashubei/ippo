interface SpinnerProps {
  size?: number
  className?: string
  /** ボタン内など、近くにテキストがあり読み上げ不要な場合 true */
  decorative?: boolean
}

export const Spinner = ({
  size = 24,
  className = '',
  decorative = false,
}: SpinnerProps) => (
  <span
    {...(decorative
      ? { 'aria-hidden': true }
      : { role: 'status', 'aria-label': '読み込み中' })}
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    style={{ width: size, height: size }}
  />
)
