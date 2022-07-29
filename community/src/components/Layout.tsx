import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavTop from './NavTop'

function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const stickyNavPaths: string[] = ['/profile']
  const stickyNav = stickyNavPaths.includes(pathname)

  return (
    <main className="w-full h-screen flex flex-col">
      <div className={`${stickyNav ? 'sticky top-0 z-10' : ''}`}>
        <NavTop />
      </div>
      <div className="h-[calc(100vh-80px)]">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout