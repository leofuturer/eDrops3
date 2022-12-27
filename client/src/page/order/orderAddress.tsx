import React from 'react';
import { DisplayAddress } from '../../types';

function OrderAddress({ address }: { address: DisplayAddress }) {
  return (
    <div className="shadow-box-sm p-4">
      <div className="flex">
        <h4>{address.type} Address</h4>
      </div>
      <div className="flex flex-col">
        <div className="">{address.name}</div>
        <div className="">{address.street}</div>
        <div className="">{address.streetLine2}</div>
        <div className="">{address.city}</div>
        <div className="">{address.state}</div>
        <div className="">{address.country}</div>
        <div className="">{address.zipCode}</div>
      </div>
    </div >
  );
}

export default OrderAddress;
