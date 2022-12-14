import React from 'react';
import Cookies from 'js-cookie';
import API from '../../api/api';
import {
  customerOrderRetrieve, workerOrderRetrieve, getAllOrderInfos,
} from '../../api/serverConfig';
import SEO from '../../component/header/SEO';
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

  handleDetail(orderId: number) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const redirectUrl = `/subpage/order-detail?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  handleChat(orderId: number) {
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center">
        <SEO
          title="eDrops | Orders"
          description=""
          metadata={metadata}
        />
        <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
          {
            this.props.match.path === '/manage/admin-retrieve-user-orders'
              ? (
                <h2 className="text-4xl">
                  Orders for
                  {' '}
                  {this.state.username}
                </h2>
              )
              : <h2 className="text-4xl">Orders</h2>
          }
        </div>
        <div className="w-full py-8">
          <table className="rounded-md shadow-box w-full border-collapse table-auto">
            <thead className="">
              <tr className="border-b-2">
                <th className="p-2">Order ID</th>
                <th className="p-2">Order Date</th>
                <th className="p-2">Process Status</th>
                <th className="p-2">Total Price</th>
                <th className="p-2">Other Details</th>
                <th className="p-2">Chat</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orderList.length !== 0
                ? this.state.orderList.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">{item.orderInfoId}</td>
                    <td className="p-2">{item.createdAt.substring(0, item.createdAt.indexOf('T'))}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">
                      $
                      {parseFloat(item.total_cost).toFixed(2)}
                    </td>
                    <td className="p-2">
                      <i className="fa fa-commenting" onClick={() => this.handleDetail(item.id)} />
                    </td>
                    <td className="p-2">
                      <i className="fa fa-commenting" onClick={() => this.handleChat(item.id)} />
                    </td>
                  </tr>
                ))
                : (
                  <tr>
                    <td className="p-2">
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
    );
  }
}

export default Orders;
