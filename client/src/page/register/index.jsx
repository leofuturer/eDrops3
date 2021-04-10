import React from 'react';
import { withRouter } from 'react-router-dom';
import API from '../../api/api';
import { customerSignUp, customerCredsTaken, userSignUp } from '../../api/serverConfig';
import { constraints } from './formConstraints';
import './register.css';
import loadingGif from '../../../static/img/loading80px.gif';

const validate = require('validate.js');

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      street: '',
      streetLine2: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      country: 'United States',
      state: '',
      city: '',
      zipCode: '',
      userType: 'person',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      requestInProgress: false,

    };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidateInput = this.handleValidateInput.bind(this);
    this.closestParent = this.closestParent.bind(this);
    this.showErrorsOrSuccessForInput = this.showErrorsOrSuccessForInput.bind(this);
    this.addError = this.addError.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleChange(key, value) {
    this.setState(
      {
        [key]: value,
      },
    );
  }

  /**
    * The method is used to display error messages adding <p>
    * behind the input
    */
  addError(messages, error) {
    const block = document.createElement('p');
    block.classList.add('help-block');
    block.classList.add('error');
    block.innerHTML = error;
    messages.appendChild(block);
  }

  closestParent(child, className) {
    if (!child || child == document) {
      return null;
    }
    if (child.classList.contains(className)) {
      return child;
    }
    return this.closestParent(child.parentNode, className);
  }

  showErrorsOrSuccessForInput(input, errors) {
    const _this = this;
    const formGroup = this.closestParent(input.parentNode, 'form-group');
    const messages = formGroup.querySelector('.messages');

    // remove old messages and reset the classes
    formGroup.classList.remove('has-error');
    formGroup.classList.remove('has-success');
    // and remove any old messages
    formGroup.querySelectorAll('.help-block.error, .text-muted, .text-success').forEach((ele, index) => {
      ele.remove();
    });

    if (errors) {
      // we first mark the group has having errors
      formGroup.classList.add('has-error');
      // then we append all the errors
      errors.forEach((err, index) => {
        _this.addError(messages, err); // Attention: we must use the _this instead of this!!!
      });
    } else {
      // otherwise we simply mark it as success
      const messages2 = formGroup.querySelector('.messages');
      formGroup.classList.add('has-success');
      const successInfo = document.createElement('p');
      successInfo.classList.add('text-success');
      successInfo.innerHTML = 'Looks good!';
      messages2.appendChild(successInfo);
    }
  }

  handleValidateInput(e) {
    const ele = e.target;
    const form = this.closestParent(e.target, 'vertical-form');
    const errors = validate(form, constraints) || {};
    this.showErrorsOrSuccessForInput(ele, errors[ele.name]);
  }

  handleFormSubmit(e) {
    const form = document.querySelector('.vertical-form');
    const errors = {};
    this.setState({
      requestInProgress: true,
    });
    validate.async(form, constraints, { cleanAttributes: false })
      .then((success) => {
        const data = {
          username: document.getElementById('inputUsername').value,
          email: document.getElementById('inputEmail').value,
        };
        const url = customerCredsTaken;
        return API.Request(url, 'POST', data, false);
      })
      .then((res) => {
        if (res.data.result.usernameTaken) {
          errors.username = ['Account already exists with this username'];
          const input1 = document.querySelector('#inputUsername');
          this.showErrorsOrSuccessForInput(input1, errors.username);
          this.setState({
            requestInProgress: false,
          });
        }
        if (res.data.result.emailTaken) {
          errors.email = ['Account already exists with this email'];
          const emailInput = document.getElementById('inputEmail');
          this.showErrorsOrSuccessForInput(emailInput, errors.email);
          this.setState({
            requestInProgress: false,
          });
        } else if (!res.data.result.emailTaken && !res.data.result.usernameTaken) {
          this.handleRegister(e);
        }
      })
      .catch((errors) => {
        form.querySelectorAll('input.needValidation').forEach((input, index) => {
          if (this) {
            this.showErrorsOrSuccessForInput(input, errors && errors[input.name]);
          }
        });
        this.setState({
          requestInProgress: false,
        });
      });
  }

  handleRegister(e) {
    const customerData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      userType: this.state.userType,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      street: this.state.street,
      streetLine2: this.state.streetLine2,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      zipCode: this.state.zipCode,
      isDefault: true,
    };
    API.Request(customerSignUp, 'POST', customerData, false)
      .then((res) => {
        const obj = {
          userType: 'customer',
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        };
        API.Request(userSignUp, 'POST', obj, false)
          .then((res) => {
            this.props.history.push('/checkEmail');
          })
          .catch((error) => {
            console.error(error);
            this.setState({
              requestInProgress: false,
            });
          });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          requestInProgress: false,
        });
      });
  }

  render() {
    return (
      <div>
        <div className="login-input">
          <div className="register-login-content">
            <h3>Sign Up</h3>
            <div className="border-h3" />
            <form id="main" className="vertical-form" action="" noValidate>
              <div className="input-content-register">
                <div className="text-left reminder">
                  <small className="text-muted">Fields with * are required</small>
                </div>
                <div className="form-group row">
                  <label htmlFor="inputEmail" className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Email*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      id="inputEmail"
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="form-control needValidation"
                      placeholder="Email"
                      onChange={(v) => this.handleChange('email', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Valid Email Required</small>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Username*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <input
                      type="text"
                      id="inputUsername"
                      name="username"
                      autoComplete="username"
                      className="form-control needValidation"
                      placeholder="Username"
                      onChange={(v) => this.handleChange('username', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Username must be at least 4 characters and only contain a-zA-Z0-9_</small>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Password*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="password"
                      name="password"
                      className="form-control needValidation"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(v) => this.handleChange('password', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">
                      Password must contain at least a number, capital
                      letter and lowercase letter, and at least 8 characters
                    </small>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Confirm Password*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control needValidation"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      onChange={(v) => this.handleChange('confirmPassword', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Please retype your password</small>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>First Name*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <input
                      type="text"
                      className="form-control needValidation"
                      name="firstName"
                      placeholder="First Name"
                      autoComplete="given-name"
                      onChange={(v) => this.handleChange('firstName', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  {/* does name="firstName" need to be added here? */}
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Last Name*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <input
                      type="text"
                      className="form-control needValidation"
                      name="lastName"
                      placeholder="Last Name"
                      autoComplete="family-name"
                      onChange={(v) => this.handleChange('lastName', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  {/* does name="lastname" need to be added here? */}
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>User Type*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <label className="radio-inline">
                      <input
                        type="radio"
                        name="userType"
                        value="Person"
                        onClick={(v) => this.handleChange('userType', v.target.value)}
                        onBlur={this.handleValidateInput}
                      />
                      <span className="txt-radio">Person</span>
                    </label>
                    <label className="radio-inline" style={{ marginLeft: '80px' }}>
                      <input
                        type="radio"
                        name="userType"
                        value="Company"
                        onClick={(v) => this.handleChange('userType', v.target.value)}
                        onBlur={this.handleValidateInput}
                      />
                      <span className="txt-radio">Company</span>
                    </label>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Personal or associated with a company</small>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Phone Number</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">

                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control needValidation"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      onChange={(v) => this.handleChange('phoneNumber', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Include area code, and if outside the US, country code</small>
                  </div>
                  {/* <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div> */}
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Street Line 1</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street"
                      autoComplete="address-line1"
                      onChange={(v) => this.handleChange('street', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Street Line 2</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street Line 2 (optional)"
                      autoComplete="address-line2"
                      onChange={(v) => this.handleChange('streetLine2', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>City</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      autoComplete="address-level2"
                      onChange={(v) => this.handleChange('city', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>State or Province</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="State or Province"
                      autoComplete="address-level1"
                      onChange={(v) => this.handleChange('state', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Zip or Postal Code</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zip or Postal Code"
                      autoComplete="postal-code"
                      onChange={(v) => this.handleChange('zipCode', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
                </div>

                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Country</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Country"
                      autoComplete="country-name"
                      onChange={(v) => this.handleChange('country', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
                </div>

                <div className="form-group login-btn">
                  {
                                        this.state.requestInProgress
                                          ? <img src={loadingGif} alt="" />
                                          : (
                                            <input
                                              type="button"
                                              value="Sign Up"
                                              className="input-btn"
                                              onClick={this.handleFormSubmit}
                                            />
                                          )
                                    }

                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="hr-div-login" />
      </div>
    );
  }
}

Register = withRouter(Register);
export default Register;
