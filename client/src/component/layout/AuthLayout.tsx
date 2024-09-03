import { ROUTES } from '@/router/routes'
import { useCookies } from 'react-cookie'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function AuthLayout() {
  const location = useLocation();

  const [cookies] = useCookies(['access_token'])

  return (
    cookies.access_token ? <Outlet /> : <Navigate to={ROUTES.Login} replace state={{ path: location.pathname }} />
  )
}

export default AuthLayout