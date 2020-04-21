import React from 'react';
import './address.css';
import API from '../../api/api';
import { customerAddresses } from '../../api/serverConfig';
import { AddressList } from './addressList.jsx';
import Cookies from 'js-cookie';

class Address extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            addressList: []
        }
        this.handleAddNewAddress = this.handleAddNewAddress.bind(this);
        this.handleUpdateAddress = this.handleUpdateAddress.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    handleAddNewAddress(){
        let _this = this;
        _this.props.history.push('/manage/address/newAddress');
    }
    handleUpdateAddress(){
        let _this = this;
        _this.props.history.push('/manage/address/updateAddress');
    }
    componentDidMount() {
        let _this = this;
        let url = customerAddresses.replace('id', Cookies.get('userId'));
        let data = {}
        API.Request(url, 'GET', data, true)
        .then((res) => {
            //console.log(res);
            _this.setState({
                addressList: res.data
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    render() {
        return (
            <div className="right-route-content">
                <div className="profile-content">
                    <h2>Address Book</h2>
                </div>
                <div id="address-list">
                    <AddressList  addressArray={this.state.addressList} />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="card-view">
                                <div className="row row-add-new">
                                    <div className="col-md-4 col-sm-4 col-xs-4"></div>
                                    <div className="col-md-4 col-sm-4 col-xs-4">
                                        <button className="btn btn-success" onClick={this.handleAddNewAddress}>
                                            <i>+</i>
                                            <span className="btn-txt-padding">Add New</span>
                                        </button>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4"></div>
                                </div>
                            </div>
                </div>
            </div>
        )
    }
}

export default Address;