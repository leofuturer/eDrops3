import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  addFoundryWorker, editFoundryWorker, userSignUp,
  updateUserBaseProfile, userBaseFind,
} from '../../api/serverConfig';
import API from '../../api/api';
import constraints from './formConstraints';

import { closestParent, showErrorsOrSuccessForInput } from '../../utils/validate';
import loadingGif from '../../../static/img/loading80px.gif';

const validate = require('validate.js');

class AddOrEditWorker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      street: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      userType: 'person',
      username: '',
      email: '',
      affiliation: '',
      password: '',
      confirmPassword: '',
      requestInProgress: false,
      errorMessage: '',
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleValidateInput = this.handleValidateInput.bind(this);
  }

  componentDidMount() {
    if (this.props.match.path === '/manage/foundryworkers/editworker') {
      const { workerInfo } = this.props.location.state;
      this.setState({
        street: workerInfo.street,
        firstName: workerInfo.firstName,
        lastName: workerInfo.lastName,
        phoneNumber: workerInfo.phoneNumber,
        country: workerInfo.country,
        state: workerInfo.state,
        city: workerInfo.city,
        zipCode: workerInfo.zipCode,
        userType: 'person',
        username: workerInfo.username,
        email: workerInfo.email,
        affiliation: workerInfo.affiliation,
      });
    }
  }

  handleSave() {
    if (this.state.password !== this.state.confirmPassword) {
      alert('Error: Password and Confirm Password fields do not match');
      return;
    }
    const _this = this;
    const data = {
      street: this.state.street,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      zipCode: this.state.zipCode,
      userType: 'worker',
      username: this.state.username,
      email: this.state.email,
      affiliation: this.state.affiliation,
    };
    if (this.state.password !== '') {
      Object.assign(data, {
        password: this.state.password,
        // confirmPassword: this.state.confirmPassword,
      });
    }
    if (this.props.match.path === '/manage/foundryworkers/addfoundryworker') {
      API.Request(addFoundryWorker, 'POST', data, true)
        .then((res) => {
          // console.log(res);
          const obj = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            userType: 'worker',
          };
          API.Request(userSignUp, 'POST', obj, false)
            .then((res) => {
              _this.props.history.push('/manage/foundryworkers');
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const { workerId } = this.props.location.state;
      let url = editFoundryWorker.replace('id', workerId);
      // console.log(workerId);
      API.Request(url, 'PATCH', data, true)
        .then((res) => {
          url = `${userBaseFind}?filter={"where": {"email": "${data.email}"}}`;
          API.Request(url, 'GET', {}, true)
            .then((res) => {
              // console.log(res.data[0]);
              const userBaseId = res.data[0].id;
              url = updateUserBaseProfile.replace('id', userBaseId);
              API.Request(url, 'PATCH', data, true)
                .then((res) => {
                  _this.props.history.push('/manage/foundryworkers');
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
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return <Redirect to="/login" />;
    }
    if (this.props.match.path === '/manage/foundryworkers/editworker') {
      var profileContent = 'Edit Foundry Worker Profile';
    } else {
      var profileContent = 'Add new Foundry Worker';
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
                  this.props.match.path === '/manage/foundryworkers/addfoundryworker'
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
                    <span>Phone Number*</span>
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
                <div className="form-group row">
                  <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                    <span>Affiliation*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <input
                      type="text"
                      className="form-control needValidation"
                      name="affiliation"
                      placeholder="Affiliation"
                      autoComplete="affiliation"
                      value={this.state.affiliation}
                      onChange={(v) => this.handleChange('affiliation', v.target.value)}
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
                    <span>Street Address</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street"
                      autoComplete="address-line1"
                      value={this.state.street}
                      onChange={(v) => this.handleChange('street', v.target.value)}
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
                      value={this.state.city}
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
                      value={this.state.state}
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
                      value={this.state.zipCode}
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
                      value={this.state.country}
                      onChange={(v) => this.handleChange('country', v.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-4 messages-unset" />
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
                  <div className="form-group">
                    <small className="text-muted text-center text-danger w-100">
                      {this.state.errorMessage}
                    </small>
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
AddOrEditWorker = withRouter(AddOrEditWorker);
export default AddOrEditWorker;
