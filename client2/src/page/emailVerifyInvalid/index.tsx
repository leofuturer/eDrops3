import React from 'react';
import { NavLink } from 'react-router-dom';
import './emailVerifyInvalid.css';

class EmailVerifyInvalid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="background">
        <h3>Invalid Email Verification Link</h3>
        <div className="border-h3" />
        <div className="help-text">
          Sorry, but the email verification link was invalid. The link
          may have already been used or there may have been some other
          error.
        </div>
        <div className="link">
          <NavLink to="/forgetPass">Resend Email Verification</NavLink>
        </div>
        <div className="link">
          <a href="mailto:edropswebsite@gmail.com">Contact Us</a>
        </div>
        <div className="link">
          <NavLink to="/home">Home Page</NavLink>
        </div>
      </div>
    );
  }
}

export default EmailVerifyInvalid;
