export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-ink/10 ${className}`}
    aria-hidden="true"
  />
)
