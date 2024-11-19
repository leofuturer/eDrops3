import React from 'react';
import { Address, DTO } from '@edroplets/api';
import { CreditCardIcon, CubeIcon } from '@heroicons/react/24/outline';

function SingleAddress({ address, addressNum, selected, onClick }: { address: DTO<Address>, addressNum: number, selected: boolean, onClick: () => void }) {
  return (
    <div className={`flex flex-col bg-white rounded-lg p-4 shadow-box space-y-2 ${selected ? 'outline outline-primary-light' : ''}`} onClick={onClick}>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl">Address {addressNum}</h3>
        {address.isDefault && (
          <div className="text-sm">
            <div className="flex justify-between items-center space-x-2">
              <span className="">Default Shipping</span>
              <CubeIcon className="w-5" />
            </div>
            <div className="flex justify-between items-center space-x-2">
              <span className="">Default Billing</span>
              <CreditCardIcon className="w-5" />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col text-sm">
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

export default SingleAddress;
