import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import Loading from '@/component/ui/Loading';
import { Address as AddressType, DTO } from '@/types';
import AddressTemplate from './AddressTemplate';
import { ROUTES } from '@/router/routes';

export function Address() {
  const [addressList, setAddressList] = useState<DTO<AddressType>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [addrIndex, setAddrIndex] = useState(0);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  function handleAddNewAddress() {
    navigate(ROUTES.ManageAddressNew);
  }

  function handleUpdateAddress() {
    navigate(ROUTES.ManageAddressUpdate);
  }

  function handleDeleteAddress(addrIndex: number) {
    setAddrIndex(addrIndex);
    setShowDelete(true);
  }

  function handleDelete() {
    const address = addressList[addrIndex];
    const addressId = address.id;

    api.customer.deleteAddress(cookies.userId, addressId as number).then((res) => {
      console.log(res);
      setAddressList(addressList.filter((addr) => addr.id !== addressId));
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    api.customer.getAddresses(cookies.userId).then((addresses) => {
      // console.log(res.data);
      setAddressList(addresses);
      setIsLoading(false);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ManageRightLayout title="Address Book">
      <div className="flex justify-end -mt-8 py-4">
        <button data-cy="address-add" type="button"
          className="bg-green-500 rounded-lg text-white px-4 py-2 text-lg flex space-x-2 items-center"
          onClick={handleAddNewAddress}>
          <i className="fa fa-plus" /><p>Add New</p>
        </button>
      </div>
      {isLoading
        ? <Loading />
        : (
          <div className="grid grid-cols-2 w-full gap-4">
            {addressList.map((oneAddress, index) => (
              <AddressTemplate
                key={index}
                address={oneAddress}
                addressNum={index + 1}
                onDeletion={() => handleDeleteAddress(index)}
              />
            ))}
          </div>
        )}
      {showDelete &&
        <DeleteModal
          handleHide={() => setShowDelete(false)}
          handleDelete={handleDelete}
        />
      }
    </ManageRightLayout>
  );
}