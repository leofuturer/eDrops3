import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';

import OrderDetail from 'page/order/orderDetail';
import Layout from '../component/layout/index';
// Pages
import Home from '../page/home/index';
import Login from '../page/login/index';
import Register from '../page/register/index';
import Upload from '../page/fileUpload/index';
import Project from '../page/project/index';
import Manage from './manage/index';
// import Profile from "page/profile/index";
import ForgetPass from '../page/forgetPass/index';
import ChipOrder from '../page/product/chiporder';
import CheckEmail from '../page/checkEmail/index';
import EmailVerified from '../page/emailVerified/index';
import EmailVerifyInvalid from '../page/emailVerifyInvalid/index';
import ResetPassword from '../page/resetPassword/index';
import Product from '../page/product/index';
import AllItems from '../page/allItems/index';
import PageNotFound from '../page/pageNotFound/pageNotFound';
import BeforeCheckout from '../page/beforeCheckout/index';

import FeatureComing from '../page/featureComing/index';

export class MainRouter extends React.Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/upload" component={Upload} />
          <Route path="/chipfab" component={ChipOrder} />
          {/* The project page is currently unused */}
          <Route path="/project" component={Project} />
          <Route path="/manage" component={Manage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgetPass" component={ForgetPass} />
          <Route path="/checkEmail" component={CheckEmail} />
          <Route path="/emailVerified" component={EmailVerified} />
          <Route path="/emailVerifyInvalid" component={EmailVerifyInvalid} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/beforeCheckout" component={BeforeCheckout} />
          <Route path="/allItems" component={AllItems} />
          <Route path="/product" component={Product} />
          <Route path="/featureComing" component={FeatureComing} />
          <Route component={PageNotFound} />
        </Switch>
      </Layout>
    );
  }
}

export class SubRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/subpage/order-detail" component={OrderDetail} />
      </Switch>
    );
  }
}
