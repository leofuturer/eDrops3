import React from 'react';
import './forgetPass.css';
import { userForgetPass, customerResendVerifyEmail } from '../../api/serverConfig';
import API from '../../api/api';
import constraints from './formConstraints';

import { closestParent, showErrorsOrSuccessForInput } from '../../utils/validate';

import validate from 'validate.js';

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
    this.handleValidateInput = this.handleValidateInput.bind(this);
  }

  handleChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  handleValidateInput(e) {
    const ele = e.target;
    const form = closestParent(e.target, 'vertical-form');
    const errors = validate(form, constraints) || {};
    showErrorsOrSuccessForInput(ele, errors[ele.name]);
  }

  handleHelp(e) {
    const helpType = e;
    const data = {
      email: this.state.email,
    };
    if (this.state.email !== '') {
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
  }

  handleFormSubmit(e) {
    const v = e.target.id;
    const form = document.querySelector('.vertical-form');
    const errors = {};
    this.setState({
      requestInProgress: true,
    });
    validate.async(form, constraints, { cleanAttributes: false })
      .then((success) => {
        // console.log(v.target.id);
        this.handleHelp(v);
      })
      .catch((errors) => {
        form.querySelectorAll('input.needValidation').forEach((input, index) => {
          if (this) {
            showErrorsOrSuccessForInput(input, errors && errors[input.name]);
          }
        });
      });
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
            <form className="vertical-form" action="">
              <div className="form-group text-left">
                <input
                  type="text"
                  name="email"
                  className="form-control needValidation"
                  placeholder="Email"
                  onChange={(v) => this.handleChange('email', v.target.value)}
                  onBlur={this.handleValidateInput}
                />
                <div className="messages pad" />
              </div>
              <div className="form-group login-btn">
                {
                  this.state.requestInProgressReset
                    ? <img src="/img/loading80px.gif" alt="" />
                    : (
                      <input
                        type="button"
                        id="resetPassword"
                        value="Reset Password"
                        className="input-btn"
                        onClick={(e) => this.handleFormSubmit(e)}
                      />
                    )
                }
              </div>
              <div className="form-group login-btn">
                {
                  this.state.requestInProgressResend
                    ? <img src="/img/loading80px.gif" alt="" />
                    : (
                      <input
                        type="button"
                        id="resendVerifyEmail"
                        value="Resend Verification Email"
                        className="input-btn"
                        onClick={(e) => this.handleFormSubmit(e)}
                      />
                    )
                }
              </div>
            </form>
          </div>
          {this.state.successMessage
            ? (
              <div className="help-text">
                If there is an account associated with that email, the requested link has been sent. Please check
                your email for further instructions.
              </div>
            )
            : null}
        </div>
      </div>
    );
  }
}

export default FormsPage;
