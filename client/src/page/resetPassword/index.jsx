import React from 'react';
import './resetPassword.css';
import {customerResetPass} from "../../api/serverConfig";
import API from "../../api/api";
import {NavLink} from  'react-router-dom';
import {constraints} from '../register/formConstraints';

class ResetPassword extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newPassword: "",
            confNewPassword: "", 
            errorDetected: false,
            passwordChanged: false
        }
        this.handleReset = this.handleReset.bind(this);
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }

    handleReset(){
        let queryString = this.props.location.search;
        let resetToken = "";
        if(queryString !== ""){
            resetToken = queryString.slice(queryString.indexOf('=')+1);
            console.log(resetToken);
        }
        // possible errors: empty reset token, passwords not matching,
        // password not satisfying the minimum requirement
        if(resetToken === "" ||
            this.state.newPassword !== this.state.confNewPassword || 
            !constraints.password.format.pattern.test(this.state.newPassword)){
            this.setState({
                errorDetected: true,
                passwordChange: false
            });
        }
        else {
            let url = `${customerResetPass}?access_token=${resetToken}`;
            let options = {
                newPassword: this.state.newPassword
            }
            API.Request(url, 'POST', options, false)
            .then(res => {
                this.setState({
                    passwordChanged: true,
                    errorDetected: false
                });
            })
            .catch(err =>{
                console.log(err);
                this.setState({
                    errorDetected: true,
                    passwordChange: false
                });
            });
        }
    }  

    render(){       
        return (
            <div className = "background">
                <h3>Reset Password</h3>
                <div className="border-h3"></div>
                <div className="help-text">
                    Please enter your new password. The password should contain 
                    at least a number, capital letter, and lowercase letter, 
                    and be at least 8 characters long.
                </div>  
                <div className="input-content">
                    <form action="">
                        <div className="form-group">
                            <input type="password" className="form-control" 
                            placeholder="New Password" 
                            onChange={v => this.handleChange('newPassword', v.target.value)}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" 
                            placeholder="Confirm New Password" 
                            onChange={v => this.handleChange('confNewPassword', v.target.value)}/>
                        </div>
                        <div className="form-group rst-btn">
                            <input type="button"
                                value="Change Password" className="input-btn" 
                                onClick={e => this.handleReset(e)}/>    
                        </div>   
                    </form>
                </div>
                {this.state.errorDetected 
                    ? 
                    <div>
                        <div className="help-text">
                            Error: Failed to change password. Please confirm that 
                            the email for your account is verified, the password 
                            reset token is valid, your new password meets the password 
                            requirements, and that the confirm password field matches 
                            the password field.
                        </div>
                        <div className="link">
                            <NavLink to="/forgetPass">Resend Email for Password Reset or Email Verification</NavLink>
                        </div>
                        <div className="link">
                            <a href="mailto:abc@def.com">Contact Us for Help</a>
                        </div>
                    </div>     
                    : null
                }
                {
                    this.state.passwordChanged
                    ?
                    <div>
                        <div className="help-text">
                            Your password has successfully been reset. 
                        </div>
                        <div className="link">
                            <NavLink to="/login">Login to Your Account</NavLink>
                        </div>
                    </div>
                    : null
                }
                
            </div>
        );
    }
};

export default ResetPassword;