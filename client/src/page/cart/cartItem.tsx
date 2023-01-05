import React from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../api/lib/api';
import Loading from '../../component/ui/Loading';
import { ewodFabServiceId } from '../../constants';
import { ChipOrder, ProductOrder } from '../../types';

// The order list page for both customer and worker
function CartItem({ info, deleteLoading, onDelete, onChange }: { info: ProductOrder | ChipOrder, deleteLoading: boolean, onDelete: () => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  console.log(info);
  const chipFabState = "fileInfoId" in info ? {
    fileInfo: {
      id: info.fileInfoId,
      fileName: JSON.parse(info.otherDetails).fileName,
    },
  } : {};

  return (
    <div className="bg-white rounded-md shadow-box p-4 flex flex-row justify-between">
      <div className="flex flex-col">
        {info.productIdShopify === ewodFabServiceId
          ? (
            <NavLink to="/chipfab" state={chipFabState} className="text-primary_light hover:text-primary">
              <h3>{info.name}</h3>
            </NavLink>
          )
          : (
            <NavLink to={`/product?id=${info.productIdShopify}`} className="text-primary_light hover:text-primary">
              <h3>{info.name}</h3>
            </NavLink>
          )}
        <div className="">
          Unit Price: $
          {info.price.toFixed(2)}
        </div>
        {info.otherDetails.length !== 0 &&
          <div>
            <div className="">{'Additional information: '}</div>
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: info.otherDetails.replace(/\n/g, '<br/>') }}
            />
          </div>
        }
        <div>
          {deleteLoading
            ? <Loading />
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
        <div className="flex flex-row items-center justify-end space-x-2">
          <label htmlFor="quantity" className="">Quantity</label>
          <input
            type="number"
            id="quantity"
            min={1}
            className="w-8 outline outline-1 rounded pl-1"
            value={info.quantity}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="">
          Subtotal: ${(info.quantity * info.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default CartItem;
