import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { customerGetProfile, customerAddresses, modifyChipOrders } from '../../api/serverConfig';
import API from '../../api/api';
import SingleAddress from './singleAddress.js';
import AddNewAddress from '../address/addNewAddress.js';
import { ShopifyContext } from '../../App';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import MessageLayout from '../../component/layout/MessageLayout';
import ModalBackground from '../../component/modal/ModalBackground';
import { Address } from '../../types';

function BeforeCheckout() {
  const [shopifyCheckoutLink, setShopifyCheckoutLink] = useState(undefined);
  const [cartId, setCartId] = useState(undefined);
  const [shopifyCheckoutId, setShopifyCheckoutId] = useState(undefined);
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [selectedAddrIndex, setSelectedAddrIndex] = useState(0);
  const [doneLoading, setDoneLoading] = useState(false);
  const [customer, setCustomer] = useState(undefined);
  const [preparingForCheckout, setPreparingForCheckout] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [cookies] = useCookies(['userId', 'access_token']);

  const shopify = useContext(ShopifyContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!cookies.access_token) {
      navigate('/login');
    } else if (!location.state.shopifyCheckoutLink || !location.state.cartId) {
      // console.log("check..");
      navigate('/manage/cart');
    } else {
      setShopifyCheckoutLink(location.state.shopifyCheckoutLink);
      setCartId(location.state.cartId);
      setShopifyCheckoutId(location.state.shopifyCheckoutId);
      API.Request(customerGetProfile.replace('id', cookies.userId), 'GET', {}, true)
        .then((res) => {
          // console.log(res.data);
          setCustomer(res.data);
          return API.Request(customerAddresses.replace('id', cookies.userId), 'GET', {}, true)
        })
        .then((res) => {
          // console.log(res.data);
          setAddressList(res.data);
          setSelectedAddrIndex(0);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setDoneLoading(true);
        });
    }
  }, []);

  function handleSelectAddress(index) {
    setSelectedAddrIndex(index);
  }

  function handleReturnToCart() {
    navigate('/manage/cart');
  }

  function handlePayment() {
    setPreparingForCheckout(true);
    if (shopify) {
      shopify.checkout.updateEmail(shopifyCheckoutId, customer.email)
        .then((res) => {
          const address = addressList[selectedAddrIndex];
          const shippingAddr = {
            address1: address.street,
            address2: address.streetLine2,
            city: address.city,
            province: address.state,
            country: address.country,
            zip: address.zipCode,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phoneNumber,
          };
          return shopify.checkout.updateShippingAddress(shopifyCheckoutId, shippingAddr)
        }).then((res) => {
          // console.log(res);
          window.open(`${shopifyCheckoutLink}`, '_blank');
          navigate(`/`);
        })
        .catch((err) => {
          console.error(err);
        }).finally(() => {
          setPreparingForCheckout(false);
        });
    }
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
            {preparingForCheckout
              ? <img className="loading-GIF-checkout-button" src="/img/loading-sm.gif" alt="" />
              : (
                <div className="flex flex-row space-x-4">
                  <button
                    type="button"
                    className="bg-primary_light hover:bg-primary text-white rounded-md px-4 py-2 text-lg"
                    onClick={() => handleReturnToCart()}
                  >
                    Return to Cart
                  </button>
                  <button
                    type="button"
                    className="bg-primary_light hover:bg-primary text-white rounded-md px-4 py-2 text-lg"
                    onClick={() => handlePayment()}
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
          </div>
          <div className="grid grid-cols-2 w-full gap-4">
            {addressList.map((oneAddress, index) => (
              <SingleAddress
                key={index}
                selected={index === selectedAddrIndex}
                address={oneAddress}
                addressNum={index + 1}
                onClick={() => handleSelectAddress(index)}
              />
            ))}
          </div>
        </div>
      )
        : <img className="loading-GIF" src="/img/loading80px.gif" alt="" />
      }
      {showAdd &&
        <ModalBackground>
          <div className="flex flex-col bg-white rounded-lg shadow-box w-1/3 divide-y relative">
            <div className="p-4 flex justify-end">
              <i className="fa fa-xmark cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowAdd(false)} />
            </div>
            <div className="px-8">
              <AddNewAddress addOnClick={(addr) => {
                setShowAdd(false)
                setAddressList([...addressList, addr])
              }} />
            </div>
          </div>
        </ModalBackground>
      }
    </MessageLayout >
  );
}

export default BeforeCheckout;
