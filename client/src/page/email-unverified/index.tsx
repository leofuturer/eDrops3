import { NavLink } from 'react-router-dom';
import MessageLayout from '@/component/layout/MessageLayout';
import { ROUTES } from '@/router/routes';

export function EmailUnverified() {
  return (
    <MessageLayout
      title="Invalid Email Verification Link"
      message="Sorry, but the email verification link was invalid. The link may have already been used or there may have been some other error."
    >
      <NavLink to={ROUTES.ForgotPassword} className="text-primary_light hover:text-primary">Resend Email Verification</NavLink>
      <a href="mailto:edropswebsite@gmail.com" className="text-primary_light hover:text-primary">Contact Us</a>
      <NavLink to={ROUTES.Home} className="text-primary_light hover:text-primary">Home Page</NavLink>
    </MessageLayout>
  );
}
