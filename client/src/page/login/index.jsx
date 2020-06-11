import React from 'react';
import { NavLink, withRouter } from  'react-router-dom';
import './login.css';
import {customerLogin, AdminLogin, FoundryWorkerLogin, customerGetProfile, findAdminByWhere, findOneWorkerByWhere, findCustomerByWhere} from "../../api/serverConfig";

import API from "../../api/api";
import Cookies from 'js-cookie';
import _ from 'lodash';
import $ from 'jquery';
var validate = require('validate.js');

class Login extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            usernameOrEmail: localStorage.username,
            password: localStorage.password,
            usertype: ""
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameEmailValidation = this.handleNameEmailValidation.bind(this);
        this.showError = this.showError.bind(this);
        this.clearReminder = this.clearReminder.bind(this);
        this.handleRemeberMe = this.handleRemeberMe.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if (localStorage.chkbx === 'true') {
            // console.log("in the 1");
            $('.remeber-me').prop('checked', true);
            $('.pass-input').val(localStorage.password);
            $('.name-input').val(localStorage.username);
        } else {
            // console.log("in the 2");
            $('.remeber-me').prop('checked', false);
            $('.pass-input').val('');
            $('.name-input').val('');
            // console.log('password:' + $('pass-input').val());
            // console.log('username:' + $('.name-input').val());
        }
    }

    handleRemeberMe() {
        if ($('.remeber-me').prop('checked')) {
            localStorage.username = $('.name-input').val();
            localStorage.password = $('.pass-input').val();
        } else {
            localStorage.username = '';
            localStorage.password = '';
        }
        localStorage.chkbx = $('.remeber-me').prop('checked');
    }

    handleChange(key, value) {
        // console.log("I am called!");
        this.setState(
            {
                [key]: value
            }
        )
    }

    clearReminder() {
        let blocks = document.querySelectorAll(".error.help-block");
        let formToValidate = document.querySelector(".input-contenth");
        formToValidate.classList.remove("has-error");
        _.each(blocks, function(block) {
            block.remove();
        });
        let radioDiv = document.querySelector(".radio-group");
        radioDiv.classList.remove("has-error");
    }

    showError(input, error) {
        if (error) {
            let messages = input.nextSibling;
            let block = document.createElement("p");
            block.classList.add("help-block");
            block.classList.add("error");
            block.innerHTML = error;
            messages.appendChild(block);
        }
    }

    handleNameEmailValidation(e) {
        let _this = this;
        let constraints = {
            usernameOrEmail: {
                presence: true
            },
            password: {
                presence: true
            }
        }
        let formToValidate = document.querySelector(".input-contenth");
        let errors = validate(formToValidate, constraints) || null;
        if (errors) {
            let inputToValidate = document.querySelectorAll(".need-validation");
            formToValidate.classList.add("has-error");
            _.each(inputToValidate, function(input) {
                _this.showError(input, errors && errors[input.name]);
            })
            //validation fails
            return false;
        }
        //validation succeeds
        return true;
    }

    handleRadioValidation() {
        let radioChecked = false;
        let radioGroup = document.querySelectorAll(".radioToValidate");
        let i = 0;
        while(!radioChecked && i < radioGroup.length) {
            if (radioGroup[i].checked) {
                radioChecked = true;
            }
            i++;
        }
        if (!radioChecked) {
            let radioDiv = document.querySelector(".radio-group");
            radioDiv.classList.add("has-error");
            let messages = document.querySelector(".messages-radio");
            let block = document.createElement("p");
            block.classList.add("help-block");
            block.classList.add("error");
            block.innerHTML = "Please select an identity!";
            messages.appendChild(block);
        }
        return radioChecked;
    }

    handleLogin() {
        let _this = this;
        let data;
        if(/@/.test(this.state.usernameOrEmail)) {
            data = {
                email: this.state.usernameOrEmail,
                password: this.state.password
            }
        }
        else {
            data = {
                username: this.state.usernameOrEmail,
                password: this.state.password
            }
        }      
        let validationData = {};
        let url, validationUrl; //URLs for backend requests
        let validatedUsername, validatedEmail;
        if (this.state.usertype === 'customer') {
            url = customerLogin;
            if(!data.email) {
                validationUrl = `${findCustomerByWhere}?filter={"where": {"username": "${this.state.usernameOrEmail}"}}`;
            } else {
                //DY 4/23/2020: changed from {"email": "${this.state.email}"} to this.state.usernameOrEmail
                // otherwise, cannot log in using email
                validationUrl = `${findCustomerByWhere}?filter={"where": {"email": "${this.state.usernameOrEmail}"}}`;
            }
        }
        else if (this.state.usertype === 'admin') {
            url = AdminLogin;
            if(!data.email) {
                validationUrl = `${findAdminByWhere}?filter={"where": {"username": "${this.state.usernameOrEmail}"}}`;
            } else {
                validationUrl = `${findAdminByWhere}?filter={"where": {"email": "${this.state.usernameOrEmail}"}}`;
            }
        }
        else if (this.state.usertype === 'worker') {
            url = FoundryWorkerLogin;
            if(!data.email) {
                validationUrl = `${findOneWorkerByWhere}?filter={"where": {"username": "${this.state.usernameOrEmail}"}}`;
            } else {
                validationUrl = `${findOneWorkerByWhere}?filter={"where": {"email": "${this.state.usernameOrEmail}"}}`;
            }
        }
        _this.clearReminder();
        let nameEmailResult = _this.handleNameEmailValidation();
        let radioResult = _this.handleRadioValidation();
        if (nameEmailResult && radioResult) {
            API.Request(validationUrl, 'GET', validationData, false)
            .then(res => {
                if (res.data.length === 0) {
                    document.querySelector(".name-field").classList.add("has-error");
                    let block = document.createElement("p");
                    block.classList.add("help-block");
                    block.classList.add("error");
                    block.innerHTML = "The username/email has not been registered";
                    document.querySelector(".registrationError").appendChild(block);
                }              
                else {
                    // console.log(res.data);
                    // res.data is an array with only 1 element, so need to do [0]
                    validatedUsername = res.data[0].username;
                    validatedEmail = res.data[0].email;
                    API.Request(url, 'POST', data, false)
                    .then(res => {
                        // 4/23/2020: Always have cookies and local storage
                        Cookies.set('access_token', res.data.id);
                        Cookies.set('userId', res.data.userId);
                        Cookies.set('userType', _this.state.usertype);
                        Cookies.set('username', validatedUsername);

                        localStorage.setItem('username', validatedUsername);
                        localStorage.setItem('password', this.state.password);
                        _this.props.history.push('/home');
                    })
                    .catch(err => {
                        console.log(err);    
                        let block = document.createElement("p");
                        if (err.response.status === 401) {
                            document.querySelector(".pass-field").classList.add("has-error");
                            block.classList.add("help-block");
                            block.classList.add("error");
                            block.innerHTML = "Incorrect password or email verification required";
                            document.querySelector(".passwordError").appendChild(block);
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        return(
            <div>
                <div className="login-input">
                    <div className="div-login-contenth">
                        <h3>Login</h3>
                        <div className="border-h3"></div>
                        <form action="">
                            <div className="input-contenth">
                                <div className="form-group">
                                    <div>
                                        <span>Don't have an account? </span>
                                        <NavLink to="/register">Register now</NavLink>
                                    </div>
                                </div>
                                <div className="form-group name-field">
                                    <div className="whitespace"></div>
                                    <input type="text" name="usernameOrEmail" className="form-control name-input need-validation" placeholder="Username or Email" 
                                    onChange={v => this.handleChange('usernameOrEmail', v.target.value)} />
                                    <div className="registrationError messages"></div>
                                </div>
                                <div className="form-group pass-field">
                                    <div className="whitespace"></div>
                                    <input type="password" name="password" className="form-control pass-input need-validation" placeholder="Password" 
                                    onChange={v => this.handleChange('password', v.target.value)} />
                                    <div className="passwordError messages"></div>
                                </div>
                                <div className="form-group row radio-group">
                                    <div className="col-md-3 col-sm-3 col-xs-3"></div>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <label className="radio-inline">
                                            <input type="radio" className="radioToValidate" name="userType" value="customer" onChange={v => this.handleChange('usertype', v.target.value)}/> <span className="txt-radio">Customer</span>
                                        </label>
                                        <label className="radio-inline" style={{marginLeft:'50px'}}>
                                            <input type="radio" className="radioToValidate" name="userType" value="admin" onChange={v => this.handleChange('usertype', v.target.value)}/> <span className="txt-radio">Admin</span>
                                        </label>
                                        <label className="radio-inline" style={{marginLeft:'50px'}}>
                                            <input type="radio" className="radioToValidate" name="userType" value="worker" onChange={v => this.handleChange('usertype', v.target.value)}/><span className="txt-radio">Foundry</span>
                                        </label>
                                    </div>
                                    <div className="messages-radio col-md-3 col-sm-3 col-xs-3"></div>
                                </div>
                                <div className="form-group row">
                                    <div className="whitespace col-sm-3"></div>
                                    <div className="check-inline col-sm-3">
                                        <input type="checkbox" className="remeber-me" onClick={this.handleRemeberMe} /> <span className="remeber">Remember me</span>
                                    </div>
                                    <div className="forget-pass col-sm-3">
                                        <NavLink to="/forgetPass">Forgot Password?</NavLink>
                                    </div>
                                </div>
                                <div className="form-group login-btn">
                                    <input type="button" value="Login" className="input-btn" onClick={this.handleLogin}/>
                                </div>
                                
                                {/* <div className="form-group">
                                    <div style={{marginTop:'20px'}}>
                                        <span className="spanLine"></span>
                                        <span className="spanTxt">or</span>
                                        <span className="spanLine"></span>
                                    </div>
                                </div> */}
                                <div className="form-group">
                                    <div className="border-div-goole">
                                        <i className="fa fa-google"></i>
                                        <span className="span-txt-padding">Login with Google</span>
                                    </div>
                                    <div className="border-div-goole">
                                        <i className="fa fa-facebook"></i>
                                        <span className="span-txt-padding">Login with Facebook</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <span>If you have trouble logging in to your account, </span>
                                    <a href="mailto:abc@def.com">contact us.</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="hr-div-login"></div>
            </div>
        );
    }
};

Login = withRouter(Login);
export default Login;