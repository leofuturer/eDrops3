import React from 'react';
import {NavLink} from  'react-router-dom';
import './emailVerified.css';

class EmailVerified extends React.Component  {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className = "email-verified">
                <h3>Email Verified!</h3>
                <div className="border-h3"></div>
                <div>
                    Thanks for verifying your email! Your account has been activated and is ready for use.
                </div>  
                <div className="link">
                    <NavLink to="/login">Log In</NavLink>
                </div>
                <div className="link">
                    <NavLink to="/home">Home Page</NavLink>
                </div>
            </div>
            
        );
    }
};


export default EmailVerified;