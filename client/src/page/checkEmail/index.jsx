import React from 'react';
import {NavLink} from  'react-router-dom';
import './checkEmail.css';

class CheckEmail extends React.Component  {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className = "check-email">
                <h3>Thanks for signing up!</h3>
                <div className="border-h3"></div>
                <div className = "check-email-text">
                    A verification email has been sent to the email address provided during registration.
                </div>  
                <div className="home-page">
                    <NavLink to="/home">Home Page</NavLink>
                </div>
            </div>
            
        );
    }
};


export default CheckEmail;