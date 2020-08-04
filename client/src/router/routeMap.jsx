import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Layout from '../component/layout/index.jsx';
//Pages
import Home from '../page/home/index.jsx';
import Login from '../page/login/index.jsx';
import Register from '../page/register/index.jsx';
import Upload from '../page/fileUpload/index.jsx';
import OrderDetail from 'page/order/orderDetail.jsx';
import Project from '../page/project/index.jsx';
import Manage from '../page/manage/index.jsx';
//import Profile from "page/profile/index.jsx";
import ForgetPass from '../page/forgetPass/index.jsx';
import Shop from '../page/shop/shop.jsx';
import CheckEmail from '../page/checkEmail/index.jsx';
import EmailVerified from '../page/EmailVerified/index.jsx';
import EmailVerifyInvalid from '../page/emailVerifyInvalid/index.jsx';
import ResetPassword from '../page/resetPassword/index.jsx';
import Product from '../page/product/index.jsx';
import AllItems from '../page/allItems/index.jsx';

export class MainRouter extends React.Component {
    render() {
        
        return (
            <Layout>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/home"/>
                    </Route>
                    <Route path="/home" component={Home}/>
                    <Route path="/upload" component={Upload}/>
                    <Route path="/shop" render={({location, history}) => 
                        <Shop location={location} history={history} 
                                shopifyClient={this.props.shopifyClient}/>}/>
                    {/* The project page is currently unused */}
                    <Route path="/project" component={Project}/>
                    <Route path="/manage" component={Manage}/>
                    <Route path="/login"  component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/forgetPass" component={ForgetPass}/>
                    <Route path="/checkEmail" component={CheckEmail}/>
                    <Route path ="/emailVerified" component={EmailVerified}/>
                    <Route path="/emailVerifyInvalid" component={EmailVerifyInvalid}/>
                    <Route path="/resetPassword" component={ResetPassword}/>
                    <Route path="/allItems" render = { () =>
                        <AllItems shopifyClient = {this.props.shopifyClient}/>
                    }/>
                    <Route path="/product" render = { () =>
                        <Product shopifyClient = {this.props.shopifyClient}/>
                    }/>
                </Switch>
            </Layout>
        );
    }
}

export class SubRouter extends React.Component {
    render() {
        return (
            <Layout>
            <Switch>
                <Route path="/subpage/order-detail" component={OrderDetail}/>
            </Switch>
            </Layout>
        );
    }
}
