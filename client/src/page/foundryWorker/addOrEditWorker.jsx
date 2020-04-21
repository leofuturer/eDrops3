import React from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { addFoundryWorker, editFoundryWorker } from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from 'js-cookie'

class AddOrEditWorker extends React.Component{
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
            email: "",
            password:"",
            affiliation:"",
            password: "",
            confirmPassword: ""
        }
        this.handleSave = this.handleSave.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if(this.props.match.path === "/manage/foundryworkers/editworker") {
            let workerInfo = this.props.location.state.workerInfo;
            this.setState({
                address: workerInfo.address,
                firstName: workerInfo.firstName,
                lastName: workerInfo.lastName,
                phoneNumber: workerInfo.phoneNumber,
                country: workerInfo.country,
                state: workerInfo.state,
                city: workerInfo.city,
                userType: "person",
                username: workerInfo.username,
                email: workerInfo.email,
                affiliation: workerInfo.affiliation
            })
        }
    }

    handleSave() {
        let _this = this
        let data = {
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
            affiliation:this.state.affiliation,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        }
        
        if (this.props.match.path === '/manage/foundryworkers/addfoundryworker') {
            API.Request(addFoundryWorker, 'POST', data, true)
            .then(res => {
                console.log(res);
                _this.props.history.push('/manage/foundryworkers');
            })
            .catch(error => {
                console.error(error);
            })
        }
        else {
            let workerId = this.props.location.state.workerId;
            let url = editFoundryWorker.replace('id', workerId) 
            API.Request(url, 'PATCH', data, true)
            .then((res) => {
                console.log(res);
                this.props.history.push('/manage/foundryworkers');
            })
            .catch((err) => {
                console.error(err);
            })
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
        if (this.props.match.path === "/manage/foundryworkers/editworker") {
            var profileContent = "Edit Foundry Worker Profile";
        } else {
            var profileContent = "Add new Foundry Worker";
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
                                    <input type="text" className="form-control" value={this.state.address} onChange={v => this.handleChange('address', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>firstName</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.firstName} onChange={v => this.handleChange('firstName', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>lastName</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.lastName} onChange={v => this.handleChange('lastName', v.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>phoneNumber</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.phoneNumber} onChange={v => this.handleChange('phoneNumber', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>country</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.country} onChange={v => this.handleChange('country', v.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>state</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.state} onChange={v => this.handleChange('state', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>city</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.city} onChange={v => this.handleChange('city', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>username</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.username} onChange={v => this.handleChange('username', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>email</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.email} onChange={v => this.handleChange('email', v.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                    <span>affiliation</span>
                                </label>
                                <div className="col-md-8 col-sm-8 col-xs-8">
                                    <input type="text" className="form-control" value={this.state.affiliation} onChange={v => this.handleChange('affiliation', v.target.value)}/>
                                </div>
                            </div>
                            {
                                this.props.match.path === "/manage/foundryworkers/addfoundryworker"
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
                                :
                                null
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
AddOrEditWorker = withRouter(AddOrEditWorker);
export default AddOrEditWorker;