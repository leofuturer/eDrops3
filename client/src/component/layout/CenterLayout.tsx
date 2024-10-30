

function CenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex flex-col items-center space-y-4 shadow-box w-2/3 p-8">
        {children}
      </div>
    </div>
  )
}

export default CenterLayout