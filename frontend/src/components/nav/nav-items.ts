export interface NavItem {
  to: string
  label: string
}

export const navItems: NavItem[] = [
  { to: '/home', label: 'ホーム' },
  { to: '/history', label: '記録' },
  { to: '/values', label: '価値' },
  { to: '/learn', label: '使い方' },
]
