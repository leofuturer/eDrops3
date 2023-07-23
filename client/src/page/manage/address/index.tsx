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

  function handleAddAddress() {
    navigate(ROUTES.ManageAddressAdd);
  }

  function handleDeleteAddress(addrIndex: number) {
    setAddrIndex(addrIndex);
    setShowDelete(true);
  }

  function handleSetDefault(addrIndex: number) {
    const address = addressList[addrIndex];
    const addressId = address.id;


  }

  function handleDelete() {
    const address = addressList[addrIndex];
    const addressId = address.id;

    api.customer.deleteAddress(cookies.userId, addressId as number).then((res) => {
      // console.log(res);
      setAddressList(addressList.filter((addr) => addr.id !== addressId));
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    api.customer.getAddresses(cookies.userId).then((addresses) => {
      // console.log(res.data);
      setAddressList(addresses);
      setIsLoading(false);
    })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <ManageRightLayout title="Address Book">
      {isLoading
        ? <Loading />
        : (
          <div className="grid grid-cols-2 auto-rows-fr min-h-min w-full gap-4">
            {addressList.map((oneAddress, index) => (
              <AddressTemplate
                key={index}
                address={oneAddress}
                handleDelete={() => handleDeleteAddress(index)}
                handleSetDefault={() => handleSetDefault(index)}
              />
            ))}
            <div className="flex flex-col space-y-2 py-10 justify-center items-center rounded-md shadow-lg shadow-primary_light/25 border-primary_light/25 border-[1px] border-dashed text-sm cursor-pointer"
              onClick={handleAddAddress}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <p className="text-lg">Add Address</p>
            </div>
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