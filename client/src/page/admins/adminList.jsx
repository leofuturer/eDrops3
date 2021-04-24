import React from 'react';
import Admin from './admin.jsx';

// eslint-disable-next-line arrow-body-style
export const AdminList = (props) => {
  return props.adminArray.map((admin) => <Admin admin={admin} key={admin.id} />);
};
