import React from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/api';
import { ewodFabServiceId } from '../../constants';

// The order list page for both customer and worker
function CartItem({ info, deleteLoading, onDelete, onChange }: { info: { productIdShopify: string, fileInfoId: string, name: string, price: number, otherDetails: string, quantity: number }, deleteLoading: boolean, onDelete: () => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {

  const start = 'fileName: '.length;
  let chipFabState;
  if (info.productIdShopify === ewodFabServiceId) {
    chipFabState = {
      fileInfo: {
        id: info.fileInfoId,
        fileName: info.otherDetails.split('\n')[2].slice(start),
      },
    };
  }

  return (
    <div className="bg-white rounded-md shadow-box p-4 flex flex-row justify-between">
      <div className="flex flex-col">
        {info.productIdShopify === ewodFabServiceId
          ? (
            <NavLink to="/chipfab" state={chipFabState}>
              <h3>{info.name}</h3>
            </NavLink>
          )
          : (
            <NavLink to={`/product?id=${info.productIdShopify}`}>
              <h3>{info.name}</h3>
            </NavLink>
          )}
        <div className="">
          Unit Price: $
          {info.price.toFixed(2)}
        </div>
        {info.otherDetails.length !== 0
          ? (
            <div>
              <div className="">{'Additional information: '}</div>
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: info.otherDetails.replace(/\n/g, '<br/>') }}
              />
            </div>
          )
          : null}
        <div>
          {deleteLoading
            ? <img src="/img/loading80px.gif" alt="" />
            : (
              <button
                type="button"
                className="bg-red-700 px-4 py-2 text-white rounded-lg"
                onClick={() => onDelete()}
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
            min={1}
            className="w-12 focus:outline-none"
            value={info.quantity}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="">
          Subtotal: $
          {(info.quantity * info.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default CartItem;
