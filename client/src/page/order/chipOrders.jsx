import React from 'react';
import { withRouter } from 'react-router-dom';
import './order.css';
import API from "../../api/api";
import { adminGetChipOrders, customerGetChipOrders, 
        workerGetChipOrders, editOrderStatus, 
        downloadFileById, adminDownloadFile, workerDownloadFile } 
         from '../../api/serverConfig';
import Cookies from "js-cookie";

// List all chip orders for all user types
class ChipOrders extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
        }
        this.handleDownload = this.handleDownload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
    }

    componentDidMount() {
        let url = "";
        if(Cookies.get('userType') === 'customer'){
            url = customerGetChipOrders.replace('id', Cookies.get('userId'));
        } else if(Cookies.get('userType') === 'worker'){
            url = workerGetChipOrders.replace('id', Cookies.get('userId'));
        } else if(Cookies.get('userType') === 'admin') {
            url = adminGetChipOrders;
        }

        API.Request(url, 'GET', {}, true)
        .then(res => {
            this.setState({
                orderList: res.data.orderChips,
            });
        })
        .catch(err => {
            console.error(err);
        });
    }
 
    handleDownload(e) {
        console.log(e.target.id);
        let url = "";
        let fileId = Number(e.target.id.replace(/[^0-9]/ig, ''));
        console.log(Cookies.get('userType'))
        if(Cookies.get('userType') === 'customer'){
            url = downloadFileById.replace('id', Cookies.get('userId'));  
        } else if(Cookies.get('userType') === 'worker'){
            url = workerDownloadFile.replace('id', Cookies.get('userId'));
        } else if(Cookies.get('userType') === 'admin') {
            url = adminDownloadFile;
        }
        
        url += `?access_token=${Cookies.get('access_token')}&fileId=${fileId}`;
        window.location = url;
    }

    handleAssign(e) {
        //Using the window.open() method to open a new window and display the page based on the passed in redirectUrl
        let orderIndex = Number(e.target.id.replace(/[^0-9]/ig, ''));
        let redirectUrl = "/manage/assign-orders";
        let strWindowFeatures = "width=1200px, height=900px";
        let newWindow = window.open(redirectUrl, "_blank", strWindowFeatures);
        newWindow._order = this.state.orderList[orderIndex];
    }

    handleSubmit(e) {
        e.preventDefault();
        let dropdown = document.getElementById("status-selection");
        let selectedStatus = dropdown.options[dropdown.selectedIndex].value;
        let chipOrderId = Number(e.target.id.replace(/[^0-9]/ig, ''))
        let url = editOrderStatus.replace('id', this.state.orderList[chipOrderId].id);
        let data = {status: selectedStatus};
        API.Request(url, 'PATCH', data, true)
        .then(res => {
            alert("Status updated!");
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
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
                                            ? <th>Worker Assigned</th> //customer or admin
                                            : null
                                        }
                                        {
                                            Cookies.get('userType') === 'customer'
                                            ? <th>Process Status</th> //customer
                                            : <th className="icon-center">Edit Status</th> // worker or admin
                                        }
                                        <th className="icon-center">Quantity</th>
                                        <th className="icon-center">Mask File</th>
                                        {
                                            Cookies.get('userType') === 'admin'
                                            ? <th className="icon-center">Assign Order</th> // admin
                                            : null
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.orderList.length !== 0
                                        ?  
                                            this.state.orderList.map((item, index) => {
                                                return (                                                
                                                    <tr key={index} id={item.id}>
                                                        <td>{item.id}</td>
                                                        {
                                                            !(Cookies.get('userType') === 'customer')
                                                            ? <td>{item.customerName}</td>
                                                            : null
                                                        }
                                                        <td>{item.lastUpdated.substring(0, item.lastUpdated.indexOf('T'))}</td>
                                                        {
                                                            !(Cookies.get('userType') === 'worker')
                                                            ? <td>{item.workerName}</td>
                                                            : null
                                                        }
                                                        {
                                                            Cookies.get('userType') === "customer"
                                                            ? <td>{item.status}</td>
                                                            : <td className="icon-center">
                                                                    <form id="edit-order-status-form" className="edit-order-status-form" 
                                                                            onSubmit={this.handleSubmit}>
                                                                        <select id="status-selection" className="order-status" name="status" defaultValue={item.status}>
                                                                            <option value="Project Started">Project Started</option>
                                                                            <option value="Project Completed">Project Completed</option>
                                                                        </select>
                                                                        <input type="submit" id={`allOrder${index}`}></input>
                                                                    </form>
                                                              </td> 
                                                        }
                                                        <td className="icon-center">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="icon-center">
                                                            <i className="fa fa-download" onClick={this.handleDownload} id={`download${item.fileInfoId}`}/>
                                                        </td>
                                                        {
                                                            Cookies.get('userType') === "admin" 
                                                            ? <td className="icon-center">
                                                                <i className="fa fa-users" id={`allOrder${index}`} onClick={this.handleAssign}/>
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
                                                : "No chip orders have been placed yet."
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

ChipOrders = withRouter(ChipOrders)
export default ChipOrders;