import React from 'react';
import './lineitem.css';

function LineItem({ line_item, updateQuantityInCart, removeLineItemInCart }: { line_item: ShopifyBuy.LineItem, updateQuantityInCart: any, removeLineItemInCart: any }) {

  function decrementQuantity(lineItemId: typeof line_item.id) {
    const updatedQuantity = line_item.quantity - 1;
    updateQuantityInCart(lineItemId, updatedQuantity);
  }

  function incrementQuantity(lineItemId: typeof line_item.id) {
    const updatedQuantity = line_item.quantity + 1;
    updateQuantityInCart(lineItemId, updatedQuantity);
  }

  return (
    <div className="Line-item clearfix">
      <div className="Line-item__img-div">
        {line_item.variant.image ? <img className="Line-item__img" src={line_item.variant.image.src} alt={`${line_item.title} product shot`} /> : null}
      </div>
      <div className="Line-item__content">
        <div className="Line-item__content-row">
          <div className="Line-item__title">
            {line_item.title}
          </div>
        </div>

        <div className="Line-item__content-row">
          <div className="Line-item__options">
            {line_item.customAttributes.map((attr, index) => (
              <div className="Line-item__option-row" key={index}>
                {`${attr.key}: ${attr.value}`}
              </div>
            ))}
          </div>
        </div>

        <div className="Line-item__content-row Line-item__content-row-last">
          <div className="Line-item__quantity-container">
            <button className="Line-item__quantity-update" onClick={() => decrementQuantity(line_item.id)}>-</button>
            <span className="Line-item__quantity">{line_item.quantity}</span>
            <button className="Line-item__quantity-update" onClick={() => incrementQuantity(line_item.id)}>+</button>
          </div>
          <button className="Line-item__remove" onClick={() => removeLineItemInCart(line_item.id)}>
            ×
          </button>
          <span className="Line-item__price">
            $
            {(line_item.quantity * 1000).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LineItem;
