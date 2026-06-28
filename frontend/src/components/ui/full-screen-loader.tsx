import { Spinner } from '@/components/ui/spinner'

export const FullScreenLoader = () => (
  <div className="grid min-h-svh place-items-center">
    <Spinner size={32} className="text-accent" />
  </div>
)
