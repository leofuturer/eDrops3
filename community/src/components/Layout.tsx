import React from 'react'
import { Outlet } from 'react-router-dom'
import NavTop from './NavTop'

function Layout() {
  return (
    <main className="w-full h-screen flex flex-col">
      <div className="">
        <NavTop />
      </div>
      <div className="h-[calc(100vh-80px)]">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout