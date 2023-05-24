import { NavLink } from 'react-router-dom';
import MessageLayout from '../../component/layout/MessageLayout';
import { ROUTES } from '@/router/routes';

export function CheckEmail() {
  return (
    <MessageLayout
      title="Thanks for signing up!"
      message="A verification email has been sent to the email address
      provided during registration. Please check your email for
      further instructions."
    >
      <NavLink to={ROUTES.Home} className="text-primary_light hover:text-primary">Home Page</NavLink>
      <NavLink to={ROUTES.ForgotPassword} className="text-primary_light hover:text-primary">Resend Verification Email</NavLink>
    </MessageLayout>
  );
}