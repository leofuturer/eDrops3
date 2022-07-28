import React from 'react';
import './cart.css';
import { withRouter, NavLink } from 'react-router-dom';
import API from '../../api/api';
import { ewodFabServiceId } from '../../constants';
import loadingGif from '../../../static/img/loading80px.gif';

// The order list page for both customer and worker
class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const start = 'fileName: '.length;
    let chipFabState;
    if (this.props.info.productIdShopify === ewodFabServiceId) {
      chipFabState = {
        fileInfo: {
          id: this.props.info.fileInfoId,
          fileName: this.props.info.otherDetails.split('\n')[2].slice(start),
        },
      };
    }

    return (
      <div className="cart-item-card">
        <div>
          { this.props.info.productIdShopify === ewodFabServiceId
            ? (
              <NavLink to={{ pathname: '/chipfab', state: chipFabState }}>
                <h3>{this.props.info.name}</h3>
              </NavLink>
            )
            : (
              <NavLink to={`/product?id=${this.props.info.productIdShopify}`}>
                <h3>{this.props.info.name}</h3>
              </NavLink>
            )}

        </div>
        <div className="div-cart-product-quantity">
          {'Quantity: '}
          <input
            type="number"
            className="input-quantity"
            value={this.props.info.quantity}
            onChange={(e) => this.props.onChange(e)}
          />
        </div>
        <div className="left-right-wrapper">
          <div className="div-cart-price">
            Unit Price: $
            {this.props.info.price.toFixed(2)}
          </div>
          <div className="div-cart-price">
            Subtotal: $
            {(this.props.info.quantity * this.props.info.price).toFixed(2)}
          </div>
        </div>

        { this.props.info.otherDetails.length !== 0
          ? (
            <div>
              <div className="div-cart-more-info">{'Additional information: '}</div>
              <div
                className="div-cart-more-info-text"
                dangerouslySetInnerHTML={{ __html: this.props.info.otherDetails.replace(/\n/g, '<br/>') }}
              />
            </div>
          )
          : null}
        <div>
          { this.props.deleteLoading
            ? <img src={loadingGif} alt="" />
            : (
              <input
                type="button"
                className="btn btn-danger"
                value="Delete"
                onClick={() => this.props.onDelete()}
              />
            )}
        </div>

      </div>

    );
  }
}

export default CartItem;
