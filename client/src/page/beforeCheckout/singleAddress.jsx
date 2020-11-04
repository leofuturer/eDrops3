import React from 'react';
import { withRouter } from 'react-router';
import "../address/address.css";
import "./beforeCheckout.css";

class SingleAddress extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        let address = this.props.addressTem;
        return (
            <div onClick={this.props.onClick}>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <div className={`card-view ${this.props.selected}`} style={{minHeight: "200px"}}>
                        <div className="row">
                            <div className="col-md-7 col-sm-7 col-xs-7">
                                <h4>Address {this.props.addressNum}</h4>
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
                    </div>
                </div>
            </div>
        );
    }
}

SingleAddress = withRouter(SingleAddress);
export default SingleAddress;
