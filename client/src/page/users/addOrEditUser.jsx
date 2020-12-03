import React from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { updateCustomerProfile, addCustomer } from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie'

class AddOrEditUser extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            userType: "person",
            username: "",
            email: ""
        }
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if(this.props.match.path === "/manage/users/edituser" ) {
            let customerInfo = this.props.location.state.customerInfo;
            this.setState({
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                phoneNumber: customerInfo.phoneNumber,
                userType: customerInfo.userType,
                username: customerInfo.username,
                email: customerInfo.email
            });
        }
    }

    handleSave() {
        let _this = this
        let userMes = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            username: this.state.username,
            email: this.state.email,
        }
        if (this.props.match.path === "/manage/users/edituser") {
            let customerId = this.props.location.state.customerId;
            let url = updateCustomerProfile.replace('id', customerId);
            API.Request(url, 'PATCH', userMes, true).then(res => {
                _this.props.history.push('/manage/users');
            }).catch(error => {
                console.error(error);
            });
        } else { //add new customer
            let url = addCustomer;
            Object.assign(userMes, {
                userType: "person",
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            if(userMes.password !== userMes.confirmPassword){
                alert("Error: Password and Confirm Password fields do not match");
                return;
            }
            API.Request(url, 'POST', userMes, true).then(res => {
                _this.props.history.push('/manage/users');
            }).catch(error => {
                console.error(error);
            });
        }
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }
    render(){
        if(Cookies.get('userId') === undefined){
            return <Redirect to='/login'></Redirect>
        }
        if(this.props.match.path === "/manage/users/edituser") {
            var profileContent = "Edit Customer";
        } else {
            var profileContent = "Add New User";
        }
        return(
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>{profileContent}</h2>
                    <div className="form-div">
                        <form action="">
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>First Name</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.firstName} className="form-control" onChange={v => this.handleChange('firstName', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>Last Name</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.lastName} className="form-control" onChange={v => this.handleChange('lastName', v.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>Phone Number</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.phoneNumber} className="form-control" onChange={v => this.handleChange('phoneNumber', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>Username</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.username} className="form-control" onChange={v => this.handleChange('username', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>Email</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.email} className="form-control" onChange={v => this.handleChange('email', v.target.value)}/>
                                </div>
                            </div>
                            {
                                this.props.match.path === "/manage/users/addNewUser"
                                ? 
                                <div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Password</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="password" className="form-control" onChange={v => this.handleChange('password', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Confirm Password</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="password" className="form-control" onChange={v => this.handleChange('confirmPassword', v.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                : null
                            }
                            
                            <div className="form-group">
                                <div className="col-md-10 col-sd-10 col-xs-10"></div>
                                <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
                                    <button type="button" className="btn btn-success" onClick={this.handleSave}>Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

AddOrEditUser = withRouter(AddOrEditUser);
export default AddOrEditUser;