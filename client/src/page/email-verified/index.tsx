import { NavLink } from 'react-router-dom';
import MessageLayout from '@/component/layout/MessageLayout';
import { ROUTES } from '@/router/routes';

export function EmailVerified() {
  return (
    <MessageLayout
      title="Email Verified!"
      message="Thanks for verifying your email! Your account has been activated."
    >
      <NavLink to={ROUTES.Login} className="text-primary_light hover:text-primary">Log In</NavLink>
      <NavLink to={ROUTES.Home} className="text-primary_light hover:text-primary">Home Page</NavLink>
    </MessageLayout>
  );
}
