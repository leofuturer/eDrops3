import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import API from '../../api/api';
import { ewodFabServiceId } from '../../constants';

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
      <div className="bg-white rounded-md shadow-box p-4 flex flex-row justify-between">
        <div className="flex flex-col">
          {this.props.info.productIdShopify === ewodFabServiceId
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
          <div className="">
            Unit Price: $
            {this.props.info.price.toFixed(2)}
          </div>
          {this.props.info.otherDetails.length !== 0
            ? (
              <div>
                <div className="">{'Additional information: '}</div>
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: this.props.info.otherDetails.replace(/\n/g, '<br/>') }}
                />
              </div>
            )
            : null}
          <div>
            {this.props.deleteLoading
              ? <img src="/img/loading80px.gif" alt="" />
              : (
                <button
                  type="button"
                  className="bg-red-700 px-4 py-2 text-white rounded-lg"
                  onClick={() => this.props.onDelete()}
                >Delete</button>
              )}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between">
            <label htmlFor="quantity" className="">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="w-12 focus:outline-none"
              value={this.props.info.quantity}
              onChange={(e) => this.props.onChange(e)}
            />
          </div>
          <div className="">
            Subtotal: $
            {(this.props.info.quantity * this.props.info.price).toFixed(2)}
          </div>
        </div>
      </div>

    );
  }
}

export default CartItem;
