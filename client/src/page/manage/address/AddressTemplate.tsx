import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Address, DTO } from '@/types';
import { ROUTES } from '@/router/routes';

function AddressTemplate({ address, addressNum, onDeletion }: { address: DTO<Address>, addressNum: number, onDeletion: () => void }) {

  const navigate = useNavigate();

  function handleUpdateAddress() {
    navigate(ROUTES.ManageAddressUpdate, {
      state: {
        addressInfo: address,
        addressId: address.id,
      }
    });
  }

  return (
    <div data-cy="address" className="flex flex-col bg-white rounded-lg p-4 shadow-box space-y-2">
      <div className="flex flex-row justify-between items-center h-10">
        <h3 className="text-xl">Address {addressNum}</h3>
        {address.isDefault && (
          <div className="text-sm">
            <div className="flex justify-between items-center space-x-2">
              <span data-cy="default-address" className="">Default Shipping</span>
              <i className="fa fa-cube fa-inline" />
            </div>
            <div className="flex justify-between items-center space-x-2">
              <span data-cy="default-address" className="">Default Billing</span>
              <i className="fa fa-credit-card fa-inline" />
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
      <div className="flex flex-row space-x-4">
        <button
          data-cy="address-update"
          type="button"
          className="bg-primary_light hover:bg-primary text-white rounded-md px-4 py-1 flex space-x-2 items-center"
          onClick={handleUpdateAddress}
        >
          <i className="fa fa-cog" />
          <p className="">Update</p>
        </button>
        {!address.isDefault &&
          <button data-cy="address-delete" type="button" className="bg-red-700 text-white rounded-md px-4 py-1 flex space-x-2 items-center">
            <i className="fa fa-trash" />
            <p className="" onClick={onDeletion}>Delete</p>
          </button>
        }
      </div>
    </div >
  );
}

export default AddressTemplate;
