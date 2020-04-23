import React from 'react';
import {Redirect, withRouter} from 'react-router-dom'
import './profile.css';
import {customerGetProfile, adminGetProfile, foundryWorkerGetProfile, updateCustomerProfile, updateWorkerProfile, updateAdminProfile} from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie'

class Profile extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            address: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            country: "",
            state: "",
            city: "",
            zipCode: "",
            userType: "person",
            username: "",
            email: "",
            affiliation: ""
        }
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        let _this = this;
        let userType = Cookies.get('userType');
        var InitUrl;
        if (userType === 'customer') {
            InitUrl = customerGetProfile;
        } 
        else if (userType === 'admin') {
            InitUrl = adminGetProfile;
        } else {
            InitUrl = foundryWorkerGetProfile;
        }
        let url = InitUrl.replace('id', Cookies.get('userId'));
        let data = {};
        API.Request(url, 'GET', data, true)
        .then(res => {
            if (userType === 'admin') {
                this.setState(
                    {
                        address: "N/A",
                        firstName: "N/A",
                        lastName: "N/A",
                        phoneNumber: "N/A",
                        country: "N/A",
                        state: "N/A",
                        city: "N/A",
                        zipCode: "N/A",
                        userType: "person",
                        username: res.data.username,
                        email: res.data.email
                    }
                );
            } else if (userType === "worker") {
                this.setState({
                    address: res.data.address,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    phoneNumber: res.data.phoneNumber,
                    country: res.data.country,
                    state: res.data.state,
                    city: res.data.city,
                    zipCode: res.data.zipCode,
                    userType: res.data.userType,
                    username: res.data.username,
                    email: res.data.email,
                    affiliation: res.data.affiliation
                });
            }
            else {
                // console.log(res.data);
                this.setState(
                    {
                        address: res.data.address,
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        phoneNumber: res.data.phoneNumber,
                        country: res.data.country,
                        state: res.data.state,
                        city: res.data.city,
                        zipCode: res.data.zipCode,
                        userType: res.data.userType,
                        username: res.data.username,
                        email: res.data.email
                    }
                );
            }
            console.log(this.state.country);
        })
        .catch(err => {
            console.error(err);
        });
    }

    handleSave() {
        let _this = this
        let userType = Cookies.get('userType');
        let userMes = {
            address: this.state.address,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            country: this.state.country,
            state: this.state.state,
            city: this.state.city,
            zipCode: this.state.zipCode,
            userType: "person",
            username: this.state.username,
            email: this.state.email
        }
        if(userType === 'customer') {
            var InitUrl = updateCustomerProfile;
        } 
        else if(userType === 'admin') {
            var InitUrl = updateAdminProfile;
        } else {
            var InitUrl = updateWorkerProfile;
        }
        let url = InitUrl.replace('id', Cookies.get('userId'));
        //let url = (this.props.match.path === '/manage/profile' ? ('../'+ InitUrl) : InitUrl)
        API.Request(url, 'PATCH', userMes, true).then(res => {
            console.log(res);
            //_this.props.history.push('/manage/profile')
            alert('Profile saved successfully!');
            document.location.reload(true);
        }).catch(error=>{
            console.error(error)
        });
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }
    
    render() {
        if(Cookies.get('username') === undefined) {
            return <Redirect to='/login'></Redirect>
        }
        var profileContent;
        //These codes are of no use at this time, but maybe useful when we plan to 
        //implement that using this file to complete the function that add/edit customer/worker information 
        if(Cookies.get('userType') === "admin") {
            if (this.props.match.path === "/manage/foundryworker/addfoundryworker") {
                profileContent = "Add new Foundry Worker";
            } else if (this.props.match.path === "/manage/foundryworker/updateworker") {
                profileContent = "Edit Foundry Worker Profile";
            } else if (this.props.match.path === "/manage/users/updateuser") {
                profileContent = "Edit Customer Profile";
            } else if (this.props.match.path === "/manage/users/addNewUsers") {
                profileContent = "Add new Customer";
            } else {
                profileContent = "Profile";
            }
        } else {
            profileContent = "Profile";
        }
        return(
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>{profileContent}</h2>
                    <div className="form-div">
                        <form action="">
                            {
                                Cookies.get("userType") === "admin"
                                ? null
                                :
                                <div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Username</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.username} onChange={v => this.handleChange('username', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Email</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.email} onChange={v => this.handleChange('email', v.target.value)}/>
                                        </div>
                                    </div>       
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>First Name</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.firstName} onChange={v => this.handleChange('firstName', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Last Name</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.lastName} onChange={v => this.handleChange('lastName', v.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Phone Number</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.phoneNumber} onChange={v => this.handleChange('phoneNumber', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Address</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.address} onChange={v => this.handleChange('address', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>City</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.city} onChange={v => this.handleChange('city', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>State or Province</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.state} onChange={v => this.handleChange('state', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Zip or Postal Code</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.zipCode} onChange={v => this.handleChange('zipCode', v.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                            <span>Country</span>
                                        </label>
                                        <div className="col-md-8 col-sm-8 col-xs-8">
                                            <input type="text" className="form-control" value={this.state.country} onChange={v => this.handleChange('country', v.target.value)} />
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                            }
                            {
                                Cookies.get('userType') === "worker" 
                                ?
                                <div className="form-group">
                                    <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                        <span>Affiliation</span>
                                    </label>
                                    <div className="col-md-8 col-sm-8 col-xs-8">
                                        <input type="text" className="form-control" value={this.state.affiliation} onChange={v => this.handleChange('affiliation', v.target.value)}/>
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
Profile = withRouter(Profile);
export default Profile;