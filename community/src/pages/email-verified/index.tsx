import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function EmailVerified() {
  return (
    <div>
      <NavLink to={ROUTES.Login} className="text-primary_light hover:text-primary">Log In</NavLink>
      <NavLink to={ROUTES.Home} className="text-primary_light hover:text-primary">Home Page</NavLink>
    </div>
  );
}
