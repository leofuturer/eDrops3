import React from 'react';

import './forgetPass.css';
import {customerForgetPass} from "../../api/serverConfig";
import API from "../../api/api";

class FormsPage extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            newInputPassword:""
        }
        this.handleForgetPass = this.handleForgetPass.bind(this);
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }
    handleForgetPass() {
        let _this = this;
        let userMes = {
            email: this.state.email,
            newInputPassword:this.state.newInputPassword
        }
        API.Request(customerForgetPass, 'POST',userMes,false).then(res=>{
            console.log(res)
            _this.props.history.push('/home')
        }).catch(error=>{
            console.error(error)
        })
    }

    render() {
        console.log(this)
        return(
            <div>
                <div className="login-bg">
                    <h2>Forget Password</h2>
                    <h4>Home / Forget Password</h4>
                </div>
                <div className="login-input">
                    <h3>Forget Password</h3>
                    <div className="div-login-content">
                        <form action="">
                            <div className="input-content">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email" onChange={v => this.handleChange('email', v.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="newPassword" onChange={v => this.handleChange('newInputPassword', v.target.value)}/>
                                </div>
                                <div className="form-group login-btn">
                                    <input type="button" value="Save" className="input-btn" onClick={this.handleForgetPass}/>
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

export default FormsPage;