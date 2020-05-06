import React from 'react';
import {withRouter} from 'react-router-dom';
import './address.css';
import {customerAddresses} from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from "js-cookie";

class UpdateAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            street: "",
            city: "",
            state:"",
            country:"",
            zipCode:""
        }
        this.handleUpdateAddress = this.handleUpdateAddress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        let addressInfo = this.props.location.state.addressInfo;
        this.setState({
            street: addressInfo.street,
            city: addressInfo.city,
            state: addressInfo.state,
            country: addressInfo.country,
            zipCode: addressInfo.zipCode,
        });
    }
    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }
    handleUpdateAddress(){
        let _this = this;
        let addressId = this.props.location.state.addressId;
        let addressMes = {
            street: this.state.street,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            zipCode: this.state.zipCode
        }
        let url = customerAddresses.replace('id', Cookies.get('userId'));
        url += `/${addressId}`;
        API.Request(url, 'PUT', addressMes, true)
        .then(res => {
            _this.props.history.push('/manage/address');
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {
        return (
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>Update Address</h2>
                </div>
                <div className="form-div">
                    <form action="">
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>Street</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" value={this.state.street} className="form-control" onChange={v => this.handleChange('street', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>City</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" value={this.state.city} className="form-control" onChange={v => this.handleChange('city', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>State</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" value={this.state.state} className="form-control" onChange={v => this.handleChange('state', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>Zip Code</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" value={this.state.zipCode} className="form-control" onChange={v => this.handleChange('zipCode', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>Country</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" value={this.state.country} className="form-control" onChange={v => this.handleChange('country', v.target.value)}/>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <div className="col-md-10 col-sd-10 col-xs-10"></div>
                            <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
                                <button type="button" className="btn btn-success" onClick={this.handleUpdateAddress}>Update Address</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
UpdateAddress = withRouter(UpdateAddress)
export default UpdateAddress;