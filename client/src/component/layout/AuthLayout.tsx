import { useCookies } from 'react-cookie'
import { Navigate, Outlet } from 'react-router-dom'

function AuthLayout() {

  const [cookies] = useCookies(['access_token'])

  return (
    cookies.access_token ? <Outlet /> : <Navigate to="/login" replace state={{ path: location.pathname }} />
  )
}

export default AuthLayout