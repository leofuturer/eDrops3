import React from 'react';
import './order.css';
import Cookies from 'js-cookie';
import API from '../../api/api';
import {
  customerOrderRetrieve, workerOrderRetrieve, getCustomerOrder, getAllOrderInfos,
}
  from '../../api/serverConfig';
import './animate.css';
import SEO from '../../component/header/seo.js';
import { metadata } from './metadata';

// The order list page for both customer and worker
class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      userInfo: {},
      isLoading: false,
    };
    if (this.props.match.path === '/manage/admin-retrieve-user-orders'
      && Cookies.get('userType') === 'admin') {
      Object.assign(this.state, {
        custId: this.props.location.state.userId,
        isCustomer: this.props.location.state.isCustomer,
        username: this.props.location.state.username,
      });
    }
    
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    if (this.props.match.path === '/manage/customer-orders') {
      var url = `${customerOrderRetrieve.replace('id', Cookies.get('userId'))}`;
    } else if (this.props.match.path === '/manage/admin-retrieve-user-orders') {
      var url = `${getAllOrderInfos}?filter={"where": {"customerId": ${this.state.custId}, "orderComplete": true}}`;
    } else {
      console.error('Unexpected error');
      return;
    }

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        // console.log(res.data)
        this.setState({
          orderList: res.data,
          isLoading: false,
        });
        console.log(this.state.orderList);
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          isLoading: false,
        });
      });
  }

  handleDetail(e) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const originalOrderId = e.target.id;
    const orderId = Number(originalOrderId.replace(/[^0-9]/ig, ''));
    const redirectUrl = `/subpage/order-detail?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  handleChat(e){
    const originalOrderId = e.target.id;
    const orderId = Number(originalOrderId.replace(/[^0-9]/ig, ''));
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  render() {
    return (
      <div>
        <SEO
          title="eDrops | Orders"
          description=""
          metadata={metadata}
        />
        <div className="right-route-content">
          <div className="profile-content">
            {
              this.props.match.path === '/manage/admin-retrieve-user-orders'
                ? (
                  <h2>
                    Orders for
                    {' '}
                    {this.state.username}
                  </h2>
                )
                : <h2>Orders</h2>
            }
          </div>
          <div className="content-show-table row">
            <div className="table-background">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Process Status</th>
                    <th>Total Price</th>
                    <th className="icon-center">Other Details</th>
                    <th className="icon-center">Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.orderList.length !== 0
                    ? this.state.orderList.map((item, index) => (
                      <tr key={index} id={item.id}>
                        <td>{item.orderInfoId}</td>
                        <td>{item.createdAt.substring(0, item.createdAt.indexOf('T'))}</td>
                        <td>{item.status}</td>
                        <td>
                          $
                          {parseFloat(item.total_cost).toFixed(2)}
                        </td>
                        <td className="icon-center">
                          <i className="fa fa-commenting" id={`worker-order${item.id}`} onClick={this.handleDetail} />
                        </td>
                        <td className="icon-center">
                          <i className="fa fa-commenting" id={`worker-order${item.id}`} onClick={this.handleChat} />
                        </td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td>
                          {
                            this.state.isLoading
                              ? <img src="/img/loading80px.gif" alt="" className="loading-icon" />
                              : (Cookies.get('userType') === 'worker'
                                ? 'No orders have been assigned to you yet.'
                                : 'No orders have been placed.')
                          }
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orders;
