import React from 'react'
import CenterLayout from './CenterLayout'

function MessageLayout({children, title, message}: {children: React.ReactNode, title: string, message: string}) {
  return (
    <CenterLayout>
      <h3 className="text-secondary text-2xl font-bold border-b-2 border-secondary pb-2 w-1/2 text-center">{title}</h3>
      <p className="w-1/2 text-center">
        {message}
      </p>
      {children}
    </CenterLayout>
  )
}

export default MessageLayout