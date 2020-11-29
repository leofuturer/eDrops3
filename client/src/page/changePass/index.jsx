import React from 'react';
import {Redirect,withRouter} from "react-router-dom";
import './changePass.css';
import {customerChangePass, FoundryWorkerChangePass, AdminChangePass} from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie';
import _ from 'lodash';
var validate = require('validate.js');

class FormsPage extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
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
                [key]: value
            }
        )
    }
    
    handleChangePass(e) {
        let _this = this;
        let data = {
            oldPassword: this.state.oldPassword,
            newPassword:this.state.newPassword
        }
        let url = "";
        if(Cookies.get('userType') === 'customer'){
            url = customerChangePass;
        } else if(Cookies.get('userType') === 'worker'){
            url = FoundryWorkerChangePass;
        } else if(Cookies.get('userType') === 'admin'){
            url = AdminChangePass;
        }
        let validateResult = _this.handleSubmit();
        if (validateResult) {
            API.Request(url, 'POST', data, true)
            .then( res => {
                alert("Password successfully changed");
                this.props.history.push('/manage/profile');
            })
            .catch(error => {
                console.log(error.response.data.error.message);
                if (error.response.data.error.message === "Invalid current password") {
                    let ele = document.getElementsByName("oldPassword");
                    let errors = ["The current password is incorrect!"];
                    this.clearMessage(ele[0]);
                    this.showErrors(ele[0], errors);
                }
            });
        }
    }

    handleValidate(e) {
        let constraints = {
            oldPassword: {
                presence: true
            },
            newPassword: {
                presence: true,
                length: {
                    minimum: 6,
                    maximun: 20
                },
                format: {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                    message: "should at least contain a capital letter, a lowercase letter and a number"
                }
            },
            confirmPassword: {
                presence: true,
                equality: {
                    attribute: "newPassword",
                    message: "^Two passwords do not match"
                }
            }
        };
        let formToValidate = e.target.parentNode.parentNode;
        let errors = validate(formToValidate, constraints) || {};
        let ele = e.target;
        this.clearMessage(ele);
        if (errors && errors[ele.name]) {
            this.showErrors(ele, errors[ele.name]);
        } else {
            this.showSuccess(ele);
        }
    }

    showErrors(ele, errors) {
        let _this = this;
        ele.parentNode.classList.add("has-error");

        _.each(errors, function(error) {
            _this.addError(ele, error);
        });
    }

    showSuccess(ele) {
        ele.parentNode.classList.add("has-success");
        let message = document.createElement("p");
        let messageDiv = ele.nextSibling;
        message.innerHTML = "Looks good!";
        message.classList.add("text-success");
        messageDiv.appendChild(message);
    }

    addError(input, error) {
        let block = document.createElement("p");
        let messageDiv = input.nextSibling;
        block.innerHTML = error;
        block.classList.add('error');
        block.classList.add('help-block');
        messageDiv.appendChild(block);
    }

    clearMessage(ele) {
        let formGroup = ele.parentNode;
        formGroup.classList.remove('has-error');
        formGroup.classList.remove('has-success');
        let messageDiv = formGroup.querySelector(".messages-wide");
        while (messageDiv.hasChildNodes()) {
            messageDiv.removeChild(messageDiv.firstChild);
        }
    }

    handleSubmit(e) {
        let _this = this;
        let constraints = {
            oldPassword: {
                presence: true
            },
            newPassword: {
                presence: true,
                length: {
                    minimum: 8
                },
                format: {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
                    message: "should at least contain a capital letter, a lowercase letter and a number"
                }
            },
            confirmPassword: {
                presence: true,
                equality: {
                    attribute: "newPassword",
                    message: "^Two passwords do not match"
                }
            }
        };
        let formToValidate = document.querySelector("form");
        let errors = validate(formToValidate, constraints) || null;
        let inputsToValidate = document.querySelectorAll(".needValidation");
        _.each(inputsToValidate, (input) => {
            _this.clearMessage(input);
        });
        _.each(inputsToValidate, (input) => {
            if (errors && errors[input.name]) {
                _this.showErrors(input, errors[input.name]);
            } else {
                _this.showSuccess(input);
            }
        });
        if (errors) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        if(Cookies.get('userId') === undefined) {
            return <Redirect to='/login'></Redirect>
        }
        return(
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>Change Password</h2>
                    <div style={{marginTop:'50px'}} >
                        <form action="">
                            <div className="form-group">
                                <label>Old Password</label>
                                <input type="password"  name="oldPassword" 
                                    className="form-control needValidation" 
                                    placeholder="Old Password" 
                                    onChange={v => this.handleChange('oldPassword', v.target.value)} 
                                    onBlur={this.handleValidate}/>
                                <div className="messages-wide"></div>
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" name="newPassword" 
                                    className="form-control needValidation" 
                                    placeholder="New Password" 
                                    onChange={v => this.handleChange('newPassword', v.target.value)} 
                                    onBlur={this.handleValidate}/>
                                <div className="messages-wide"></div>
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" 
                                    className="form-control needValidation" 
                                    placeholder="Confirm Password"
                                    onChange={v => this.handleChange('confirmPassword', v.target.value)} 
                                    onBlur={this.handleValidate}/>
                                <div className="messages-wide"></div>
                            </div>
                            <div className="form-group text-right" style={{marginTop:'30px'}}>
                                <input type="button" value="Save" 
                                    className="btn btn-success" 
                                    onClick={this.handleChangePass}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};
FormsPage = withRouter(FormsPage)
export default FormsPage;
