import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { customerAddresses, request } from '../../../api';
import ManageRightLayout from '../../../component/layout/ManageRightLayout';
import DeleteModal from '../../../component/modal/DeleteModal';
import Loading from '../../../component/ui/Loading';
import { Address as AddressType } from '../../../types';
import AddressTemplate from './AddressTemplate';

export function Address() {
  const [addressList, setAddressList] = useState<AddressType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [addrIndex, setAddrIndex] = useState(0);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  function handleAddNewAddress() {
    navigate('/manage/address/new');
  }

  function handleUpdateAddress() {
    navigate('/manage/address/update');
  }

  function handleDeleteAddress(addrIndex: number) {
    setAddrIndex(addrIndex);
    setShowDelete(true);
  }

  function handleDelete() {
    const address = addressList[addrIndex];
    const addressId = address.id;
    const where = {
      id: addressId,
    }
    const url = `${customerAddresses.replace('id', cookies.userId)}?where=${JSON.stringify(where)}`;

    // Use axios to send request
    request(url, 'DELETE', {}, true)
      .then((res) => {
        console.log(res);
        setAddressList(addressList.filter((addr) => addr.id !== addressId));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    request(customerAddresses.replace('id', cookies.userId), 'GET', {}, true)
      .then((res) => {
        // console.log(res.data);
        setAddressList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ManageRightLayout title="Address Book">
      <div className="flex justify-end -mt-8 py-4">
        <button type="button"
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