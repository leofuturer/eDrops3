/*
  Loading template for product items
*/
function ItemLoad() {
  return (
    <div className="border-md shadow-box p-4 flex flex-col items-center space-y-2 w-full animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      <div className="w-full aspect-square bg-slate-200 flex flex-col justify-center items-center">
        <p className="mb-10 text-center">Loading</p>
        <img className="h-10 flex-none" src="img/loading.gif" alt="Loading..." />
      </div>
      <div className="h-2 bg-slate-200 rounded w-full"></div>
      <div className="h-2 bg-slate-200 rounded w-full"></div>
      <div className="h-2 bg-slate-200 rounded w-full"></div>
      <div className="h-2 bg-slate-200 rounded w-full"></div>
      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      <div className="h-10 bg-slate-200 rounded w-1/4"></div>
    </div>
  )
}

export default ItemLoad