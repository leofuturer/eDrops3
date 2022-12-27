import React from 'react'

function ModalBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 left-0 bg-black/25 w-screen h-screen flex items-center justify-center">
      {children}
    </div>
  )
}

export default ModalBackground