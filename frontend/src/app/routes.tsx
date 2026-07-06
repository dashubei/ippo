import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { AppLayout } from '@/app/app-layout'
import { GuestRoute } from '@/app/guest-route'
import { NotFoundPage } from '@/app/not-found-page'
import { ProtectedRoute } from '@/app/protected-route'
import { RootLayout } from '@/app/root-layout'

// 各ページはルート単位で動的 import し、チャンクを分割する（react-calendar 等の重い依存を初期バンドルから外す）。
export const routes: RouteObject[] = [
  {
    // 全ルートを包む。遷移時のスクロール位置リセット等の共通処理を担う。
    element: <RootLayout />,
    children: [
      {
        path: '/',
        lazy: async () => ({
          Component: (
            await import('@/features/marketing/components/landing-page')
          ).LandingPage,
        }),
      },
      {
        // ログイン済みでアクセスしたら /home へ送る。リダイレクト対象はログインページのみ。
        element: <GuestRoute />,
        children: [
          {
            path: '/login',
            lazy: async () => ({
              Component: (await import('@/features/auth/components/login-page'))
                .LoginPage,
            }),
          },
        ],
      },
      {
        path: '/register',
        lazy: async () => ({
          Component: (await import('@/features/auth/components/register-page'))
            .RegisterPage,
        }),
      },
      {
        path: '/learn',
        lazy: async () => ({
          Component: (await import('@/features/learn/components/learn-page'))
            .LearnPage,
        }),
      },
      {
        path: '/terms',
        lazy: async () => ({
          Component: (await import('@/features/legal/terms-page')).TermsPage,
        }),
      },
      {
        path: '/privacy',
        lazy: async () => ({
          Component: (await import('@/features/legal/privacy-page'))
            .PrivacyPage,
        }),
      },
      {
        path: '/disclaimer',
        lazy: async () => ({
          Component: (await import('@/features/legal/disclaimer-page'))
            .DisclaimerPage,
        }),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/home',
                lazy: async () => ({
                  Component: (
                    await import('@/features/home/components/home-page')
                  ).HomePage,
                }),
              },
              {
                path: '/onboarding',
                lazy: async () => ({
                  Component: (
                    await import('@/features/onboarding/components/onboarding-page')
                  ).OnboardingPage,
                }),
              },
              {
                path: '/values',
                lazy: async () => ({
                  Component: (
                    await import('@/features/values/components/values-page')
                  ).ValuesPage,
                }),
              },
              // 旧 /exposures は履歴ページ /history に統合。記録作成後の遷移先などの救済にリダイレクトを残す。
              {
                path: '/exposures',
                element: <Navigate to="/history" replace />,
              },
              {
                path: '/history',
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
              {
                path: '/settings',
                lazy: async () => ({
                  Component: (
                    await import('@/features/account/components/settings-page')
                  ).SettingsPage,
                }),
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
