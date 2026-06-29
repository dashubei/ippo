import { Navigate, Outlet } from 'react-router-dom'
import { FullScreenLoader } from '@/components/ui/full-screen-loader'
import { useAuth } from '@/stores/auth'

export const GuestRoute = () => {
  const { status } = useAuth()

  if (status === 'pending') return <FullScreenLoader />
  if (status === 'authenticated') return <Navigate to="/home" replace />

  return <Outlet />
}
