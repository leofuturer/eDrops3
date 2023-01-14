import React from 'react';
import { NavLink } from 'react-router-dom';
import Loading from '../../component/ui/Loading';
import { ChipOrder, ProductOrder } from '../../types';
import { ewodFabServiceId } from '../../utils/constants';

// The order list page for both customer and worker
function CartItem({ info, deleteLoading, onDelete, onChange }: { info: ProductOrder | ChipOrder, deleteLoading: boolean, onDelete: () => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const chipFabState = "fileInfoId" in info ? {
    fileInfo: {
      id: info.fileInfoId,
      fileName: JSON.parse(info.otherDetails).fileName,
    },
  } : {};

  function parseOtherDetails(otherDetails: string) {
    const details = JSON.parse(otherDetails);
    return <>
      <p>Material: {details?.material}</p>
      <p>With Cover Plate Assembled: {details?.wcpa}</p>
      <p>File Name: {details?.fileInfo.fileName}</p>
    </>
  }

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
        {info.otherDetails &&
          <>
            <div className="">Additional information:</div>
            {parseOtherDetails(info.otherDetails)}
          </>
        }
        <div>
          {deleteLoading ? <Loading /> :
            <button
              type="button"
              className="bg-red-700 px-4 py-2 text-white rounded-lg"
              onClick={() => onDelete()}
            >Delete</button>}
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
