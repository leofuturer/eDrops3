import React from 'react';
import { withRouter } from 'react-router';
import './address.css';
import { customerAddresses } from '../../api/serverConfig';
import Cookies from 'js-cookie';
import API from '../../api/api';
import $ from 'jquery';

class AddressTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeleteAddress = this.handleDeleteAddress.bind(this);
        this.handleUpdateAddress = this.handleUpdateAddress.bind(this);
    }
    handleUpdateAddress() {
        let _this = this;
        let address = _this.props.addressTem;
        // console.log('aaa');
        _this.props.history.push('/manage/address/updateaddress', {
            addressInfo: address,
            addressId: address.id
        });
    }
    handleDeleteAddress() {
        let _this = this;
        let address = _this.props.addressTem;
        let addressId = address.id;
        let url = customerAddresses.replace('id', Cookies.get('userId'));
        url += `/${addressId}`;

        // Use axios to send request
        /*
        let data = {};
        let classSelector = '.card' + address.id;
        API.Request(url, 'DELETE', data, true)
        .then((res) => {
            //console.log(res);
            $(classSelector).remove();
            console.log('Address deleted');
            console.log(url);
        })
        .catch((err) => {
            console.log(err);
        })
        */
        
        // Use ajax to send request --- works well
        
        url += `?access_token=${Cookies.get('access_token')}`;
        let xhr = new XMLHttpRequest();
        let classSelector = '.card' + address.id;
        xhr.onreadystatechange = function() {
           if (this.readyState === 4 && this.status === 204) {
               //console.log('111');
               $(classSelector).remove();
               //console.log(this.responseText);
           }
        }
        xhr.open("DELETE", url, true);
        xhr.send();
        

        // Use jquery ajax to send request
        /*
        let address = _this.props.addressTem;
        url += '?access_token=' + Cookies.get('access_token');
        let classSelector = '.card' + address.id;
        $.ajax({
           url: url,
           success: function() {
               $(classSelector).remove();
           }
        });
        */
    }

    render(){
        let address = this.props.addressTem;
        return (
            <div className={"card" + address.id}>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="card-view">
                                <div className="row">
                                    <div className="col-md-7 col-sm-7 col-xs-7">
                                        <h3>Address {this.props.addressNum}</h3>
                                    </div>
                                    { address.isDefault
                                        ? 
                                        <div className="col-md-5 col-sm-5 col-xs-5">
                                            <div>
                                                <span className="txt-span">Default Shipping</span>
                                                <i className="fa fa-cube fa-inline"></i>
                                            </div>
                                            <div>
                                                <span className="txt-span">Default Billing</span>
                                                <i className="fa fa-credit-card fa-inline"></i>
                                            </div>
                                        </div>
                                        : null
                                    }
                                    
                                </div>
                                <div className="row">
                                    <div className="row-txt-padding">{address.street}</div>
                                    <div className="row-txt-padding">{address.city}</div>
                                    <div className="row-txt-padding">{address.state}</div>
                                    <div className="row-txt-padding">{address.country}</div>
                                    <div className="row-txt-padding">{address.zipCode}</div>
                                </div>
                                <div className="row row-btn">
                                    <button className="btn btn-primary btn-padding">
                                        <i className="fa fa-cog"></i>
                                        <span className="btn-txt-padding" onClick={this.handleUpdateAddress}>Update</span>
                                    </button>
                                    { address.isDefault
                                        ? null
                                        :
                                        <button className="btn btn-danger btn-padding" >
                                        <i className="fa fa-trash-o"></i>
                                        <span className="btn-txt-padding" onClick={this.handleDeleteAddress}>Delete</span>
                                        </button>
                                    }
                                    
                                </div>
                            </div>
                </div>
            </div>
        );
    }
}

AddressTemplate = withRouter(AddressTemplate);
export default AddressTemplate;
