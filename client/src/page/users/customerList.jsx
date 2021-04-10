import React from 'react';
import Customer from './customer.jsx';

// eslint-disable-next-line arrow-body-style
export const CustomerList = (props) => {
  return props.customerArray.map((customer) => <Customer customer={customer} key={customer.id} />);
};
