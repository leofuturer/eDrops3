import React from 'react';
import AddressTemplate from './addressTemplate.jsx';

export const AddressList = (props) => {
   return props.addressArray.map((oneAddress, index) => 
        <AddressTemplate key={index} addressTem={oneAddress} addressNum={index+1} onDelete = {() => props.onDelete(index)}/>
    );
}
