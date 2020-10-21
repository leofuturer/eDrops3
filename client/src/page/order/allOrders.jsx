// Admin only page, for customer page see order/index.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

import { getAllOrderInfos, downloadFileById } from '../../api/serverConfig';
import API from '../../api/api';

class AllOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: []
        };
        this.handleDetail = this.handleDetail.bind(this);
    }

    componentDidMount() {
        let url = getAllOrderInfos;
        let data = {};
        API.Request(url, 'GET', data, true)
        .then((res) => {
            this.setState({
                orderList: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    handleDetail(e) {
        //Using the window.open() method to open a new window 
        //and display the page based on the passed in redirectUrl
        let orderId = e.target.parentNode.parentNode.id;
        let redirectUrl = "/subpage/order-detail";
        let strWindowFeatures = "width=1200px, height=900px";
        let WindowForOrderDetail = window.open(redirectUrl, "_blank", strWindowFeatures);
        WindowForOrderDetail._orderItemId = orderId;
    } 

    render() {
        if(Cookies.get('userType') !== 'admin') {
            return <Redirect to='/login'></Redirect>
        }
        return (
            <div className="right-route-cnotent">
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
                                    <th className="icon-center">Details</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.orderList.length !== 0 
                                ?
                                
                                this.state.orderList.map((item, index) => {
                                    return(
                                        <tr key={index} id={item.id}>
                                            <td>{item.orderComplete ? item.orderInfoId : "Customer cart"}</td>
                                            <td>{item.customerId}</td>
                                            <td>{item.status}</td>
                                            <td className="icon-center">
                                                <i className="fa fa-commenting" onClick={this.handleDetail}></i>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td>No orders have been submitted yet.</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default AllOrders
