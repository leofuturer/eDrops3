import React from 'react';
import './forgetPass.css';
import {    customerForgetPass, 
            findCustomerByWhere, 
            customerResendVerifyEmail} from "../../api/serverConfig";
import API from "../../api/api";
import _ from 'lodash';

// This page also allows for the resending of the email verification message.

class FormsPage extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            emailOrUsername: "",
            requestSuccessful: false,

        }
        this.handleHelp = this.handleHelp.bind(this);
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }

    handleHelp(e){
        // console.log(e.target.id);
        let _this = this;
        let email, username, getProfileUrl, verifyEmailUrl;
        let helpType = e.target.id;
        if(/@/.test(this.state.emailOrUsername)) {
            email = this.state.emailOrUsername;
            getProfileUrl = `${findCustomerByWhere}?filter={"where": {"email": "${email}"}}`;
        }
        else{
            username = this.state.emailOrUsername;
            getProfileUrl = `${findCustomerByWhere}?filter={"where": {"username": "${username}"}}`;
        }
        API.Request(getProfileUrl, 'GET', {}, false)
        .then(res => {
            // console.log(res.data);
            if(res.data.length === 1){
                //email/user should uniquely identify an account
                if(helpType === 'resetPassword'){
                    let options = {
                        email: res.data[0].email
                    }
                    API.Request(customerForgetPass, 'POST', options, false)
                    .then(res => {
                        this.setState({
                            requestSuccessful: true
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
                else{
                    // console.log(res.data[0].id);
                    verifyEmailUrl = customerResendVerifyEmail.replace('id', res.data[0].id);
                    // console.log(verifyEmailUrl);
                    API.Request(verifyEmailUrl, 'POST', {}, false)
                    .then(res => {
                        this.setState({
                            requestSuccessful: true
                        });
                    })
                    .catch(err =>{
                        console.log(err); 
                    });
                }
            }
            else{
                console.log("Error: more than one account with this username/email");
            }
        })
        .catch(err => {
            console.log(err);
            // we do not say if this username/email does not exist
            // standard practice to prevent people from figuring out if
            // a username/email is registered for this site
        });
    }

    render() {
        // console.log(this)
        return(
            <div>
                <div className="background">
                    <h3>Account Assistance</h3>
                    <div className="border-h3"></div>
                    <div className="help-text">
                        Please provide the email or username used during sign up 
                        to request an email for resetting your password or 
                        verifying your email. An email will be sent to the email 
                        on file for the provided username/email, so if you do not 
                        receive one, please make sure the email is typed in correctly.
                    </div>
                    <div className="input-content">
                        <form action="">
                                <div className="form-group">
                                    <input type="text" className="form-control" 
                                    placeholder="Username or Email" 
                                    onChange={v => this.handleChange('emailOrUsername', v.target.value)}/>
                                </div>
                                <div className="form-group login-btn">
                                    <input type="button" id="resetPassword" 
                                      value="Reset Password" className="input-btn" 
                                      onClick={e => this.handleHelp(e)}/>    
                                </div>
                                <div className="form-group login-btn">
                                    <input type="button" id="resendVerifyEmail" 
                                     value="Resend Verification Email" className="input-btn" 
                                     onClick={e => this.handleHelp(e)}/>    
                                </div>    
                        </form>
                    </div>
                    {this.state.requestSuccessful
                    ? 
                    <div className="help-text">
                        The request was successfully submitted. Please check
                        your email for further instructions.
                    </div>
                    : null   
                    }
                </div>
                <div className="hr-div-login"></div>
            </div>
        );
    }
};

export default FormsPage;