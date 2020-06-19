import React from 'react';
import AddressTemplate from './addressTemplate.jsx';


// This component is currently unused, index.jsx directly uses map() to create multiple AddressTemplates
export const AddressList = (props) => {
   return props.addressArray.map((oneAddress, index) => 
        <AddressTemplate key={index} addressTem={oneAddress} 
            addressNum={index+1} onDelete = {() => props.onDelete(index)}/>
    );
}
