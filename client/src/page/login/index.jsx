import React from 'react';
import { NavLink, withRouter } from  'react-router-dom';
import './login.css';
import {userLogin,
        customerLogin, 
        AdminLogin, 
        FoundryWorkerLogin, 
        customerGetApiToken} from "../../api/serverConfig";

import API from "../../api/api";
import Cookies from 'js-cookie';
import _ from 'lodash';
import $ from 'jquery';
var validate = require('validate.js');
import Shopify from '../../app.jsx';

class Login extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            usernameOrEmail: "",
            password: "",
            isLoading: false,
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleNameEmailValidation = this.handleNameEmailValidation.bind(this);
        this.showError = this.showError.bind(this);
        this.clearReminder = this.clearReminder.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        $('.pass-input').val('');
        $('.name-input').val('');
    }

    handleChange(key, value) {
        // console.log("I am called!");
        this.setState({
            [key]: value
        });
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

    handleLogin() {
        this.setState({
          isLoading: true
        });
        let _this = this;
        let data;
        if(/@/.test(this.state.usernameOrEmail)) {
            data = {
                email: this.state.usernameOrEmail,
                password: this.state.password
            }
        } else {
            data = {
                username: this.state.usernameOrEmail,
                password: this.state.password
            }
        }
        let url; //URLs for backend requests
        _this.clearReminder();
        let nameEmailResult = _this.handleNameEmailValidation();
        if (nameEmailResult) {
            API.Request(userLogin, 'POST', data, false)
            .then(res => {
                let userType = res.data.userType;
                if (userType === "customer") {
                    url = customerLogin;
                } else if (userType === "admin") {
                    url = AdminLogin;
                } else if (userType  === "worker") {
                    url = FoundryWorkerLogin;
                }
                API.Request(url, 'POST', data, false)
                .then(res => {
                    // 4/23/2020: Always have cookies and local storage
                    Cookies.set('access_token', res.data.id);
                    Cookies.set('userId', res.data.userId);
                    Cookies.set('userType', userType );
                    Cookies.set('username', res.data.username);

                    //any authenticated user can use this endpoint
                    API.Request(customerGetApiToken, 'GET', {}, true)
                    .then(res => {
                        if(res.status === 200){
                            let shopify = Shopify.getInstance(res.data.info.token, res.data.info.domain);
                        }
                    }).catch(err => console.error(err));
                    _this.props.history.push('/home');
                    })
                .catch(err => {
                    console.error(err);
                    let block = document.createElement("p");
                    if (err.response.status === 401) {
                        document.querySelector(".pass-field").classList.add("has-error");
                        block.classList.add("help-block");
                        block.classList.add("error");
                        block.innerHTML = "Login error. Please check username/email and password. Email verification is required before logging in";
                        document.querySelector(".passwordError").appendChild(block);
                    }
                    this.setState({
                        isLoading: false
                    });
                });
            })
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
                                    <input type="text" name="usernameOrEmail"
                                            className="form-control name-input need-validation"
                                            placeholder="Username or Email"
                                            onChange={v => this.handleChange('usernameOrEmail', v.target.value)} />
                                    <div className="registrationError messages"></div>
                                </div>
                                <div className="form-group pass-field">
                                    <div className="whitespace"></div>
                                    <input type="password" name="password"
                                            className="form-control pass-input need-validation"
                                            placeholder="Password"
                                            onChange={v => this.handleChange('password', v.target.value)} />
                                    <div className="passwordError messages"></div>
                                </div>
                                
                                <div className="form-group row radio-group">
                                    <div className="col-md-3 col-sm-3 col-xs-3"></div>
                                    <div className="messages-radio col-md-3 col-sm-3 col-xs-3"></div>
                                </div>
    
                                <div className="form-group login-btn">
                                    {
                                        this.state.isLoading
                                        ? <img src="../../../static/img/loading80px.gif" alt=""/>
                                        : <input type="button" value="Login"className="input-btn" onClick={this.handleLogin}/>
                                    }
                                </div>
                                <div className="form-group row">
                                    <div className="forget-pass col" style={{marginLeft: '30px'}}>
                                        <NavLink to="/forgetPass">Forgot Password?</NavLink>
                                    </div>
                                </div>
                                
                                {/* <div className="form-group">
                                    <div className="border-div-goole">
                                        <i className="fa fa-google"></i>
                                        <span className="span-txt-padding">Login with Google</span>
                                    </div>
                                    <div className="border-div-goole">
                                        <i className="fa fa-facebook"></i>
                                        <span className="span-txt-padding">Login with Facebook</span>
                                    </div>
                                </div> */}
                                <div className="form-group">
                                    <span>If you have trouble logging in to your account, </span>
                                    <a href="mailto:edropwebsite@gmail.com">contact us.</a>
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
