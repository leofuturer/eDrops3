import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

import './order.css';
import API from "../../api/api";
import { customerOrderRetrieve, workerOrderRetrieve,
         downloadFileById, editOrderStatus,
         findCustomerByWhere, findOneWorkerByWhere,
         getCustomerOrder }
         from '../../api/serverConfig';

import Cookies from "js-cookie";
import $ from 'jquery';
import notify from 'bootstrap-notify';
import './animate.css';

//The order list page for both customer and worker
class Orders extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            userInfo: {},
            isLoading: false,
        }
        if(this.props.match.path === '/manage/admin-retrieve-user-orders'
            && Cookies.get('userType') === 'admin'){
            Object.assign(this.state, {
                custId: this.props.location.state.userId,
                isCustomer: this.props.location.state.isCustomer,
                username: this.props.location.state.username
            });
        }
    }

    componentDidMount() {
        this.setState({
          isLoading: true
        });
        var data = {};
        var method = 'GET';
        if (this.props.match.path === '/manage/worker-orders') {
            var url = workerOrderRetrieve.replace('id', Cookies.get('userId'));
        } else if (this.props.match.path === '/manage/customer-orders') {
            var url = customerOrderRetrieve.replace('id', Cookies.get('userId')) + '?filter={"where": {"orderComplete": true}}';
        } else if (this.props.match.path === '/manage/admin-retrieve-user-orders') {
            var url = getCustomerOrder.replace('id', Cookies.get('userId')) + `?filter={"where": {"customerId": ${this.state.custId}}, "orderComplete": true}`;
        } else {
            console.error('Unexpected error');
        }

        API.Request(url, method, data, true)
        .then(res => {
            console.log(res.data)
            this.setState({
                orderList: res.data,
                isLoading: false
            });
        })
        .catch(err => {
            console.error(err);
            this.setState({
              isLoading: false
            });
        });
    }



    handleDetail(e) {
        //Using the window.open() method to open a new window
        //and display the page based on the passed in redirectUrl
        let originalOrderId = e.target.id;
        let orderId = Number(originalOrderId.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/subpage/order-detail";
        let strWindowFeatures = "width=1200px, height=900px";
        let WindowForOrderDetail = window.open(redirectUrl, "_blank", strWindowFeatures);
        WindowForOrderDetail._orderItemId = orderId;
    }

    render() {
        return (
            <div>
                <div className="right-route-content">
                    <div className="profile-content">
                        {
                          this.props.match.path === '/manage/admin-retrieve-user-orders'
                          ? <h2>Orders for {this.state.username}</h2>
                          : <h2>Orders</h2>
                        }
                    </div>
                    <div className="content-show-table row">
                        <div className="table-background">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {
                                            Cookies.get('userType') === 'customer' || Cookies.get('userType') === "admin"
                                            ? <th>Order ID</th>
                                            : Cookies.get('userType') === 'worker'
                                              ? <th>Uploader</th>
                                              : null
                                        }
                                        {
                                            Cookies.get('userType') === 'customer' || Cookies.get('userType') === "admin"
                                            ? <th>Order Date</th>
                                            : Cookies.get('userType') === 'worker'
                                              ? <th>Date Assigned</th>
                                              : null
                                        }
                                        {
                                            Cookies.get('userType') === 'customer' || Cookies.get('userType') === "admin"
                                            ? <th>Process Status</th>
                                            : Cookies.get('userType') === 'worker'
                                              ? <th className="icon-center">Edit Process Status</th>
                                              : null
                                        }
                                            <th className="icon-center">Other Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.orderList.length !== 0
                                        ?
                                            this.state.orderList.map((item, index) => {
                                                return (
                                                    <tr key={index} id={item.id}>
                                                        {
                                                            Cookies.get('userType') === "customer" || Cookies.get('userType') === "admin"
                                                            ? <td>{item.orderInfoId}</td>
                                                            : Cookies.get('userType') === "worker"
                                                              ? <td>{item.customer}</td>
                                                              : null
                                                        }
                                                        <td>{item.createdAt.substring(0, item.createdAt.indexOf('T'))}</td>
                                                        {
                                                            Cookies.get('userType') === "customer" || Cookies.get('userType') === "admin"
                                                            ? <td>{item.workerName}</td>
                                                            : null
                                                        }
                                                        {
                                                            Cookies.get('userType') === "worker" || Cookies.get('userType') === "customer" || Cookies.get('userType') === "admin"
                                                            ? <td className="icon-center">
                                                                    <i className="fa fa-commenting" id={`worker-order${item.id}`} onClick={this.handleDetail}></i>
                                                              </td>
                                                            : null
                                                        }
                                                    </tr>
                                                );
                                            })
                                        : <tr>
                                            <td>
                                                {
                                                    this.state.isLoading
                                                        ? <img src="../../../static/img/loading80px.gif" alt="" className="loading-icon"/>
                                                        : (Cookies.get('userType') === "worker"
                                                            ? "No orders have been assigned to you yet."
                                                            : "No orders have been placed.")
                                                }
                                            </td>
                                        </tr>
                                    }
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
