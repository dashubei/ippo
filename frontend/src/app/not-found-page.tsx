import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <div className="grid min-h-svh place-items-center px-6 text-center">
    <div className="flex flex-col items-center gap-4">
      <p className="text-2xl font-bold text-ink">ページが見つかりません</p>
      <Link to="/" className="font-bold text-accent">
        トップへ戻る
      </Link>
    </div>
  </div>
)
