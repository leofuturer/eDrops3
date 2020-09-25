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
        this.handleDownload = this.handleDownload.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
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

    handleDownload(e) {
        // console.log(e.target.parentNode.parentNode);
        // let rowToDownload = e.target.parentNode.parentNode;
        // let fileIndex = rowToDownload.id;
        // let realFilename = this.state.orderList[fileIndex].fileName;
        // let url = downloadFileById.replace('filename', realFilename)
        // window.location = url;
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

    handleAssign(e) {
        //The way to send data as well as to redirect to the '/manage/assign' page
        /*
        let originalTagId = e.target.id;
        let orderId = Number(originalTagId.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/manage/assign-orders";
        this.props.history.push(redirectUrl, {
            orderId: orderId
        });
        */
        
        //Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
        let originalOrderId = e.target.id;
        let orderId = Number(originalOrderId.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/manage/assign-orders";
        let strWindowFeatures = "width=1200px, height=500px, left=-80px, top=150px";
        let newWindow = window.open(redirectUrl, "_blank", strWindowFeatures);
        newWindow._theOrderId = orderId;
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
                                    <th>Uploader</th>
                                    <th>Worker</th>
                                    <th>Status</th>
                                    <th className="icon-center">Mask File</th>
                                    <th className="icon-center">Details</th>
                                    <th className="icon-center">Assign Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.orderList.length !== 0 
                                ?
                                
                                this.state.orderList.map((item, index) => {
                                    return(
                                        <tr key={index} id={item.id}>
                                            <td>{item.orderInfoId}</td>
                                            <td>{item.customer}</td>
                                            <td>{item.workerName}</td>
                                            <td>{item.status}</td>
                                            <td className="icon-center"><i className="fa fa-download" onClick={this.handleDownload}></i></td>
                                            <td className="icon-center">
                                                <i className="fa fa-commenting" onClick={this.handleDetail}></i>
                                            </td>
                                            <td className="icon-center">
                                                <i className="fa fa-users" id={`allOrder${item.id}`} onClick={this.handleAssign}></i>
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
        )
    }
    
}

export default AllOrders