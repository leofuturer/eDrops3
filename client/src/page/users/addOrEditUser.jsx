import React from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { updateCustomerProfile, addCustomer } from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie'

class AddOrEditUser extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            address: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            country: "",
            state: "",
            city: "",
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
                address: customerInfo.address,
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                phoneNumber: customerInfo.phoneNumber,
                country: customerInfo.country,
                state: customerInfo.state,
                city: customerInfo.city,
                userType: customerInfo.userType,
                username: customerInfo.username,
                email: customerInfo.email
            });
        }
    }

    handleSave() {
        let _this = this
        let userMes = {
            address: this.state.address,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            country: this.state.country,
            state: this.state.state,
            city: this.state.city,
            userType: "person",
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        }
        if (this.props.match.path === "/manage/users/edituser") {
            let customerId = this.props.location.state.customerId;
            let url = updateCustomerProfile.replace('id', customerId);
            API.Request(url, 'PATCH', userMes, true).then(res => {
                console.log(res);
                _this.props.history.push('/manage/users');
            }).catch(error=>{
                console.error(error);
            });
        } else {
            let url = addCustomer;
            API.Request(url, 'POST', userMes, true).then(res => {
                console.log(res);
                _this.props.history.push('/manage/users');
            }).catch(error=>{
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
        if(Cookies.get('username') === undefined){
            return <Redirect to='/login'></Redirect>
        }
        if(this.props.match.path === "/manage/users/edituser") {
            var profileContent = "Edit the Customer";
        } else {
            var profileContent = "Add a New User";
        }
        return(
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>{profileContent}</h2>
                    <div className="form-div">
                        <form action="">
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>address</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.address} className="form-control" onChange={v => this.handleChange('address', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>firstName</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.firstName} className="form-control" onChange={v => this.handleChange('firstName', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>lastName</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.lastName} className="form-control" onChange={v => this.handleChange('lastName', v.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>phoneNumber</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.phoneNumber} className="form-control" onChange={v => this.handleChange('phoneNumber', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>country</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.country} className="form-control" onChange={v => this.handleChange('country', v.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>state</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.state} className="form-control" onChange={v => this.handleChange('state', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>city</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.city} className="form-control" onChange={v => this.handleChange('city', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>username</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.username} className="form-control" onChange={v => this.handleChange('username', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>email</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.email} className="form-control" onChange={v => this.handleChange('email', v.target.value)}/>
                                </div>
                            </div>
                            {
                                this.props.match.path === "/manage/users/addNewUsers"
                                ? 
                                <div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>password</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" onChange={v => this.handleChange('password', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>confirmPassword</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" onChange={v => this.handleChange('confirmPassword', v.target.value)}/>
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