import React from 'react';
import { redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  updateAdminProfile, addAdmin, userSignUp, userBaseFind, updateUserBaseProfile, adminCredsTaken,
} from '../../api/serverConfig';
import API from '../../api/api';
import { addConstraints, editConstraints } from './formConstraints';
import { closestParent, showErrorsOrSuccessForInput } from '../../utils/validate';
import './admin.css';
import { formatPhoneNumber } from '../../utils/phone';

import validate from 'validate.js';

class AddOrEditAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      realm: '',
      username: '',
      email: '',
      requestInProgress: false,
      errorMessage: '',
      constraints: addConstraints,
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleValidateInput = this.handleValidateInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.match.path === '/manage/admins/editAdmin') {
      const { adminInfo } = this.props.location.state;
      this.setState({
        phoneNumber: adminInfo.phoneNumber,
        realm: adminInfo.realm,
        username: adminInfo.username,
        email: adminInfo.email,
        constraints: editConstraints,
        initialInfo: {
          phoneNumber: adminInfo.phoneNumber,
          realm: adminInfo.realm,
          username: adminInfo.username,
          email: adminInfo.email,
          constraints: editConstraints,
        },
      });
    }
  }

  handleFormSubmit(e) {
    const form = document.querySelector('.vertical-form');
    const errors = {};
    this.setState({
      requestInProgress: true,
    });
    const { username } = this.state;
    validate.async(form, this.state.constraints, { cleanAttributes: false })
      .then((success) => {
        const isAddNewAdmin = this.props.match.path === '/manage/admins/addNewAdmin';
        const data = {
          username: document.getElementById('inputUsername').value,
        };
        if (isAddNewAdmin) {
          data.email = document.getElementById('inputEmail').value;
        }
        const url = adminCredsTaken;
        API.Request(url, 'POST', data, true).then((res) => {
          if (isAddNewAdmin) {
            if (res.data.result.usernameTaken) {
              errors.username = ['Account already exists with this username'];
              const input1 = document.getElementById('inputUsername');
              showErrorsOrSuccessForInput(input1, errors.username);
              this.setState({
                requestInProgress: false,
              });
            }
            if (res.data.result.emailTaken) {
              errors.email = ['Account already exists with this email'];
              const emailInput = document.getElementById('inputEmail');
              showErrorsOrSuccessForInput(emailInput, errors.email);
              this.setState({
                requestInProgress: false,
              });
            } else if (!res.data.result.emailTaken && !res.data.result.usernameTaken) {
              this.handleSave(e);
            }
          } else if (this.state.username !== this.state.initialInfo.username && res.data.result.usernameTaken) {
            errors.username = ['Account already exists with this username'];
            const input1 = document.getElementById('inputUsername');
            showErrorsOrSuccessForInput(input1, errors.username);
            this.setState({
              requestInProgress: false,
            });
          } else {
            this.handleSave(e);
          }
        }).catch((err) => {
          form.querySelectorAll('input.needValidation').forEach((input, index) => {
            if (this) {
              showErrorsOrSuccessForInput(input, errors && errors[input.name]);
            }
          });
          this.setState({
            requestInProgress: false,
          });
        });
      })
      .catch((errors) => {
        form.querySelectorAll('input.needValidation').forEach((input, index) => {
          if (this) {
            showErrorsOrSuccessForInput(input, errors && errors[input.name]);
          }
        });
        this.setState({
          requestInProgress: false,
        });
      });
  }

  handleSave() {
    const _this = this;
    const userMes = {
      phoneNumber: formatPhoneNumber(this.state.phoneNumber),
      realm: this.state.realm,
      username: this.state.username,
      email: this.state.email,
    };
    if (this.props.match.path === '/manage/admins/editAdmin') {
      const { adminId } = this.props.location.state;
      let url = updateAdminProfile.replace('id', adminId);
      API.Request(url, 'PATCH', userMes, true).then((res) => {
        url = `${userBaseFind}?filter={"where": {"email": "${userMes.email}"}}`;
        API.Request(url, 'GET', {}, true)
          .then((res) => {
            const userBaseId = res.data[0].id;
            url = updateUserBaseProfile.replace('id', userBaseId);
            API.Request(url, 'PATCH', userMes, true)
              .then((res) => {
                _this.props.history.push('/manage/admins');
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      }).catch((error) => {
        console.error(error);
      });
    } else { // add new admin
      const url = addAdmin;
      Object.assign(userMes, {
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        userType: 'admin',
      });
      if (userMes.password !== userMes.confirmPassword) {
        alert('Error: Password and Confirm Password fields do not match');
        return;
      }
      API.Request(url, 'POST', userMes, true).then((res) => {
        const obj = {
          password: this.state.password,
          userType: 'admin',
          realm: this.state.realm,
          username: this.state.username,
          email: this.state.email,
        };
        API.Request(userSignUp, 'POST', obj, false).then((res) => {
          _this.props.history.push('/manage/admins');
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
    const errors = validate(form, this.state.constraints) || {};
    showErrorsOrSuccessForInput(ele, errors[ele.name]);

    // check for duplicates
    const isAddNewAdmin = this.props.match.path === '/manage/admins/addNewAdmin';
    const data = {
      username: `${e.target.id === 'inputUsername' && e.target.value}`,
    };
    if (isAddNewAdmin) {
      data.email = `${e.target.id === 'inputEmail' && e.target.value}`;
    }
    const url = adminCredsTaken;
    API.Request(url, 'POST', data, true)
      .then((res) => {
        if (isAddNewAdmin) {
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
        } else if (this.state.username !== this.state.initialInfo.username && res.data.result.usernameTaken) {
          errors.username = ['Account already exists with this username'];
          const input1 = document.getElementById('inputUsername');
          showErrorsOrSuccessForInput(input1, errors.username);
        }
      });
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return redirect("/login");
    }
    if (this.props.match.path === '/manage/admins/editAdmin') {
      var profileContent = 'Edit Admin Info';
    } else {
      var profileContent = 'Add New Admin';
    }
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>{profileContent}</h2>
          <form id="main" action="" className="vertical-form" noValidate>
            <div className="input-content-register">
              <div className="text-left reminder">
                <small className="text-muted">Fields with * are required</small>
              </div>
              <div className="form-group row">
                <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                  <span>Phone Number*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                  <input
                    type="text"
                    name="phoneNumber"
                    value={this.state.phoneNumber}
                    className="form-control needValidation"
                    onChange={(v) => this.handleChange('phoneNumber', v.target.value)}
                    onBlur={this.handleValidateInput}
                  />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 messages">
                  <small className="text-muted">Valid phone number required</small>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                  <span>Realm</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                  <input
                    type="text"
                    name="realm"
                    value={this.state.realm}
                    className="form-control"
                    onChange={(v) => this.handleChange('realm', v.target.value)}
                    onBlur={this.handleValidateInput}
                  />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 messages">
                  <small className="text-muted">(Optional)</small>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                  <span>Username*</span>
                </label>
                <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                  <input
                    type="text"
                    name="username"
                    id="inputUsername"
                    value={this.state.username}
                    className="form-control needValidation"
                    onChange={(v) => this.handleChange('username', v.target.value)}
                    onBlur={this.handleValidateInput}
                  />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 messages">
                  <small className="text-muted">Username must be at least 4 characters and only contain a-zA-Z0-9_</small>
                </div>
              </div>
              {
                this.props.match.path === '/manage/admins/addNewAdmin'
                  ? (
                    <div>
                      <div className="form-group row">
                        <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                          <span>Email*</span>
                        </label>
                        <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                          <input
                            type="text"
                            name="email"
                            id="inputEmail"
                            value={this.state.email}
                            className="form-control needValidation"
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
                          <span>Password*</span>
                        </label>
                        <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                          <input
                            type="password"
                            name="password"
                            className="form-control needValidation"
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
                  : null
              }

              <div className="form-group login-btn">
                <div className="col-md-10 col-sd-10 col-xs-10" />
                <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
                  {
                    this.state.requestInProgress
                      ? <img src="/img/loading80px.gif" alt="" />
                      : (
                        <input
                          type="button"
                          value="Save"
                          className="btn btn-success"
                          onClick={this.handleFormSubmit}
                        />
                      )
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
    );
  }
}

export default AddOrEditAdmin;
