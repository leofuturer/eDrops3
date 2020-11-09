import React from 'react';
import API from '../../api/api';
import { getCustomerCart, getProductOrders,
    getChipOrders, modifyProductOrders,
    modifyChipOrders, getAllOrderInfos
} from '../../api/serverConfig';
import Cookies from 'js-cookie';
import OrderItem from './orderItem.jsx';
import OrderAddress from './orderAddress.jsx';

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
        };
    }

    componentDidMount() {
        let _this = this;
        let orderId = window._orderItemId;
        console.log(orderId);
        let url = getAllOrderInfos
        API.Request(url, 'GET', {'id': 1}, true)
        .then(res => {
            this.setState({
                orderDetail: res.data[0],

            });
            this.setState({
                shippingAddress: {
                    type: "Shipping",
                    name: res.data[0].sa_name,
                    street: res.data[0].sa_address1,
                    street2: res.data[0].sa_address2,
                    city: res.data[0].sa_city,
                    state: res.data[0].sa_province,
                    country: res.data[0].sa_country,
                    zipCode:  res.data[0].sa_zip,
                },
                billingAddress: {
                    type: "Billing",
                    name: res.data[0].ba_name,
                    street: res.data[0].ba_address1,
                    street2: res.data[0].ba_address2,
                    city: res.data[0].ba_city,
                    state: res.data[0].ba_province,
                    country: res.data[0].ba_country,
                    zipCode:  res.data[0].ba_zip,
                },
            });
            console.log(this.state);
            let orderInfoId = res.data[0].id;
            url = getProductOrders.replace('id', orderInfoId);
            API.Request(url, 'GET', {}, true)
            .then(res => {
                _this.setState({
                    productOrders: res.data,
                });
                url = getChipOrders.replace('id', orderInfoId);
                console.log(url)
                API.Request(url, 'GET', {}, true)
                .then(res => {
                    _this.setState({
                        chipOrders: res.data,
                        doneLoading: true,
                    });
                    console.log(res.data)
                })
                .catch(err => {
                    console.error(err);
                });
            })
            .catch(err => {
                console.error(err);
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    render() {
        let thisOrder = this.state.orderDetail;
        let totalItemsPrice = 0;
        if(this.state.productOrders !== undefined){
            this.state.productOrders.forEach(product => {
                totalItemsPrice += (product.quantity * product.price);
            });
        }
        if(this.state.chipOrders !== undefined){
            this.state.chipOrders.forEach(product => {
                totalItemsPrice += (product.quantity * product.price);
            });
        }

        return (
            <div className="order-detail-frame">
                { !this.state.doneLoading
                ?  <div className="order-detail-title-container">
                        <h2>Page loading...</h2>
                    </div>
                : <div>
                    <div className="order-detail-title-container">
                    <h2>Edrop Order Details</h2>
                    </div>
                    <div className="order-item-title">
                        Order Number: {thisOrder.orderComplete ? thisOrder.orderInfoId : "N/A, is currently a customer's cart"}
                    </div>
                    <div id="order-addresses">
                    <OrderAddress address={this.state.shippingAddress}/>
                    <OrderAddress address={this.state.billingAddress}/>
                    </div>
                    {
                        this.state.productOrders.map((oneProduct, index) =>
                            <OrderItem key={index} info={oneProduct}/>
                        )
                    }
                    {
                        this.state.chipOrders.map((oneProduct, index) =>
                            <OrderItem key={index} info={oneProduct}/>
                        )
                    }
                    <div className="order-taxes-and-fees-price">
                        {'Subtotal: $'}{parseFloat(totalItemsPrice).toFixed(2)}
                    </div>
                    <div className="order-taxes-and-fees-price">
                        {'Fees and Taxes: $'}{thisOrder.orderComplete ? parseFloat(thisOrder.fees_and_taxes).toFixed(2) : "N/A"}
                    </div>
                    <div className="order-total-price">
                        {'Total: $'}{thisOrder.orderComplete ? (parseFloat(totalItemsPrice) + parseFloat(thisOrder.fees_and_taxes)).toFixed(2) : "N/A"}
                    </div>
                    <div className="order-thank-you">
                        Please contact us at edropwebsite@gmail.com for any questions. Thank you for the order!
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default OrderDetail;
