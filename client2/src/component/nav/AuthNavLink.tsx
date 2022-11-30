import React from 'react'
import { useCookies } from 'react-cookie'
import { NavLink } from 'react-router-dom'

function AuthNavLink({ to, children, activeClassName, className, userTypes }: { to: string, children: React.ReactNode, activeClassName?: string, className?: string, userTypes: string[] }) {

  const [cookies] = useCookies(['userType'])

  if (userTypes.includes(cookies.userType)) {
    return (
      <NavLink to={to} activeClassName={activeClassName} className={className}>
        {children}
      </NavLink>
    )
  }
  else {
    return null;
  }
}

export default AuthNavLink