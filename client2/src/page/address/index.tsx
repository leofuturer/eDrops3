import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import API from '../../api/api';
import { customerAddresses } from '../../api/serverConfig';
import AddressTemplate from './addressTemplate.js';

import SEO from '../../component/header/SEO.js';
import { metadata } from './metadata.jsx';
import DeleteModal from '../../component/modal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Address() {
  const [addressList, setAddressList] = useState([]);
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

  function handleDeleteAddress(addrIndex) {
    setAddrIndex(addrIndex);
    setShowDelete(true);
  }

  function handleDelete() {
    // console.log(this.state.addressList);
    // console.log(addrIndex);
    const address = addressList[addrIndex];
    const addressId = address.id;
    const url = `customerAddresses.replace('id', cookies.userId)/${addressId}?access_token=${Cookies.get('access_token')}`;

    // Use axios to send request
    /*
        let data = {};
        let classSelector = '.card' + address.id;
        API.Request(url, 'DELETE', data, true)
        .then((res) => {
            //console.log(res);
            $(classSelector).remove();
            console.log('Address deleted');
            console.log(url);
        })
        .catch((err) => {
            console.log(err);
        })
        */

    // Use ajax to send request --- works well
    const xhr = new XMLHttpRequest();
    const classSelector = `.card${address.id}`;
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 204) {
        // console.log('111');
        $(classSelector).remove();
        // console.log(this.responseText);
      }
    };
    xhr.open('DELETE', url, true);
    xhr.send();

    const addresses = addressList.filter((i) => i.id !== addressId);
    setAddressList(addresses);
    // console.log(addresses);
    // Use jquery ajax to send request
    /*
        let address = _this.props.addressTem;
        url += '?access_token=' + Cookies.get('access_token');
        let classSelector = '.card' + address.id;
        $.ajax({
           url: url,
           success: function() {
               $(classSelector).remove();
           }
        });
        */
  }

  useEffect(() => {
    const url = customerAddresses.replace('id', cookies.userId);
    const data = {};
    API.Request(url, 'GET', data, true)
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
          ? <img className="loading-GIF" src="/img/loading80px.gif" alt="" />
          : (
            <div className="grid grid-cols-2 w-full gap-4">
              {addressList.map((oneAddress, index) => (
                <AddressTemplate
                  key={index}
                  address={oneAddress}
                  addressNum={index + 1}
                  onDeletion={() => this.handleDeleteAddress(index)}
                />
              ))}
            </div>
          )}
      </div>
      {showDelete &&
        <DeleteModal
          handleHide={() => setShowDelete(false)}
          handleDelete={handleDelete} />
      }
    </div>
  );
}

export default Address;
