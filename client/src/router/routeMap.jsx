import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ManageLayout from "component/manage-layout/index.jsx";
import Home from 'page/home/index.jsx';
import Login from 'page/login/index.jsx';
import Register from 'page/register/index.jsx';
import Upload from 'page/fileUpload/index.jsx';
import Order from 'page/order/index.jsx';
import Shop from 'page/shop/shop.jsx';

//This component is of no use right now!!
export class Routers extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path="/" component={Home}/>
                <Route path="/upload" component={Upload}/>
                <Route path="/order" component={Order}/>
                <Route path="/shop" component={Shop}/>
                <Route path="/manage" component={ManageLayout}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Router>
        );
    }
}