import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { customerAddresses } from '../../api/serverConfig';
import SEO from '../../component/header/SEO';
import DeleteModal from '../../component/modal/DeleteModal';
import Loading from '../../component/ui/Loading';
import { Address as AddressType } from '../../types';
import AddressTemplate from './addressTemplate';
import { metadata } from './metadata';

function Address() {
  const [addressList, setAddressList] = useState<AddressType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [addrIndex, setAddrIndex] = useState(0);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  function handleAddNewAddress() {
    navigate('/manage/address/newAddress');
  }

  function handleUpdateAddress() {
    navigate('/manage/address/updateAddress');
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
    API.Request(url, 'DELETE', {}, true)
      .then((res) => {
        console.log(res);
        setAddressList(addressList.filter((addr) => addr.id !== addressId));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    API.Request(customerAddresses.replace('id', cookies.userId), 'GET', {}, true)
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
    <div className="flex flex-col items-center justify-center">
      <SEO
        title="eDrops | Addresses"
        description=""
        metadata={metadata}
      />
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        <h2 className="text-2xl">Address Book</h2>
      </div>
      <div className="w-full py-4 flex flex-col items-end space-y-4">
        <button type="button"
          className="bg-green-500 rounded-lg text-white px-4 py-2 text-lg flex space-x-2 items-center"
          onClick={handleAddNewAddress}>
          <i className="fa fa-plus" /><p>Add New</p>
        </button>
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
      </div>
      {showDelete &&
        <DeleteModal
          handleHide={() => setShowDelete(false)}
          handleDelete={handleDelete}
        />
      }
    </div>
  );
}

export default Address;
