import type { ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AppMenu } from '@/components/nav/app-menu'
import { navItems } from '@/components/nav/nav-items'
import { SafetyNote } from '@/components/safety-note'
import { NoIndex } from '@/components/seo/no-index'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/stores/auth'

const NavTab = ({ to, children }: { to: string; children: ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `rounded-full px-4 py-2 text-sm font-bold transition-colors ${
        isActive ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
      }`
    }
  >
    {children}
  </NavLink>
)

export const AppLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col">
      <NoIndex />
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-cream/80 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 backdrop-blur-md">
        <NavLink
          to="/home"
          className="font-rounded text-xl font-bold tracking-tight text-accent"
        >
          ippo
        </NavLink>

        {/* sm 以上は横並びタブ、それ未満はハンバーガーに切り替える。 */}
        <div className="hidden items-center gap-1 sm:flex">
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <NavTab key={item.to} to={item.to}>
                {item.label}
              </NavTab>
            ))}
          </nav>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="px-3 py-2 text-sm font-bold text-ink-soft"
          >
            ログアウト
          </Button>
        </div>

        <AppMenu items={navItems} onLogout={handleLogout} />
      </header>
      <main className="flex-1 px-4">
        <Outlet />
      </main>
      <footer className="mt-6 border-t border-ink/5 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <SafetyNote />
      </footer>
    </div>
  )
}
