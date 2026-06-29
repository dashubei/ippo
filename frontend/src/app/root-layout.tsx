import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

// ルート遷移のたびにページ先頭へスクロールする（SPA で前ページのスクロール位置が残るのを防ぐ）。
export const RootLayout = () => {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // 全 URL を末尾スラッシュに統一する（trailing slash: true）。ルート / だけは対象外。
  // React Router は末尾あり/なしを同じルートにマッチさせるため、表示 URL のみここで正規化する。
  if (pathname !== '/' && !pathname.endsWith('/'))
    return <Navigate to={`${pathname}/${search}${hash}`} replace />

  return <Outlet />
}
