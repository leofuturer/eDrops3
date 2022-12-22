import React, { useEffect, useState } from 'react';
import {
  Route, Routes, redirect, Navigate,
} from 'react-router-dom';

import OrderDetail from '../page/order/orderDetail';
import OrderChat from '../page/order/orderChat';
import Layout from '../component/layout/Layout';
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
import FoundryWorker from '../page/foundryWorker';
import AddOrEditWorker from '../page/foundryWorker/addOrEditWorker';
import { useCookies } from 'react-cookie';
import Users from '../page/users';
import AddOrEditUser from '../page/users/addOrEditUser';
import Admins from '../page/admins';
import AddOrEditAdmin from '../page/admins/addOrEditAdmin';
import AllFiles from '../page/files/allFiles';
import Files from '../page/files';
import ChipOrders from '../page/order/chipOrders';
import AllOrders from '../page/order/allOrders';
import Orders from '../page/order';
import AssignOrders from '../page/order/assignOrders';
import Address from '../page/address';
import Profile from '../page/profile';
import ChangePassword from '../page/changePass';
import AddNewAddress from '../page/address/addNewAddress';
import UpdateAddress from '../page/address/updateAddress';
import Cart from '../page/cart';
import { ShopifyContext } from '../App';
import ManageLayout from '../component/layout/ManageLayout';

function RouteMap() {
  const [cookies] = useCookies(['userType']);
  const [redirect, setRedirect] = useState('/manage/profile');

  useEffect(() => {
    switch (cookies.userType) {
      case 'admin':
        setRedirect('/manage/all-orders');
        break;
      case 'customer':
        setRedirect('/manage/profile');
        break;
      case 'foundryworker':
        setRedirect('/manage/chip-orders');
        break;
    }
  }, [cookies.userType]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="chipfab" element={<ChipOrder />} />
        {/* The project page is currently unused */}
        <Route path="project" element={<Project />} />
        <Route path="manage" element={<ManageLayout />}>
          {/* Pages for admins */}
          <Route path="foundryworkers" >
            <Route index element={<FoundryWorker />} />
            <Route path="addfoundryworker" element={<AddOrEditWorker />} />
            <Route path="editworker" element={<AddOrEditWorker />} />
          </Route>
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="addNewUser" element={<AddOrEditUser />} />
            <Route path="edituser" element={<AddOrEditUser />} />
          </Route>
          <Route path="admins"  >
            <Route index element={<Admins />} />
            <Route path="addNewAdmin" element={<AddOrEditAdmin />} />
            <Route path="editAdmin" element={<AddOrEditAdmin />} />
          </Route>
          <Route path="allfiles" element={<AllFiles />} />
          <Route path="admin-retrieve-user-files" element={<Files />} />
          <Route path="admin-retrieve-worker-orders" element={<ChipOrders />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="admin-retrieve-user-orders" element={<Orders />} />
          <Route path="assign-orders" element={<AssignOrders />} />
          {/* Pages for customers */}
          <Route path="address">
            <Route index element={<Address />} />
            <Route path="newAddress" element={<AddNewAddress />} />
            <Route path="updateaddress" element={<UpdateAddress />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="changepwd" element={<ChangePassword />} />
          <Route path="files" element={<Files />} />
          <Route path="customer-orders" element={<Orders />} />
          <Route path="cart" element={<Cart />} />
          {/* Pages for foundry workers */}
          <Route path="foundryworkprofile" element={<Profile />} />
          <Route path="chip-orders" element={<ChipOrders />} />
          <Route path="*" element={<Navigate to={redirect} replace />} />
        </Route>
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