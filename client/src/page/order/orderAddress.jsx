import React from 'react';
import { withRouter } from 'react-router';

class OrderAddress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { address } = this.props;
    return (
      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={{ textAlign: 'left' }}>
        <div className="card-view" style={{ minHeight: '170px' }}>
          <div className="row">
            <div className="col-md-7 col-sm-7 col-xs-7">
              <h4>
                {address.type}
                {' '}
                Address
                {' '}
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="row-txt-padding">{address.name}</div>
            <div className="row-txt-padding">{address.street}</div>
            <div className="row-txt-padding">{address.street2}</div>
            <div className="row-txt-padding">{address.city}</div>
            <div className="row-txt-padding">{address.state}</div>
            <div className="row-txt-padding">{address.country}</div>
            <div className="row-txt-padding">{address.zipCode}</div>
          </div>
        </div>

      </div>
    );
  }
}

OrderAddress = withRouter(OrderAddress);
export default OrderAddress;
