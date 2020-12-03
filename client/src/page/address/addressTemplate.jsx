import React from 'react';
import { withRouter } from 'react-router';
import './address.css';
class AddressTemplate extends React.Component {
    constructor(props) {
        super(props);
        // this.handleDeleteAddress = this.handleDeleteAddress.bind(this);
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


    render(){
        let address = this.props.addressTem;
        // console.log(address);
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
                                    <div className="row-txt-padding">{address.streetLine2}</div>
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
                                        <button className="btn btn-danger btn-padding">
                                        <i className="fa fa-trash-o"></i>
                                        <span className="btn-txt-padding" onClick={this.props.onDeletion}>Delete</span>
                                        {/* <span className="btn-txt-padding" onClick={this.props.onDelete}>Delete</span> */}
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
