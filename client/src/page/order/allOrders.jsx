// Admin only page, for customer page see order/index.jsx
import React from 'react';
import Cookies from 'js-cookie';
import { getAllOrderInfos } from '../../api/serverConfig';
import API from '../../api/api';
import loadingGif from '../../../static/img/loading80px.gif';

class AllOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      isLoading: false,
    };
    this.handleDetail = this.handleDetail.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const url = getAllOrderInfos;
    const data = {};
    API.Request(url, 'GET', data, true)
      .then((res) => {
        this.setState({
          orderList: res.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
      });
  }

  handleDetail(e) {
    // Using the window.open() method to open a new window
    // and display the page based on the passed in redirectUrl
    const orderId = e.target.parentNode.parentNode.id;
    const redirectUrl = `/subpage/order-detail?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderDetail = window.open(redirectUrl, '_blank', strWindowFeatures);
    WindowForOrderDetail._orderItemId = orderId;
  }

  render() {
    if (Cookies.get('userType') !== 'admin') {
      return <Redirect to="/login" />;
    }
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>All Orders</h2>
        </div>
        <div className="content-show-table row">
          <div className="table-background">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th className="icon-center">Details</th>
                </tr>
              </thead>
              <tbody>
                { this.state.orderList.length !== 0
                  ? this.state.orderList.map((item, index) => (
                    <tr key={index} id={item.id}>
                      <td>{item.orderComplete ? item.orderInfoId : 'Customer cart'}</td>
                      <td>{item.customerId}</td>
                      <td>{item.status}</td>
                      <td>
                        $
                        {parseFloat(item.total_cost).toFixed(2)}
                      </td>
                      <td className="icon-center">
                        <i className="fa fa-commenting" onClick={this.handleDetail} />
                      </td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td>
                        {
                          this.state.isLoading
                            ? <img src={loadingGif} alt="" className="loading-icon" />
                            : 'No orders have been submitted yet.'
                        }
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AllOrders;
