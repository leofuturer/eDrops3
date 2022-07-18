import React from 'react'
import { Outlet } from 'react-router-dom'
import NavTop from './NavTop'

function Layout() {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="">
        <NavTop />
      </div>
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout