import React from 'react';
import './beforeCheckout.css';

class SingleAddress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const address = this.props.addressTem;
    return (
      <div onClick={this.props.onClick}>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className={`card-view ${this.props.selected}`} style={{ minHeight: '200px' }}>
            <div className="row">
              <div className="col-md-6 col-sm-6 col-xs-6">
                <h4>
                  Address
                  {' '}
                  {this.props.addressNum}
                </h4>
              </div>
              { address.isDefault
                ? (
                  <div className="col-md-6 col-sm-6 col-xs-6 text-right">
                    <div>
                      <span className="text-span">Default Shipping</span>
                      <i className="fa fa-cube fa-inline" />
                    </div>
                    <div>
                      <span className="text-span">Default Billing</span>
                      <i className="fa fa-credit-card fa-inline" />
                    </div>
                  </div>
                )
                : null}
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

export default SingleAddress;
