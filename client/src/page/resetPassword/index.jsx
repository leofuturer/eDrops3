import React from 'react';
import './resetPassword.css';
import { NavLink } from 'react-router-dom';
import { userResetPass } from '../../api/serverConfig';
import API from '../../api/api';
import constraints from '../register/formConstraints';

import { closestParent, showErrorsOrSuccessForInput } from '../../utils/validate';

const validate = require('validate.js');

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confNewPassword: '',
      errorDetected: false,
      errorDetectedPOST: false,
      passwordChanged: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidateInput = this.handleValidateInput.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleCheckConfirmPassword = this.handleCheckConfirmPassword.bind(this);
  }

  handleChange(key, value) {
    this.setState(
      {
        [key]: value,
      },
    );
  }

  handleValidateInput(e) {
    const ele = e.target;
    const form = closestParent(e.target, 'vertical-form');
    const errors = validate(form, constraints) || {};
    console.log(ele)
    showErrorsOrSuccessForInput(ele, errors[ele.name]);
  }

  handleCheckConfirmPassword() {
    if (this.state.confNewPassword !== '') {
      const conf = document.getElementsByTagName('input')[1];
      conf.focus();
      conf.blur();
    }
  }

  handleReset() {
    const queryString = this.props.location.search;
    let resetToken = '';
    if (queryString !== '') {
      resetToken = queryString.slice(queryString.indexOf('=') + 1);
      console.log(resetToken);
    }
    // possible errors: empty reset token, passwords not matching,
    // password not satisfying the minimum requirement
    if (resetToken === ''
            || this.state.newPassword !== this.state.confNewPassword
            || !constraints.password.format.pattern.test(this.state.newPassword)) {
      this.setState({
        passwordChange: false,
      });
      if(resetToken === '') {
        this.setState({
          errorDetected: true,
        });
      }
    } else {
      const url = `${userResetPass}?access_token=${resetToken}`;
      const options = {
        newPassword: this.state.newPassword,
      };
      API.Request(url, 'POST', options, false)
        .then((res) => {
          this.setState({
            passwordChanged: true,
            errorDetectedPOST: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            errorDetectedPOST: true,
            passwordChange: false,
          });
        });
    }
  }

  render() {
    return (
      <div className="background">
        <h3>Reset Password</h3>
        <div className="border-h3" />
        <div className="help-text">
          Please enter your new password. The password should contain
          at least a number, capital letter, and lowercase letter,
          and be at least 8 characters long.
        </div>
        <div className="input-content">
          <form className="vertical-form" action="">
            <div className="form-group row text-left">
              <label className="control-label">
                <span>New Password*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="New Password"
                onChange={(v) => this.handleChange('newPassword', v.target.value)}
                onBlur={(e) => { this.handleValidateInput(e); this.handleCheckConfirmPassword(); }}
              />
              <div className="messages pad">
                <p className="info">
                  Must have at least 8 characters.
                </p>
              </div>
            </div>
            <div className="form-group row text-left">
              <label className="control-label">
                <span>Confirm New Password*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm New Password"
                onChange={(v) => this.handleChange('confNewPassword', v.target.value)}
                onBlur={this.handleValidateInput}
              />
              <div className="messages pad">
                <p className="info">
                  Please confirm your password.
                </p>
              </div>
            </div>
            <div className="form-group rst-btn">
              <input
                type="button"
                value="Change Password"
                className="input-btn"
                onClick={(e) => this.handleReset(e)}
              />
            </div>
          </form>
        </div>
        {this.state.errorDetected
          ? (
            <div>
              <div className="help-text">
                It appears that the link to reset your password has expired.
              </div>
              <div className="link">
                <NavLink to="/forgetPass">Resend Email for Password Reset or Email Verification</NavLink>
              </div>
              <div className="link">
                <a href="mailto:service@edrops.org">Contact Us for Help</a>
              </div>
            </div>
          )
          : null}
        {this.state.errorDetectedPOST
          ? (
            <div>
              <div className="help-text">
                Error: Failed to change password. Please confirm that
                the email for your account is verified and the password
                reset link has not expired.
              </div>
              <div className="link">
                <NavLink to="/forgetPass">Resend Email for Password Reset or Email Verification</NavLink>
              </div>
              <div className="link">
                <a href="mailto:service@edrops.org">Contact Us for Help</a>
              </div>
            </div>
          )
          : null}
        {
          this.state.passwordChanged
            ? (
              <div>
                <div className="help-text">
                  Your password has successfully been reset.
                </div>
                <div className="link">
                  <NavLink to="/login">Login to Your Account</NavLink>
                </div>
              </div>
            )
            : null
        }

      </div>
    );
  }
}

export default ResetPassword;
