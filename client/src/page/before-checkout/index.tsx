import { api } from '@/api';
import AddAddress from '@/component/address/AddAddress';
import MessageLayout from '@/component/layout/MessageLayout';
import ModalBackground from '@/component/modal/ModalBackground';
import Loading from '@/component/ui/Loading';
import { CartContext } from '@/context/CartContext';
import { ROUTES } from '@/router/routes';
import { Address, Customer, DTO, IncludeAddress } from '@/types';
import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import SingleAddress from './singleAddress';

export function BeforeCheckout() {
  const [addressList, setAddressList] = useState<DTO<Address>[]>([]);
  const [selectedAddrIndex, setSelectedAddrIndex] = useState(0);
  const [doneLoading, setDoneLoading] = useState(false);
  const [customer, setCustomer] = useState<DTO<IncludeAddress<Customer>>>({} as Customer);
  const [preparingForCheckout, setPreparingForCheckout] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [cookies] = useCookies(['userId', 'access_token']);

  const cart = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    api.customer.get(cookies.userId).then((customer) => {
      setCustomer(customer);
      setAddressList(customer.addresses);
      setSelectedAddrIndex(0);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setDoneLoading(true);
    });
  }, []);

  function handlePayment() {
    setPreparingForCheckout(true);
    cart.checkout(customer, addressList[selectedAddrIndex]).then((res) => {
      navigate(ROUTES.Login);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setPreparingForCheckout(false);
    });
  }

  return (
    <MessageLayout title="Select Shipping Address" message="">
      {doneLoading ? (
        <div className="w-full py-4 flex flex-col items-end space-y-4">
          <div className="flex flex-row justify-between w-full">
            <button type="button"
              className="bg-green-500 rounded-lg text-white px-4 py-2 text-lg flex space-x-2 items-center"
              onClick={() => setShowAdd(true)}>
              <i className="fa fa-plus" /><p>Add New</p>
            </button>
            {preparingForCheckout ? <Loading /> :
              <div className="flex flex-row space-x-4">
                <button type="button" className="bg-primary_light hover:bg-primary text-white rounded-md px-4 py-2 text-lg"
                  onClick={() => navigate(ROUTES.Login)}>Return to Cart</button>
                <button type="button" className="bg-primary_light hover:bg-primary text-white rounded-md px-4 py-2 text-lg"
                  onClick={handlePayment}>Proceed to Payment</button>
              </div>}
          </div>
          <div className="grid grid-cols-2 w-full gap-4">
            {addressList.map((address, index) => (
              <SingleAddress
                key={index}
                selected={index === selectedAddrIndex}
                address={address}
                addressNum={index + 1}
                onClick={() => setSelectedAddrIndex(index)}
              />
            ))}
          </div>
        </div>
      ) : <Loading />}
      {showAdd &&
        <ModalBackground>
          <div className="flex flex-col bg-white rounded-lg shadow-box w-1/3 divide-y relative">
            <div className="p-4 flex justify-end">
              <i className="fa fa-xmark cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowAdd(false)} />
            </div>
            <div className="px-8">
              <AddAddress userId={cookies.userId} onAdd={(addr) => {
                setShowAdd(false)
                setAddressList([...addressList, addr])
              }} />
            </div>
          </div>
        </ModalBackground>}
    </MessageLayout >
  );
}