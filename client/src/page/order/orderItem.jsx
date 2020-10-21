import React from 'react';
import API from "../../api/api";
import { withRouter, NavLink } from 'react-router-dom';
import { ewodFabServiceId } from '../../constants';
import './order.css'

//The order list page for both customer and worker
class OrderItem extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="order-item-card">
                <div className="order-item-title"><h3>{this.props.info.name}</h3></div>
                <div className="div-cart-product-quantity">
                    {'Quantity: '}{this.props.info.quantity}
                </div>
                <div className="left-right-wrapper">
                    <div className="div-cart-price" >
                        Unit Price: ${this.props.info.price.toFixed(2)}
                    </div>
                    <div className="div-cart-price">
                        Subtotal: ${(this.props.info.quantity * this.props.info.price).toFixed(2)}
                    </div>
                </div>
                { this.props.info.otherDetails.length !== 0
                ? <div>
                    <div className="div-cart-more-info">{'Additional information: '}</div>
                    <div className="div-cart-more-info-text"
                        dangerouslySetInnerHTML={{__html: this.props.info.otherDetails.replace(/\n/g, "<br/>")}}></div>
                </div>
                : null 
                } 
                { this.props.adminAssignOrderDisplay
                ? <div>
                    <div>
                        Customer name: {this.props.info.customerName}
                    </div>
                    <div>
                        Chip Order ID: {this.props.info.id}
                    </div>
                    <div>
                        Order ID: {this.props.info.orderId}
                    </div>
                    <div>
                        Customer ID: {this.props.info.customerId}
                    </div>
                    <div>
                        File ID: {this.props.info.fileInfoId}
                    </div>
                    <div>
                        Status: {this.props.info.status}
                    </div>
                </div>
                
                : null

                } 
            </div>  
        );
    }
}

export default OrderItem;