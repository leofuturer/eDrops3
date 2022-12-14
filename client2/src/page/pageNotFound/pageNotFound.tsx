import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function PageNotFound() {

  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <p className="text-lg font-bold">404: The requested page {location.pathname} was not found.</p>
      <p className="text-sm">If you believe this is an error, please contact us.</p>
      <NavLink to="/home" className="text-primary text-lg font-bold">Return to home page</NavLink>
    </div>
  );
}

export default PageNotFound;
