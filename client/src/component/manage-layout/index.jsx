import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from 'react-router-dom'

import NavLeft from 'component/nav-left/index.jsx';

class ManageLayout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <div className="left-nav">
                    <NavLeft/>
                </div>
                <div className="right-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default ManageLayout;