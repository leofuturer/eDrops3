import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import './changePass.css';
import Cookies from 'js-cookie';
import {
  customerChangePass, FoundryWorkerChangePass, AdminChangePass, userChangePass,
} from '../../api/serverConfig';
import API from '../../api/api';
import loadingGif from '../../../static/img/loading80px.gif';

const validate = require('validate.js');

class FormsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isLoading: false,
    };
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.showErrors = this.showErrors.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.addError = this.addError.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(key, value) {
    this.setState(
      {
        [key]: value,
      },
    );
  }

  handleChangePass(e) {
    this.setState({
      isLoading: true,
    });
    const _this = this;
    const data = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
    };
    let url = '';
    if (Cookies.get('userType') === 'customer') {
      url = customerChangePass;
    } else if (Cookies.get('userType') === 'worker') {
      url = FoundryWorkerChangePass;
    } else if (Cookies.get('userType') === 'admin') {
      url = AdminChangePass;
    }
    const validateResult = _this.handleSubmit();
    if (validateResult) {
      API.Request(url, 'POST', data, true)
        // .then((res) => {
        //   const userToken = Cookies.get('access_token');
        //   Cookies.remove('access_token');
        //   API.Request(userChangePass, 'POST', data, true)
        //     .then((res) => {
        //       alert('Password successfully changed');
        //       Cookies.set('access_token', userToken);
        //       this.props.history.push('/manage/profile');
        //     }).catch((error) => {
        //       // Reset user base password failed
        //       console.error(error);
        //       this.setState({
        //         isLoading: false,
        //       });
        //     });
        // })
        .then((res) => {
          alert('Password successfully changed');
          this.props.history.push('/manage/profile');
        })
        .catch((error) => {
          console.error(error.response.data.error.message);
          if (error.response.data.error.message === 'Invalid current password') {
            const ele = document.getElementsByName('oldPassword');
            const errors = ['The current password is incorrect!'];
            this.clearMessage(ele[0]);
            this.showErrors(ele[0], errors);
          }
          this.setState({
            isLoading: false,
          });
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  handleValidate(e) {
    const constraints = {
      oldPassword: {
        presence: true,
      },
      newPassword: {
        presence: true,
        length: {
          minimum: 6,
          maximun: 20,
        },
        format: {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
          message: 'should at least contain a capital letter, a lowercase letter and a number',
        },
      },
      confirmPassword: {
        presence: true,
        equality: {
          attribute: 'newPassword',
          message: '^Two passwords do not match',
        },
      },
    };
    const formToValidate = e.target.parentNode.parentNode;
    const errors = validate(formToValidate, constraints) || {};
    const ele = e.target;
    this.clearMessage(ele);
    if (errors && errors[ele.name]) {
      this.showErrors(ele, errors[ele.name]);
    } else {
      this.showSuccess(ele);
    }
  }

  showErrors(ele, errors) {
    const _this = this;
    ele.parentNode.classList.add('has-error');
    errors.forEach((err, index) => {
      _this.addError(ele, err);
    });
  }

  showSuccess(ele) {
    ele.parentNode.classList.add('has-success');
    const message = document.createElement('p');
    const messageDiv = ele.nextSibling;
    message.innerHTML = 'Looks good!';
    message.classList.add('text-success');
    messageDiv.appendChild(message);
  }

  addError(input, error) {
    const block = document.createElement('p');
    const messageDiv = input.nextSibling;
    block.innerHTML = error;
    block.classList.add('error');
    block.classList.add('help-block');
    messageDiv.appendChild(block);
  }

  clearMessage(ele) {
    const formGroup = ele.parentNode;
    formGroup.classList.remove('has-error');
    formGroup.classList.remove('has-success');
    const messageDiv = formGroup.querySelector('.messages-wide');
    while (messageDiv.hasChildNodes()) {
      messageDiv.removeChild(messageDiv.firstChild);
    }
  }

  handleSubmit(e) {
    const _this = this;
    const constraints = {
      oldPassword: {
        presence: true,
      },
      newPassword: {
        presence: true,
        length: {
          minimum: 8,
        },
        format: {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
          message: 'should at least contain a capital letter, a lowercase letter and a number',
        },
      },
      confirmPassword: {
        presence: true,
        equality: {
          attribute: 'newPassword',
          message: '^Two passwords do not match',
        },
      },
    };
    const formToValidate = document.querySelector('form');
    const errors = validate(formToValidate, constraints) || null;
    const inputsToValidate = document.querySelectorAll('.needValidation');
    inputsToValidate.forEach((input, index) => {
      _this.clearMessage(input);
    });
    inputsToValidate.forEach((input, index) => {
      if (errors && errors[input.name]) {
        _this.showErrors(input, errors[input.name]);
      } else {
        _this.showSuccess(input);
      }
    });
    if (errors) {
      return false;
    }
    return true;
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>Change Password</h2>
          <div style={{ marginTop: '50px' }}>
            <form action="">
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  className="form-control needValidation"
                  placeholder="Old Password"
                  autoComplete="current-password"
                  onChange={(v) => this.handleChange('oldPassword', v.target.value)}
                  onBlur={this.handleValidate}
                />
                <div className="messages-wide" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control needValidation"
                  placeholder="New Password"
                  autoComplete="new-password"
                  onChange={(v) => this.handleChange('newPassword', v.target.value)}
                  onBlur={this.handleValidate}
                />
                <div className="messages-wide" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control needValidation"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  onChange={(v) => this.handleChange('confirmPassword', v.target.value)}
                  onBlur={this.handleValidate}
                />
                <div className="messages-wide" />
              </div>
              {this.state.isLoading
                ? <img className="loading-GIF" src={loadingGif} alt="" />
                : (
                  <div className="form-group text-right" style={{ marginTop: '30px' }}>
                    <input
                      type="button"
                      value="Save"
                      className="btn btn-success"
                      onClick={this.handleChangePass}
                    />
                  </div>
                )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
FormsPage = withRouter(FormsPage);
export default FormsPage;
