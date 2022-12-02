import React from 'react';
import {
  Route, Routes, redirect, Navigate,
} from 'react-router-dom';

import OrderDetail from '../page/order/orderDetail';
import OrderChat from '../page/order/orderChat';
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

function RouteMap() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="chipfab" element={<ChipOrder />} />
        {/* The project page is currently unused */}
        <Route path="project" element={<Project />} />
        <Route path="manage" element={<Manage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgetPass" element={<ForgetPass />} />
        <Route path="checkEmail" element={<CheckEmail />} />
        <Route path="emailVerified" element={<EmailVerified />} />
        <Route path="emailVerifyInvalid" element={<EmailVerifyInvalid />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route path="beforeCheckout" element={<BeforeCheckout />} />
        <Route path="allItems" element={<AllItems />} />
        <Route path="product" element={<Product />} />
        <Route path="featureComing" element={<FeatureComing />} />
        <Route path="*" element={<PageNotFound />} />
      </Route >
      <Route path="subpage">
        <Route path="order-detail" element={<OrderDetail />} />
        <Route path="order-chat" element={<OrderChat />} />
      </Route>
    </Routes>
  );
}

export default RouteMap;