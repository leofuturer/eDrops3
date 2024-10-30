import { USState, stateAbbreviation } from '@/lib/address';
import { ROUTES, idRoute } from '@/router/routes';
import { Address, DTO } from '@edroplets/api';
import { CubeIcon } from '@heroicons/react/24/solid';
import { NavLink } from 'react-router-dom';

function AddressTemplate({ address, handleDelete, handleSetDefault}: { address: DTO<Address>, handleDelete: () => void, handleSetDefault: () => void }) {
  return (
    <div className="flex flex-col bg-white rounded-md shadow-lg shadow-primary_light/25 border-primary_light/25 border-[1px]  text-sm ">
      <div className="grid grid-rows-1 items-center py-2 px-4">
        {address.isDefault ? (
            <div className="flex justify-between items-center">
              <p>Default Shipping</p>
              <CubeIcon className="w-5" />
            </div>
        ) : (
          <>
            <div className="flex justify-between items-center h-[1.25rem]">
            </div>
          </>
        )}
      </div>
      <hr className="border-primary_light/25" />
      <div className="grid grid-rows-3 px-4 py-2">
        <div className="">{address.street}{address.streetLine2 ? `, ${address.streetLine2}` : ''}</div>
        <div className="">{address.city}, {stateAbbreviation(address.state as USState)}, {address.zipCode}</div>
        <div className="">{address.country}</div>
      </div>
      <hr className="border-primary_light/25" />
      <div className="flex flex-row space-x-4 px-4 py-2">
        <NavLink to={idRoute(ROUTES.ManageAddressEdit, address.id as number)} className="animated-underline">
          Edit
        </NavLink>
      <p className="cursor-pointer animated-underline" onClick={handleDelete}>
          Remove
        </p>
        {!address.isDefault &&
          <p className="cursor-pointer animated-underline"
            onClick={handleSetDefault}
          >Set as Default</p>
        }
      </div>
    </div >
  );
}

export default AddressTemplate;
