import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  updateCustomerProfile, addCustomer, userSignUp, customerCredsTaken,
  updateUserBaseProfile, userBaseFind,
} from '../../api/serverConfig';
import API from '../../api/api';
import constraints from './formConstraints';

import { closestParent, showErrorsOrSuccessForInput } from '../../utils/validate';
import loadingGif from '../../../static/img/loading80px.gif';

const validate = require('validate.js');

class AddOrEditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      userType: 'person',
      username: '',
      email: '',
      requestInProgress: false,
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleValidateInput = this.handleValidateInput.bind(this);
  }

  componentDidMount() {
    if (this.props.match.path === '/manage/users/edituser') {
      const { customerInfo } = this.props.location.state;
      this.setState({
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phoneNumber: customerInfo.phoneNumber,
        userType: customerInfo.userType,
        username: customerInfo.username,
        email: customerInfo.email,
      });
    }
  }

  handleSave() {
    const _this = this;
    const userMes = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      username: this.state.username,
      email: this.state.email,
    };
    if (this.props.match.path === '/manage/users/edituser') {
      // edit both customer and userBase instances
      const { customerId } = this.props.location.state;
      let url = updateCustomerProfile.replace('id', customerId);
      API.Request(url, 'PATCH', userMes, true)
        .then((res) => {
          url = `${userBaseFind}?filter={"where": {"email": "${userMes.email}"}}`;
          API.Request(url, 'GET', {}, true)
            .then((res) => {
              const userBaseId = res.data[0].id;
              url = updateUserBaseProfile.replace('id', userBaseId);
              API.Request(url, 'PATCH', userMes, true)
                .then((res) => {
                  _this.props.history.push('/manage/users');
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    } else { // add new customer (and new userBase)
      Object.assign(userMes, {
        userType: 'person',
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });
      if (userMes.password !== userMes.confirmPassword) {
        alert('Error: Password and Confirm Password fields do not match');
        return;
      }
      API.Request(addCustomer, 'POST', userMes, true).then((res) => {
        const obj = {
          username: this.state.username,
          email: this.state.email,
          userType: 'customer',
          password: this.state.password,
        };
        API.Request(userSignUp, 'POST', obj, false).then((res) => {
          _this.props.history.push('/manage/users');
        });
      }).catch((error) => {
        console.error(error);
      });
    }
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
    showErrorsOrSuccessForInput(ele, errors[ele.name]);

    // check for duplicates
    const data = {
      username: `${e.target.id === 'inputUsername' && e.target.value}`,
      email: `${e.target.id === 'inputEmail' && e.target.value}`,
    };
    const url = customerCredsTaken;
    API.Request(url, 'POST', data, false)
      .then((res) => {
        if (res.data.result.usernameTaken) {
          errors.username = ['Account already exists with this username'];
          const input1 = document.getElementById('inputUsername');
          showErrorsOrSuccessForInput(input1, errors.username);
        }
        if (res.data.result.emailTaken) {
          errors.email = ['Account already exists with this email'];
          const emailInput = document.getElementById('inputEmail');
          showErrorsOrSuccessForInput(emailInput, errors.email);
        }
      });
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return <Redirect to="/login" />;
    }
    if (this.props.match.path === '/manage/users/edituser') {
      var profileContent = 'Edit Customer';
    } else {
      var profileContent = 'Add New User';
    }
    return (
      <div>
        <div className="right-route-content">
          <div className="profile-content">
            <h2>{profileContent}</h2>
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
                      value={this.state.email}
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
                      value={this.state.username}
                      onChange={(v) => this.handleChange('username', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Username must be at least 4 characters and only contain a-zA-Z0-9_</small>
                  </div>
                </div>
                {
                  this.props.match.path === '/manage/users/addNewUser'
                  && (
                    <div>
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
                    </div>
                  )
                }
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
                      value={this.state.firstName}
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
                      value={this.state.lastName}
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
                    <span>Phone Number</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control needValidation"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      value={this.state.phoneNumber}
                      onChange={(v) => this.handleChange('phoneNumber', v.target.value)}
                      onBlur={this.handleValidateInput}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages">
                    <small className="text-muted">Include area code, and if outside the US, country code</small>
                  </div>
                  {/* <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div> */}
                </div>

                <div className="form-group">
                  <div className="col-md-10 col-sd-10 col-xs-10" />
                  <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
                    {
                      this.state.requestInProgress
                        ? <img src={loadingGif} alt="" />
                        : <button type="button" className="btn btn-success" onClick={this.handleSave}>Save</button>
                    }
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddOrEditUser = withRouter(AddOrEditUser);
export default AddOrEditUser;
