import { Outlet } from 'react-router-dom';
import NavLeft from '../nav/NavLeft';

function ManageLayout() {
  return (
    <div className="flex justify-center">
      <div className="w-[1200px] grid grid-cols-4 pb-8">
        <div className="col-span-1">
          <NavLeft />
        </div>
        <div className="col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ManageLayout;
