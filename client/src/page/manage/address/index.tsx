import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { api, Address as AddressType, DTO  } from '@edroplets/api';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import DeleteModal from '@/component/modal/DeleteModal';
import Loading from '@/component/ui/Loading';
import AddressTemplate from './AddressTemplate';
import { ROUTES } from '@/router/routes';

export function Address() {
  const [addressList, setAddressList] = useState<DTO<AddressType>[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<DTO<AddressType>>({} as DTO<AddressType>);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteAddress, setDeleteAddress] = useState<DTO<AddressType>>({} as DTO<AddressType>);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  function handleAddAddress() {
    navigate(ROUTES.ManageAddressAdd);
  }

  function handleDeleteAddress(address: DTO<AddressType>) {
    setDeleteAddress(address);
    setShowDelete(true);
  }

  function handleSetDefault(address: DTO<AddressType>) {
    const addressId = address.id;

    api.customer.setDefaultAddress(cookies.userId, addressId as number).then((res) => {
      // console.log(res);
      setAddressList(addressList.map((addr) => {
        if (addr.id === addressId) {
          return { ...addr, isDefault: true };
        } else {
          return { ...addr, isDefault: false };
        }
      }));
    })
  }

  useEffect(() => {
    const defaultAddr = addressList.find((addr) => addr.isDefault);
    if (defaultAddr) {
      setDefaultAddress(defaultAddr);
    }
  }, [addressList])

  function handleDelete() {
    const addressId = deleteAddress.id;

    api.customer.deleteAddress(cookies.userId, addressId as number).then((res) => {
      // console.log(res);
      if(deleteAddress.isDefault) {
        setDefaultAddress({} as DTO<AddressType>);
      }
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
            {Object.keys(defaultAddress).length > 0 &&
              <AddressTemplate
                address={defaultAddress}
                handleDelete={() => handleDeleteAddress(defaultAddress)}
                handleSetDefault={() => handleDeleteAddress(defaultAddress)}
              />
            }
            {addressList.map((addr, index) =>
              (defaultAddress.id ? addr.id !== defaultAddress.id : true) && (
                <AddressTemplate
                  key={index}
                  address={addr}
                  handleDelete={() => handleDeleteAddress(addr)}
                  handleSetDefault={() => handleSetDefault(addr)}
                />
              ))}
            <div className="flex flex-col space-y-2 py-10 justify-center items-center rounded-md shadow-lg shadow-primary-light/25 border-primary-light/25 border-[1px] border-dashed text-sm cursor-pointer"
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