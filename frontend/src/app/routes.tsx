import type { RouteObject } from 'react-router-dom'
import { AppLayout } from '@/app/app-layout'
import { NotFoundPage } from '@/app/not-found-page'
import { ProtectedRoute } from '@/app/protected-route'

// 各ページはルート単位で動的 import し、チャンクを分割する（react-calendar 等の重い依存を初期バンドルから外す）。
export const routes: RouteObject[] = [
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('@/features/marketing/components/landing-page'))
        .LandingPage,
    }),
  },
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('@/features/auth/components/login-page'))
        .LoginPage,
    }),
  },
  {
    path: '/register',
    lazy: async () => ({
      Component: (await import('@/features/auth/components/register-page'))
        .RegisterPage,
    }),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/values',
            lazy: async () => ({
              Component: (
                await import('@/features/values/components/values-page')
              ).ValuesPage,
            }),
          },
          {
            path: '/exposures',
            lazy: async () => ({
              Component: (
                await import('@/features/exposures/components/exposures-page')
              ).ExposuresPage,
            }),
          },
          {
            path: '/exposures/new',
            lazy: async () => ({
              Component: (
                await import('@/features/exposures/components/new-exposure-page')
              ).NewExposurePage,
            }),
          },
          {
            path: '/exposures/:id',
            lazy: async () => ({
              Component: (
                await import('@/features/exposures/components/exposure-detail-page')
              ).ExposureDetailPage,
            }),
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
