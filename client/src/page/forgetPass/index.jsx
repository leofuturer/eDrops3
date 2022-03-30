import React from 'react';
import './forgetPass.css';
import { userForgetPass, customerResendVerifyEmail } from '../../api/serverConfig';
import API from '../../api/api';
import loadingGif from '../../../static/img/loading80px.gif';

// This page also allows for the resending of the email verification message.

class FormsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      requestInProgressReset: false,
      requestInProgressResend: false,
      successMessage: false,
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
      this.setState({
        requestInProgressReset: true,
        successMessage: false,
      });
      API.Request(userForgetPass, 'POST', data, false)
        .then((res) => {
          this.setState({
            requestInProgressReset: false,
            successMessage: true,
          });
        }).catch((err) => {
          if (process.env.NODE_ENV === 'dev') {
            console.error(err); // Maybe take out as attackers can view console & brute force emails
          }
          // Display a success message either way so attackers can't brute-force customer emails
          this.setState({
            requestInProgressReset: false,
            successMessage: true,
          });
        });
    } else {
      this.setState({
        requestInProgressResend: true,
        successMessage: false,
      });
      API.Request(customerResendVerifyEmail, 'POST', data, false)
        .then((res) => {
          this.setState({
            requestInProgressResend: false,
            successMessage: true,
          });
        })
        .catch((err) => {
          if (process.env.NODE_ENV === 'dev') {
            console.error(err); // Maybe take out as attackers can view console & brute force emails
          }
          // Display a success message either way so attackers can't brute-force customer emails
          this.setState({
            requestInProgressResend: false,
            successMessage: true,
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
                {
                  this.state.requestInProgressReset
                    ? <img src={loadingGif} alt="" />
                    : (
                      <input
                        type="button"
                        id="resetPassword"
                        value="Reset Password"
                        className="input-btn"
                        onClick={(e) => this.handleHelp(e)}
                      />
                    )
                }
              </div>
              <div className="form-group login-btn">
                {
                  this.state.requestInProgressResend
                    ? <img src={loadingGif} alt="" />
                    : (
                      <input
                        type="button"
                        id="resendVerifyEmail"
                        value="Resend Verification Email"
                        className="input-btn"
                        onClick={(e) => this.handleHelp(e)}
                      />
                    )
                }
              </div>
            </form>
          </div>
          {this.state.successMessage
            ? (
              <div className="help-text">
                If we found an account associated with that username, we've sent password reset instructions to the primary email address on the account. Please check
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
