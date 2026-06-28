import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

// ルート遷移のたびにページ先頭へスクロールする（SPA で前ページのスクロール位置が残るのを防ぐ）。
export const RootLayout = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return <Outlet />
}
