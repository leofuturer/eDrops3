import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '../component/layout/Layout';
import ManageLayout from '../component/layout/ManageLayout';
import Address from '../page/address';
import AddNewAddress from '../page/address/addNewAddress';
import UpdateAddress from '../page/address/updateAddress';
import Admins from '../page/admins';
import AddOrEditAdmin from '../page/admins/addOrEditAdmin';
import AllItems from '../page/allItems/index';
import BeforeCheckout from '../page/beforeCheckout/index';
import Cart from '../page/cart';
import ChangePassword from '../page/changePass';
import CheckEmail from '../page/checkEmail/index';
import EmailVerified from '../page/emailVerified/index';
import EmailVerifyInvalid from '../page/emailVerifyInvalid/index';
import FeatureComing from '../page/featureComing/index';
import Files from '../page/files';
import AllFiles from '../page/files/allFiles';
import Upload from '../page/fileUpload/index';
import ForgetPass from '../page/forgetPass/index';
import FoundryWorker from '../page/foundryWorker';
import AddOrEditWorker from '../page/foundryWorker/addOrEditWorker';
import Home from '../page/home/index';
import Login from '../page/login/index';
import Orders from '../page/order';
import AllOrders from '../page/order/allOrders';
import AssignOrders from '../page/order/assignOrders';
import ChipOrders from '../page/order/chipOrders';
import OrderChat from '../page/order/orderChat';
import OrderDetail from '../page/order/orderDetail';
import PageNotFound from '../page/pageNotFound/pageNotFound';
import ChipOrder from '../page/product/chiporder';
import Product from '../page/product/index';
import Profile from '../page/profile';
import Register from '../page/register/index';
import ResetPassword from '../page/resetPassword/index';
import Users from '../page/users';
import AddOrEditUser from '../page/users/addOrEditUser';
import jwt_decode, { JwtPayload } from 'jwt-decode';

function RouteMap() {
  const [cookies, setCookie, removeCookie] = useCookies(['userType', 'access_token', 'username', 'userId']);
  const location = useLocation();

  useEffect(() => {
    if (cookies.access_token) {
      const decoded = jwt_decode<JwtPayload>(cookies.access_token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        removeCookie('access_token');
        removeCookie('userType');
        removeCookie('username');
        removeCookie('userId');
      }
    }
  }, [cookies.access_token]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="allItems" element={<AllItems />} />
        <Route path="product" element={<Product />} />
        <Route path="featureComing" element={<FeatureComing />} />
        {/* The project page is currently unused */}
        {/* <Route path="project" element={<Project />} /> */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgetPass" element={<ForgetPass />} />
        <Route path="checkEmail" element={<CheckEmail />} />
        <Route path="emailVerified" element={<EmailVerified />} />
        <Route path="emailVerifyInvalid" element={<EmailVerifyInvalid />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route element={cookies.access_token ? <Outlet /> : <Navigate to="/login" replace state={{ path: location.pathname }} />} >
          <Route path="upload" element={<Upload />} />
          <Route path="chipfab" element={<ChipOrder />} />
          <Route path="beforeCheckout" element={<BeforeCheckout />} />
          <Route path="manage" element={<ManageLayout />}>
            {/* Pages for admins */
              cookies.userType === 'admin' && <>
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
                <Route path="all-orders" element={<AllOrders />} />
                <Route path="admin-retrieve-user-files" element={<Files />} />
                <Route path="admin-retrieve-worker-orders" element={<ChipOrders />} />
                <Route path="admin-retrieve-user-orders" element={<Orders />} />
                <Route path="assign-orders" element={<AssignOrders />} />
              </>}
            {/* Pages for customers */
              cookies.userType === 'customer' && <>
                <Route path="address">
                  <Route index element={<Address />} />
                  <Route path="newAddress" element={<AddNewAddress />} />
                  <Route path="updateaddress" element={<UpdateAddress />} />
                </Route>
                <Route path="files" element={<Files />} />
                <Route path="customer-orders" element={<Orders />} />
                <Route path="cart" element={<Cart />} />
              </>
            }
            <Route path="profile" element={<Profile />} />
            <Route path="changepwd" element={<ChangePassword />} />
            <Route path="chip-orders" element={<ChipOrders />} />
            <Route path="*" element={<Navigate to="profile" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route >
      <Route path="subpage">
        <Route path="order-detail" element={<OrderDetail />} />
        <Route path="order-chat" element={<OrderChat />} />
      </Route>
    </Routes >
  );
}

export default RouteMap;