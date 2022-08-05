import React from 'react';
import { withRouter } from 'react-router-dom';
import './order.css';
import Cookies from 'js-cookie';
import API from '../../api/api';
import {
  adminGetChipOrders, customerGetChipOrders,
  workerGetChipOrders, editOrderStatus,
  downloadFileById, adminDownloadFile, workerDownloadFile,
}
  from '../../api/serverConfig';
import loadingGif from '../../../static/img/loading80px.gif';

import SEO from '../../component/header/seo.jsx';
import { metadata } from './metadata.jsx';

// List all chip orders for all user types
class ChipOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      isLoading: false,
    };
    if (this.props.match.path === '/manage/admin-retrieve-worker-orders'
      && Cookies.get('userType') === 'admin') {
      Object.assign(this.state, {
        workerId: this.props.location.state.workerId,
        isCustomer: this.props.location.state.isCustomer,
      });
    }

    this.handleDownload = this.handleDownload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAssign = this.handleAssign.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    let url = '';
    if (Cookies.get('userType') === 'customer') {
      url = customerGetChipOrders.replace('id', Cookies.get('userId'));
    } else if (Cookies.get('userType') === 'worker') {
      url = workerGetChipOrders.replace('id', Cookies.get('userId'));
    } else if (Cookies.get('userType') === 'admin') {
      url = adminGetChipOrders;
    }

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        // console.log(res);
        if (this.state.workerId) {
          res.data = res.data.filter((orderChip) => orderChip.workerId === this.state.workerId);
        }
        this.setState({
          orderList: res.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          isLoading: false,
        });
      });
  }

  handleDownload(e) {
    // console.log(e.target.id);
    let url = '';
    const itemId = Number(e.target.id.replace(/[^0-9]/ig, ''));
    if (Cookies.get('userType') === 'customer') {
      // for customer, `id` is file ID
      url = downloadFileById.replace('id', Cookies.get('userId'));
      url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    } else if (Cookies.get('userType') === 'worker') {
      // for worker, `id` is chipOrder ID (associated with that file)
      url = workerDownloadFile.replace('id', Cookies.get('userId'));
      url += `?access_token=${Cookies.get('access_token')}&chipOrderId=${itemId}`;
    } else if (Cookies.get('userType') === 'admin') {
      // for admin, `id` is file ID
      url = adminDownloadFile;
      url += `?access_token=${Cookies.get('access_token')}&fileId=${itemId}`;
    }

    window.location = url;
  }

  handleAssign(e) {
    // Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
    const orderIndex = Number(e.target.id.replace(/[^0-9]/ig, ''));
    const redirectUrl = '/manage/assign-orders';
    const strWindowFeatures = 'width=1200px, height=900px';
    const newWindow = window.open(redirectUrl, '_blank', strWindowFeatures);
    newWindow._order = this.state.orderList[orderIndex];
  }

  handleSubmit(e) {
    e.preventDefault();
    const dropdown = document.getElementById('status-selection');
    const selectedStatus = dropdown.options[dropdown.selectedIndex].value;
    const chipOrderId = Number(e.target.id.replace(/[^0-9]/ig, ''));
    const url = editOrderStatus.replace('id', this.state.orderList[chipOrderId].id);
    const data = { status: selectedStatus };
    // console.log(data);
    API.Request(url, 'PATCH', data, true)
      .then((res) => {
        alert('Status updated!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChat(e) {
    const orderId = Number(e.target.id.replace(/[^0-9]/ig, ''))
    const redirectUrl = `/subpage/order-chat?id=${orderId}`;
    const strWindowFeatures = 'width=1200px, height=900px';
    const WindowForOrderChat = window.open(redirectUrl, '_blank', strWindowFeatures);
    WindowForOrderChat._orderItemId = orderId;
  }

  render() {
    return (
      <div>
        <SEO
          title="eDrops | Chip Orders"
          description=""
          metadata={metadata}
        />
        <div className="right-route-content">
          <div className="profile-content">
            <h2>Chip Orders</h2>
          </div>
          <div className="content-show-table row">
            <div className="table-background">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    {
                      !(Cookies.get('userType') === 'customer')
                        ? <th>Uploader</th> // admin or worker
                        : null
                    }
                    <th>Last Updated</th>
                    {
                      !(Cookies.get('userType') === 'worker')
                        ? <th>Worker</th> // customer or admin
                        : null
                    }
                    {
                      Cookies.get('userType') === 'customer'
                        ? <th>Process Status</th> // customer
                        : <th className="icon-center">Edit Status</th> // worker or admin
                    }
                    <th className="icon-center">Qty</th>
                    <th className="icon-center">Mask File</th>
                    <th className="icon-center">Chat</th>
                    {
                      Cookies.get('userType') === 'admin'
                        ? <th className="icon-center">Assign Order</th> // admin
                        : null
                    }
                  </tr>
                </thead>
                <tbody>
                  {this.state.orderList.length !== 0
                    ? this.state.orderList.map((item, index) => (
                      <tr key={index} id={item.id}>
                        <td>{item.id}</td>
                        {
                          (Cookies.get('userType') !== 'customer')
                            ? <td>{item.customerName}</td>
                            : null
                        }
                        <td>{item.lastUpdated.substring(0, item.lastUpdated.indexOf('T'))}</td>
                        {
                          (Cookies.get('userType') !== 'worker')
                            ? <td>{item.workerName}</td>
                            : null
                        }
                        {
                          Cookies.get('userType') === 'customer'
                            ? <td>{item.status}</td>
                            : (
                              <td className="icon-center">
                                <form
                                  id="edit-order-status-form"
                                  className="edit-order-status-form"
                                  onSubmit={this.handleSubmit}
                                >
                                  <select id="status-selection" className="order-status" name="status" defaultValue={item.status}>
                                    <option value="Fabrication request received">Fab Req Received</option>
                                    <option value="Project Started">Project Started</option>
                                    <option value="Project Completed">Project Completed</option>
                                    <option value="Item Shipped">Item Shipped</option>
                                  </select>
                                  <input type="submit" id={`allOrder${index}`} />
                                </form>
                              </td>
                            )
                        }
                        <td className="icon-center">
                          {item.quantity}
                        </td>
                        <td className="icon-center">
                          {
                            Cookies.get('userType') === 'worker'
                              ? <i className="fa fa-download" onClick={this.handleDownload} id={`download${item.id}`} />
                              : <i className="fa fa-download" onClick={this.handleDownload} id={`download${item.fileInfoId}`} />
                          }
                        </td>
                        <td className="icon-center">
                          <i className="fa fa-commenting" onClick={this.handleChat} id={`order${item.orderId}`}/>
                        </td>
                        {
                          Cookies.get('userType') === 'admin'
                            ? (
                              <td className="icon-center">
                                <i className="fa fa-users" id={`allOrder${index}`} onClick={this.handleAssign} />
                              </td>
                            )
                            : null
                        }
                      </tr>
                    ))
                    : (
                      <tr>
                        <td>
                          {
                            this.state.isLoading
                              ? <img src={loadingGif} alt="" className="loading-icon" />
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

ChipOrders = withRouter(ChipOrders);
export default ChipOrders;
