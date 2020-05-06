import React from 'react';
import Customer from './customer.jsx';

export const CustomerList = (props) => {
    return props.customerArray.map( (customer, index) => 
        <Customer customer={customer} key={index}/>
    );
}