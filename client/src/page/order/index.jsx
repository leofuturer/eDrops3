import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

import './order.css';
import API from "../../api/api";
import { customerOrderRetrieve, workerOrderRetrieve, 
         downloadFileById, editOrderStatus, 
         findCustomerByWhere, findOneWorkerByWhere } 
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
            userInfo: {}
        }
        this.handleDownload = this.handleDownload.bind(this);
    }

    componentDidMount() {
        var data = {};
        var method = 'GET';
        if (this.props.match.path === '/manage/worker-orders') {
            var url = workerOrderRetrieve.replace('id', Cookies.get('userId'));
        } else if (this.props.match.path === '/manage/customer-orders') {
            var url = customerOrderRetrieve.replace('id', Cookies.get('userId'));
        } else {
            console.log('Wierd things just happened!')
        }

        API.Request(url, method, data, true)
        .then(res => {
            this.setState({
                orderList: res.data
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        // Method One: using fetch()
        var formdata = new URLSearchParams(new FormData(e.target));
        fetch(editOrderStatus, {
            method: 'post',
            body: formdata
        })
        .then(res => {
            $.notify({
                // options
                message: 'The status has been updated!' 
            },{
                // settings
                placement: {
                    from: "bottom",
                    align: "center"
                },
                type: 'success',
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                }
            });
        })
        .catch(err => {
            console.log(err);
        })

        /*     Method Two
        let formData = new URLSearchParams(new FormData(e.target));
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('post', editOrderStatus, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 204)) {
                $.notify({
                    // options
                    message: 'The status has been updated!' 
                },{
                    // settings
                    placement: {
                        from: "bottom",
                        align: "center"
                    },
                    type: 'success',
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    }
                });
            }
        }
        xhr.send(formData);
    */        
    }
    
    handleDownload(e) {
        let downloadId = e.target.id;
        let fileIndex = Number(downloadId.replace(/[^0-9]/ig, ''));
        let realFileName = this.state.orderList[fileIndex].fileName;
        let url = downloadFileById.replace('filename', realFileName);
        window.location = url;
    }

    handleDetail(e) {
        //Using the window.open() method to open a new window 
        //and display the page based on the passed in redirectUrl
        let originalOrderId = e.target.id;
        let orderId = Number(originalOrderId.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/subpage/order-detail";
        let strWindowFeatures = "width=1200px, height=530px";
        let WindowForOrderDetail = window.open(redirectUrl, "_blank", strWindowFeatures);
        WindowForOrderDetail._orderItemId = orderId;
    }

    render() {
        return (
            <div>
                <div className="right-route-content">
                
                    <div className="profile-content">
                        <h2>Orders</h2>
                    </div>
                    <div className="content-show-table row">
                        <div className="table-background">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {
                                            Cookies.get('userType') === 'customer' 
                                            ? <th>Order ID</th> 
                                            : Cookies.get('userType') === 'worker'
                                              ? <th>Uploader</th>
                                              : null
                                        }
                                        {
                                            Cookies.get('userType') === 'customer' 
                                            ? <th>Order Date</th> 
                                            : Cookies.get('userType') === 'worker'
                                              ? <th>Date Assigned</th>
                                              : null
                                        }
                                        {
                                            Cookies.get('userType') === "customer"
                                            ? <th>Worker Assigned</th>
                                            : null
                                        }
                                        {
                                            Cookies.get('userType') === 'customer'
                                            ? <th>Process Status</th>
                                            : Cookies.get('userType') === 'worker'
                                              ? <th className="icon-center">Edit Process Status</th>
                                              : null
                                        }
                                            <th className="icon-center">Mask File</th>
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
                                                            Cookies.get('userType') === "customer"
                                                            ? <td>{item.orderInfoId}</td>
                                                            : Cookies.get('userType') === "worker"
                                                              ? <td>{item.customer}</td>
                                                              : null
                                                        }
                                                        <td>{item.createdAt.substring(0, item.createdAt.indexOf('T'))}</td>
                                                        {
                                                            Cookies.get('userType') === "customer"
                                                            ? <td>{item.workerName}</td>
                                                            : null
                                                        }
                                                        {
                                                            Cookies.get('userType') === "customer"
                                                            ? <td>{item.status}</td>
                                                            : <td className="icon-center">
                                                                    <form className="edit-order-status-form" 
                                                                            onSubmit={this.handleSubmit}>{/*method='post' action={editOrderStatus}*/} 
                                                                        <select className="order-status" name="status" defaultValue={item.status} >
                                                                            <option value="Unassigned to Foundry">Unassigned to Foundry</option>
                                                                            <option value="Assigned to Foundry">Assigned to Foundry</option>
                                                                            <option value="Project Started">Project Started</option>
                                                                            <option value="Project Completed">Project Completed</option>
                                                                        </select>
                                                                        <input type="hidden" name="orderId" value={item.id}></input>
                                                                        <input type="submit" value="Submit"></input>
                                                                    </form>
                                                              </td> 
                                                        }
                                                        <td className="icon-center">
                                                            <i className="fa" onClick={this.handleDownload} id={`download${index}`}>
                                                                {item.fileName}
                                                            </i>
                                                        </td>
                                                        { // For test orderStatusURL
                                                        /*
                                                            Cookies.get('userType') !== "customer"
                                                            ?   null 
                                                            :   item.orderStatusURL !== null
                                                                ? <td className="icon-center">
                                                                    <a href={item.orderStatusURL}>
                                                                    <i className="fa fa-commenting icon-center"></i>
                                                                    </a>   
                                                                  </td>                                                       
                                                                : <td className="icon-center">
                                                                        <i className="fa fa-commenting icon-center"></i>                                                       
                                                                  </td>
                                                        */
                                                        }
                                                        {
                                                            Cookies.get('userType') === "worker" || Cookies.get('userType') === "customer"
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
                                                {Cookies.get('userType') === "worker"
                                                ? "No orders have been assigned to you yet."
                                                : "No orders have been placed."
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