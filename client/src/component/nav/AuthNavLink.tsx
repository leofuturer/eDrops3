import { ROUTES } from '@/router/routes'
import React from 'react'
import { useCookies } from 'react-cookie'
import { NavLink } from 'react-router-dom'

function AuthNavLink({ to, children, className, activeClassName, userTypes }: { to: ROUTES, children: React.ReactNode, activeClassName?: string, className?: string, userTypes: string[] }) {

  const [cookies] = useCookies(['userType'])

  if (userTypes.includes(cookies.userType)) {
    return (
      <NavLink to={to} className={({isActive}) => `${isActive && activeClassName} ${className}`}>
        {children}
      </NavLink>
    )
  }
  else {
    return null;
  }
}

export default AuthNavLink