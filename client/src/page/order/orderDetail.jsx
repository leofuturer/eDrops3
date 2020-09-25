import React from 'react';
import API from '../../api/api';
import { getOrderInfoById, getCustomerCart, getProductOrders, 
    getChipOrders, modifyProductOrders, 
    modifyChipOrders 
} from '../../api/serverConfig';
import Cookies from 'js-cookie';
import OrderItem from './orderItem.jsx';

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetail: {
                id: window._orderItemId,
                fees_and_taxes: 0.00,
            },
            productOrders: [],
            chipOrders: [],
        };
    }

    componentDidMount() {
        let _this = this;
        let orderId = window._orderItemId;
        console.log(orderId);
        let url = getOrderInfoById.replace('id', orderId);
        API.Request(url, 'GET', {}, true)
        .then(res => {
            this.setState({
                orderDetail: res.data,
            });
            let orderInfoId = res.data.id;
            url = getProductOrders.replace('id', orderInfoId);
            API.Request(url, 'GET', {}, true)
            .then(res => {
                _this.setState({
                    productOrders: res.data,
                });
                url = getChipOrders.replace('id', orderInfoId);
                API.Request(url, 'GET', {}, true)
                .then(res => {
                    _this.setState({
                        chipOrders: res.data,
                    });
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
        this.state.productOrders.forEach(product => {
            totalItemsPrice += (product.quantity * product.price);
        });
        this.state.chipOrders.forEach(product => {
            totalItemsPrice += (product.quantity * product.price);
        });
        return (
            <div className="order-detail-frame">
                <div className="order-detail-title-container">
                    <h2>Edrop Order Details</h2>
                </div>
                <div className="order-item-title">
                    Order Number: {thisOrder.orderInfoId}
                </div>
                {/* TODO: add name, shipping and billing address */}
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
                    {'Fees and Taxes: $'}{thisOrder.fees_and_taxes.toFixed(2)}
                </div>
                <div className="order-total-price">
                    {'Total: $'}{(totalItemsPrice + thisOrder.fees_and_taxes).toFixed(2)}
                </div>
                <div className="order-thank-you">
                    Please contact us at edropwebsite@gmail.com for any questions. Thank you for the order!
                </div>
            </div>
        );
    }
}

export default OrderDetail;