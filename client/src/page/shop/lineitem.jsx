import React, { Component } from 'react';
import './lineitem.css';

class LineItem extends Component {
  constructor(props) {
    super(props);

    this.decrementQuantity = this.decrementQuantity.bind(this);
    this.incrementQuantity = this.incrementQuantity.bind(this);
  }

  decrementQuantity(lineItemId) {
    const updatedQuantity = this.props.line_item.quantity - 1;
    this.props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  incrementQuantity(lineItemId) {
    const updatedQuantity = this.props.line_item.quantity + 1;
    this.props.updateQuantityInCart(lineItemId, updatedQuantity);
  }

  render() {
    return (
      <div className="Line-item clearfix">
        <div className="Line-item__img-div">
          {this.props.line_item.variant.image ? <img className="Line-item__img" src={this.props.line_item.variant.image.src} alt={`${this.props.line_item.title} product shot`} /> : null}
        </div>
        <div className="Line-item__content">
          <div className="Line-item__content-row">
            <div className="Line-item__title">
              {this.props.line_item.title}
            </div>
          </div>

          <div className="Line-item__content-row">
            <div className="Line-item__options">
              {this.props.line_item.customAttributes.map((attr, index) => (
                <div className="Line-item__option-row" key={index}>
                  {`${attr.key}: ${attr.value}`}
                </div>
              ))}
            </div>
          </div>

          <div className="Line-item__content-row Line-item__content-row-last">
            <div className="Line-item__quantity-container">
              <button className="Line-item__quantity-update" onClick={() => this.decrementQuantity(this.props.line_item.id)}>-</button>
              <span className="Line-item__quantity">{this.props.line_item.quantity}</span>
              <button className="Line-item__quantity-update" onClick={() => this.incrementQuantity(this.props.line_item.id)}>+</button>
            </div>
            <button className="Line-item__remove" onClick={() => this.props.removeLineItemInCart(this.props.line_item.id)}>
              ×
            </button>
            <span className="Line-item__price">
              $
              {(this.props.line_item.quantity * 1000).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default LineItem;
