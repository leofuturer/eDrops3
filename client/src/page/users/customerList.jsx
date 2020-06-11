import React from 'react';
import Customer from './customer.jsx';

export const CustomerList = (props) => {
    return props.customerArray.map( (customer) => 
        <Customer customer={customer} key={customer.id}/>
    );
}