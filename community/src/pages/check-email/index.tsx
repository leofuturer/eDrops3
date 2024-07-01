import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function CheckEmail() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-1/2">
        <img src="/img/edroplets-banner.png" alt="eDroplets" className="w-1/2" />
        <p className="text-center">
          Thank you for signing up!
          <br />
          Please check your email to verify your account.
        </p>
        <NavLink to={ROUTES.Home} className="text-primary_light hover:text-primary">Home Page</NavLink>
        <NavLink to={ROUTES.ForgotPassword} className="text-primary_light hover:text-primary">Resend Verification Email</NavLink>
      </div>
    </div>
  );
}
