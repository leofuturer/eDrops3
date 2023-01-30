import { NavLink } from 'react-router-dom';
import MessageLayout from '../../component/layout/MessageLayout';

function EmailVerified() {
  return (
    <MessageLayout
      title="Email Verified!"
      message="Thanks for verifying your email! Your account has been activated."
    >
      <NavLink to="/login" className="text-primary_light hover:text-primary">Log In</NavLink>
      <NavLink to="/home" className="text-primary_light hover:text-primary">Home Page</NavLink>
    </MessageLayout>
  );
}

export default EmailVerified;
