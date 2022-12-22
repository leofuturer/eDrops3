import React from 'react'

function ManageRightLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        <h2 className="text-2xl">{title}</h2>
      </div>
      <div className="w-full py-8">
        {children}
      </div>
    </div>
  )
}

export default ManageRightLayout