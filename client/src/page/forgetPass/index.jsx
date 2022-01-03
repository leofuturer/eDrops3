import React from 'react';
import './forgetPass.css';
import { userForgetPass, customerResendVerifyEmail } from '../../api/serverConfig';
import API from '../../api/api';

// This page also allows for the resending of the email verification message.

class FormsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      requestInProgress: false,
    };
    this.handleHelp = this.handleHelp.bind(this);
  }

  handleChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  handleHelp(e) {
    const helpType = e.target.id;
    const data = {
      email: this.state.email,
    };
    if (helpType === 'resetPassword') {
      API.Request(userForgetPass, 'POST', data, false)
        .then((res) => {
          this.setState({
            requestInProgress: true,
          });
        }).catch((err) => {
          console.error(err); // Maybe take out as attackers can view console & brute force emails
          // Display a success message either way so attackers can't brute-force customer emails
          this.setState({
            requestInProgress: true,
          });
        });
    } else {
      API.Request(customerResendVerifyEmail, 'POST', data, false)
        .then((res) => {
          this.setState({
            requestInProgress: true,
          });
        })
        .catch((err) => {
          console.error(err); // Maybe take out as attackers can view console & brute force emails
          // Display a success message either way so attackers can't brute-force customer emails
          this.setState({
            requestInProgress: true,
          });
        });
    }
  }

  render() {
    return (
      <div>
        <div className="background">
          <h3>Account Assistance</h3>
          <div className="border-h3" />
          <div className="help-text">
            Please provide the email used during sign up
            to request help. If you do not receive an email,
            please check the spam folder or ensure it is typed
            correctly.
          </div>
          <div className="input-content">
            <form action="">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username or Email"
                  onChange={(v) => this.handleChange('email', v.target.value)}
                />
              </div>
              <div className="form-group login-btn">
                <input
                  type="button"
                  id="resetPassword"
                  value="Reset Password"
                  className="input-btn"
                  onClick={(e) => this.handleHelp(e)}
                />
              </div>
              <div className="form-group login-btn">
                <input
                  type="button"
                  id="resendVerifyEmail"
                  value="Resend Verification Email"
                  className="input-btn"
                  onClick={(e) => this.handleHelp(e)}
                />
              </div>
            </form>
          </div>
          {this.state.requestInProgress
            ? (
              <div className="help-text">
                The request was successfully submitted. Please check
                your email for further instructions.
              </div>
            )
            : null}
        </div>
        <div className="hr-div-login" />
      </div>
    );
  }
}

export default FormsPage;
