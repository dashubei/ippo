import type { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryRouter,
  type RouteObject,
} from 'react-router-dom'
import { AuthProvider } from '@/stores/auth'

interface RenderOptions {
  route?: string
  routes?: RouteObject[]
}

// QueryClientProvider + AuthProvider + MemoryRouter で包んで描画する。
// 単一コンポーネントなら ui を、複数ルートが必要なら routes を渡す。
export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', routes }: RenderOptions = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const router = createMemoryRouter(routes ?? [{ path: '*', element: ui }], {
    initialEntries: [route],
  })
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
  return { ...utils, queryClient, router }
}
