import React from 'react';
import {withRouter} from 'react-router-dom';
import './address.css';
import {customerAddresses} from "../../api/serverConfig";
import API from "../../api/api";
import Cookies from "js-cookie";

class AddNewAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            street: "",
            city: "",
            state:"",
            country:"",
            zipcode:""
        }
        this.handleSaveAddress = this.handleSaveAddress.bind(this);
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }
        )
    }
    handleSaveAddress(){
        let _this = this;
        let addressMes = {
            street: this.state.street,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            zipCode: this.state.zipcode,
            isDefault: false
        }
        if(!addressMes.street || !addressMes.city || !addressMes.state || 
            !addressMes.country || !addressMes.zipCode){
                alert("Error: All fields must be filled");
        }
        else{
            let url = customerAddresses.replace('id', Cookies.get('userId'));
            API.Request(url, 'POST', addressMes, true)
            .then(res => {
                // console.log(res);
                _this.props.history.push('/manage/address');
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    render() {
        return (
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>Add New Address</h2>
                </div>
                <div className="form-div">
                    <form action="">
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>Street</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" className="form-control" onChange={v => this.handleChange('street', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>City</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" className="form-control" onChange={v => this.handleChange('city', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>State or Province</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" className="form-control" onChange={v => this.handleChange('state', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>Zip or Postal Code</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" className="form-control" onChange={v => this.handleChange('zipcode', v.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
                                <span>Country</span>
                            </label>
                            <div className="col-md-8 col-sm-8 col-xs-8">
                                <input type="text" className="form-control" onChange={v => this.handleChange('country', v.target.value)}/>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <div className="col-md-10 col-sd-10 col-xs-10"></div>
                            <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
                                <button type="button" className="btn btn-success" onClick={this.handleSaveAddress}>Add Address</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

AddNewAddress = withRouter(AddNewAddress)
export default AddNewAddress;
