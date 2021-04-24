import React from 'react';
import queryString from 'query-string';
import API from '../../api/api';
import { getOrderInfoById, getProductOrders, getChipOrders } from '../../api/serverConfig';
import OrderItem from './orderItem.jsx';
import OrderAddress from './orderAddress.jsx';

class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doneLoading: false,
      orderId: queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).id,
    };
  }

  componentDidMount() {
    const _this = this;
    let url = getOrderInfoById.replace('id', this.state.orderId);
    API.Request(url, 'GET', {}, true)
      .then((res) => {
        this.setState({
          orderDetail: res.data,
        });
        console.log(res.data);
        this.setState({
          shippingAddress: {
            type: 'Shipping',
            name: res.data.sa_name,
            street: res.data.sa_address1,
            street2: res.data.sa_address2,
            city: res.data.sa_city,
            state: res.data.sa_province,
            country: res.data.sa_country,
            zipCode: res.data.sa_zip,
          },
          billingAddress: {
            type: 'Billing',
            name: res.data.ba_name,
            street: res.data.ba_address1,
            street2: res.data.ba_address2,
            city: res.data.ba_city,
            state: res.data.ba_province,
            country: res.data.ba_country,
            zipCode: res.data.ba_zip,
          },
        });
        const orderInfoId = res.data.id;
        url = getProductOrders.replace('id', orderInfoId);
        API.Request(url, 'GET', {}, true)
          .then((res) => {
            _this.setState({
              productOrders: res.data,
            });
            url = getChipOrders.replace('id', orderInfoId);
            API.Request(url, 'GET', {}, true)
              .then((res) => {
                _this.setState({
                  chipOrders: res.data,
                  doneLoading: true,
                });
                // console.log(res.data)
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const thisOrder = this.state.orderDetail;
    let totalItemsPrice = 0;
    if (this.state.productOrders !== undefined) {
      this.state.productOrders.forEach((product) => {
        totalItemsPrice += (product.quantity * product.price);
      });
    }
    if (this.state.chipOrders !== undefined) {
      this.state.chipOrders.forEach((product) => {
        totalItemsPrice += (product.quantity * product.price);
      });
    }

    return (
      <div className="order-detail-frame">
        { !this.state.doneLoading
          ? (
            <div className="order-detail-title-container">
              <h2>Page loading...</h2>
            </div>
          )
          : (
            <div>
              <div className="order-detail-title-container">
                <h2>eDrops Order Details</h2>
              </div>
              <div className="order-item-title">
                Order Number:
                {' '}
                {thisOrder.orderComplete ? thisOrder.orderInfoId : "N/A, is currently a customer's cart"}
              </div>
              <div id="order-addresses">
                <OrderAddress address={this.state.shippingAddress} />
                <OrderAddress address={this.state.billingAddress} />
              </div>
              {
                this.state.productOrders.map((oneProduct, index) => <OrderItem key={index} info={oneProduct} />)
              }
              {
                this.state.chipOrders.map((oneProduct, index) => <OrderItem key={index} info={oneProduct} />)
              }
              <div className="order-taxes-and-fees-price">
                Subtotal: $
                {parseFloat(totalItemsPrice).toFixed(2)}
              </div>
              <div className="order-taxes-and-fees-price">
                Fees and Taxes: $
                {thisOrder.orderComplete ? parseFloat(thisOrder.fees_and_taxes).toFixed(2) : 'N/A'}
              </div>
              <div className="order-total-price">
                Total: $
                {thisOrder.orderComplete ? (parseFloat(totalItemsPrice) + parseFloat(thisOrder.fees_and_taxes)).toFixed(2) : 'N/A'}
              </div>
              <div className="order-thank-you">
                Please contact us at edropswebsite@gmail.com for any questions. Thank you for the order!
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default OrderDetail;
