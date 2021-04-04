import React from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { updateAdminProfile, addAdmin, userSignUp } from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie'

class AddOrEditAdmin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            phoneNumber: "",
            realm: "",
            username: "",
            email: ""
        }
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if(this.props.match.path === "/manage/admins/editAdmin" ) {
            let adminInfo = this.props.location.state.adminInfo;
            this.setState({
                phoneNumber: adminInfo.phoneNumber,
                realm: adminInfo.realm,
                username: adminInfo.username,
                email: adminInfo.email
            });
        }
    }

    handleSave() {
        let _this = this;
        let userMes = {
            phoneNumber: this.state.phoneNumber,
            realm: this.state.realm,
            username: this.state.username,
            email: this.state.email
        }
        if (this.props.match.path === "/manage/admins/editAdmin") {
            let adminId = this.props.location.state.adminId;
            let url = updateAdminProfile.replace('id', adminId);
            API.Request(url, 'PATCH', userMes, true).then(res => {
                url = userBaseFind + `?filter={"where": {"email": "${userMes.email}"}}`;
                API.Request(url, 'GET', {}, true)
                .then((res) => {
                    let userBaseId = res.data[0].id;
                    url = updateUserBaseProfile.replace('id', userBaseId);
                    API.Request(url, 'PATCH', userMes, true)
                    .then((res) => {
                        _this.props.history.push('/manage/admins');
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
            }).catch(error => {
                console.error(error);
            });
        } else { //add new admin
            let url = addAdmin;
            Object.assign(userMes, {
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            if(userMes.password !== userMes.confirmPassword){
                alert("Error: Password and Confirm Password fields do not match");
                return;
            }
            API.Request(url, 'POST', userMes, true).then(res => {
                let obj = {
                    password: this.state.password,
                    userType: "admin",
                    realm: this.state.realm,
                    username: this.state.username,
                    email: this.state.email
                };
                API.Request(userSignUp, 'POST', obj, false).then(res =>{
                    _this.props.history.push('/manage/admins');
                })
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
        if(this.props.match.path === "/manage/admins/editAdmin") {
            var profileContent = "Edit Admin Info";
        } else {
            var profileContent = "Add New Admin";
        }
        return(
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>{profileContent}</h2>
                    <div className="form-div">
                        <form action="">
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
                                    <span>Realm</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" value={this.state.realm} className="form-control" onChange={v => this.handleChange('realm', v.target.value)}/>
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
                                this.props.match.path === "/manage/admins/addNewAdmin"
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

AddOrEditAdmin = withRouter(AddOrEditAdmin);
export default AddOrEditAdmin;
