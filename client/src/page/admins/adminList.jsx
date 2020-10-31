import React, { Component } from 'react'

import Admin from './admin.jsx';

export const AdminList = (props) => {
    return props.adminArray.map( (admin) => 
        <Admin/>
    );
}