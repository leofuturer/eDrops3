import React from 'react';

import API from '../../api/api';

import { getOrderInfoById, foundryWorkerGetProfile } from '../../api/serverConfig';
import Cookies from 'js-cookie';

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetail: {},
            orderAddress: {},
            workerInfo: {}
        }
    }

    componentDidMount() {
        let orderId = window._orderItemId;
        let orderURL = getOrderInfoById.replace('id', orderId);
        let data = {};
        API.Request(orderURL, 'GET', data, true)
        .then(res => {
            this.setState({
                orderDetail: res.data,
                orderAddress: res.data.orderAddress
            });
            return res.data.workerId;
        })
        .then(workerId => {
            if(Cookies.get("userType") === "customer"){
                let workerURL = foundryWorkerGetProfile.replace('id', workerId)
                API.Request(workerURL, 'GET', data, true)
                .then(workerRes => {
                    this.setState({
                        workerInfo: workerRes.data
                    });
                })
                .catch(workerErr => {
                    console.log(workerErr);
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        let thisOrder = this.state.orderDetail;
        let address = this.state.orderAddress;
        let worker = this.state.workerInfo;
        return (
                <div className="order-detail-frame">
                    <div className="order-detail-title-container">
                        <h2>Order Details</h2>
                    </div>
                    <div className="order-detail-grid-container">
                        <div className="order-detail-grid-item order-number">
                            <div className="order-item-title">Order Number: </div>
                            <div>{thisOrder.orderInfoId}</div>
                        </div>
                        <div className="order-detail-grid-item sample-amount">
                            <div className="order-item-title">Sample Amount: </div>
                            <div>{thisOrder.sampleQuantity}</div>
                        </div>
                        <div className="order-detail-grid-item customized-option">
                            <div className="order-item-title">Customized Options</div>
                            <div className="order-item-content">
                                <div>{`Substrate: ${thisOrder.process}`}</div>
                                <div>{`With cover plate: ${thisOrder.coverPlate ? "Yes" : "No"}`}</div>
                                <div>Comment: This feature is coming soon!</div>
                            </div>
                        </div>
                        {
                            Cookies.get('userType') === 'worker' || Cookies.get('userType') === 'admin'
                            ? (
                            <div className="order-detail-grid-item shipping-info">
                                <div className="order-item-title">Shipping Information</div>
                                <div className="order-item-content">
                                    <div className="content-item">
                                        <span className="content-item-key">Name: </span><span>{address.first_name + ' ' + address.last_name }</span>
                                    </div>
                                    <div>
                                        <span>Email: </span><span>{thisOrder.email }</span>
                                    </div>
                                    <div>
                                        <span>Address: </span><span>{`${address.address1}, ${address.address2}, ${address.city}, 
                                        ${address.province}, ${address.zip}`}</span> 
                                    </div>
                                </div>
                            </div>
                            )
                            : (
                            <div className="order-detail-grid-item shipping-info">
                                <div className="order-item-title">Foundry Information</div>
                                {
                                    thisOrder.status === "Uploaded" 
                                    ?   <div className="unassigned-info">This order has not been assigned to any foundry yet</div>
                                    :   (                  
                                        <div className="order-item-content">
                                            <div>
                                                <span>Affiliation: </span><span>{worker.affiliation}</span>
                                            </div>
                                            <div className="content-item">
                                                <span className="content-item-key">Worker: </span><span>{worker.firstName + ' ' + worker.lastName }</span>
                                            </div>
                                            <div>
                                                <span>Email: </span><span>{worker.email }</span>
                                            </div>
                                            <div>
                                                <span>Status: </span><span>{thisOrder.status}</span> 
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            )
                        }
                    </div>
                </div>
        );
    }
}

export default OrderDetail;