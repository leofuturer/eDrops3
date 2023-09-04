import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function EmailUnverified() {
  return (
    <div>
      <NavLink to={ROUTES.ForgotPassword} className="text-primary_light hover:text-primary">Resend Email Verification</NavLink>
      <a href="mailto:edropswebsite@gmail.com" className="text-primary_light hover:text-primary">Contact Us</a>
      <NavLink to={ROUTES.Home} className="text-primary_light hover:text-primary">Home Page</NavLink>
    </div>
  );
}
