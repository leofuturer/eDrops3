// The order list page for both customer and worker
function OrderItem({ info }: { info: any }) {
  return (
    <div className="order-item-card">
      <div className="order-item-title">
        <h3>{info.name}</h3>
      </div>
      <div className="div-cart-product-quantity">Quantity: {info.quantity}</div>
      <div className="left-right-wrapper">
        <div className="div-cart-price">
          Unit Price: ${info.price.toFixed(2)}
        </div>
        <div className="div-cart-price">
          Subtotal: ${(info.quantity * info.price).toFixed(2)}
        </div>
      </div>
      {info.orderDetails && info.otherDetails.length !== 0 && (
        <div>
          <div className="div-cart-more-info">{'Additional information: '}</div>
          <div
            className="div-cart-more-info-text"
            dangerouslySetInnerHTML={{
              __html: info.otherDetails.replace(/\n/g, '<br/>'),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default OrderItem;
