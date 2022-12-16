import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '../../types';

function AddressTemplate({ address, addressNum, onDeletion }: { address: Address, addressNum: number, onDeletion: () => void }) {

  const navigate = useNavigate();

  function handleUpdateAddress() {
    navigate('/manage/address/updateaddress', {
      state: {
        addressInfo: address,
        addressId: address.id,
      }
    });
  }
  
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 shadow-box space-y-2">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl">Address {addressNum}</h3>
        {address.isDefault && (
          <div className="text-sm">
            <div className="flex justify-between items-center space-x-2">
              <span className="">Default Shipping</span>
              <i className="fa fa-cube fa-inline" />
            </div>
            <div className="flex justify-between items-center space-x-2">
              <span className="">Default Billing</span>
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
      <div className="flex flex-row">
        <button type="button" className="bg-primary_light hover:bg-primary text-white rounded-md px-4 py-1">
          <i className="fa fa-cog" />
          <span className="btn-txt-padding" onClick={handleUpdateAddress}>Update</span>
        </button>
        {address.isDefault
          ? null
          : (
            <button className="btn btn-danger btn-padding">
              <i className="fa fa-trash-o" />
              <span className="btn-txt-padding" onClick={onDeletion}>Delete</span>
              {/* <span className="btn-txt-padding" onClick={props.onDelete}>Delete</span> */}
            </button>
          )}
      </div>
    </div>
  );
}

export default AddressTemplate;
