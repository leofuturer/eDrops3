import React from 'react';
import { NavLink } from 'react-router-dom';
import './checkEmail.css';

class CheckEmail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="check-email">
        <h3>Thanks for signing up!</h3>
        <div className="border-h3" />
        <div className="help-text">
          A verification email has been sent to the email address
          provided during registration. Please check your email for
          further instructions.
        </div>
        <div className="link">
          <NavLink to="/home">Home Page</NavLink>
        </div>
        <div className="link">
          <NavLink to="/forgetPass">Resend Verification Email</NavLink>
        </div>
      </div>
    );
  }
}

export default CheckEmail;
