import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullScreenLoader } from '@/components/ui/full-screen-loader'
import { useAuth } from '@/stores/auth'

export const ProtectedRoute = () => {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'pending') return <FullScreenLoader />
  if (status === 'unauthenticated')
    return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
