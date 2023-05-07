import AddOrEditAdmin from '@/page/manage/admins/addOrEditAdmin';
import AllFiles from '@/page/manage/files/allFiles';
import AllOrders from '@/page/manage/orders/allOrders';
import AssignOrders from '@/page/manage/orders/assignOrders';
import ChipOrders from '@/page/manage/orders/chipOrders';
import OrderChat from '@/page/manage/orders/orderChat';
import OrderDetail from '@/page/manage/orders/orderDetail';
import AddOrEditUser from '@/page/manage/users/addOrEditUser';
import AddOrEditWorker from '@/page/manage/workers/addOrEditWorker';
import Upload from '@/page/upload';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/component/layout/Layout';
import ManageLayout from '@/component/layout/ManageLayout';
import { AddNewAddress, Address, Admins, BeforeCheckout, Cart, ChangePassword, CheckEmail, ChipOrder, EmailUnverified, EmailVerified, FeatureComing, Files, ForgetPass, FoundryWorkers, Home, Login, Orders, PageNotFound, Product, Products, Profile, Register, ResetPassword, UpdateAddress, Users } from '@/page/index';

export function RouteMap() {
  const [cookies, setCookie, removeCookie] = useCookies(['userType', 'access_token', 'username', 'userId']);
  const location = useLocation();

  useEffect(() => {
    if (cookies.access_token) {
      const decoded = jwt_decode<JwtPayload>(cookies.access_token);
      if (decoded.exp && (decoded.exp * 1000) < Date.now()) {
        removeCookie('access_token', { path: '/' });
        removeCookie('userType', { path: '/' });
        removeCookie('username', { path: '/' });
        removeCookie('userId', { path: '/' });
      }
    }
  }, [cookies.access_token]);
import AddOrEditAdmin from '@/page/manage/admins/addOrEditAdmin';
import AllFiles from '@/page/manage/files/allFiles';
import AllOrders from '@/page/manage/orders/allOrders';
import AssignOrders from '@/page/manage/orders/assignOrders';
import ChipOrders from '@/page/manage/orders/chipOrders';
import OrderChat from '@/page/manage/orders/orderChat';
import OrderDetail from '@/page/manage/orders/orderDetail';
import AddOrEditUser from '@/page/manage/users/addOrEditUser';
import AddOrEditWorker from '@/page/manage/workers/addOrEditWorker';
import Upload from '@/page/upload';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/component/layout/Layout';
import ManageLayout from '@/component/layout/ManageLayout';
import { AddNewAddress, Address, Admins, BeforeCheckout, Cart, ChangePassword, CheckEmail, ChipOrder, EmailUnverified, EmailVerified, FeatureComing, Files, ForgetPass, FoundryWorkers, Home, Login, Orders, PageNotFound, Product, Products, Profile, Register, ResetPassword, UpdateAddress, Users } from '@/page/index';

export function RouteMap() {
  const [cookies, setCookie, removeCookie] = useCookies(['userType', 'access_token', 'username', 'userId']);
  const location = useLocation();

  useEffect(() => {
    if (cookies.access_token) {
      const decoded = jwt_decode<JwtPayload>(cookies.access_token);
      if (decoded.exp && (decoded.exp * 1000) < Date.now()) {
        removeCookie('access_token', { path: '/' });
        removeCookie('userType', { path: '/' });
        removeCookie('username', { path: '/' });
        removeCookie('userId', { path: '/' });
      }
    }
  }, [cookies.access_token]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product" element={<Product />} />
        <Route path="coming-soon" element={<FeatureComing />} />
        {/* The project page is currently unused */}
        {/* <Route path="project" element={<Project />} /> */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Register />} />
        <Route path="forgot-password" element={<ForgetPass />} />
        <Route path="check-email" element={<CheckEmail />} />
        <Route path="email-verified" element={<EmailVerified />} />
        <Route path="email-unverified" element={<EmailUnverified />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route element={cookies.access_token ? <Outlet /> : <Navigate to="/login" replace state={{ path: location.pathname }} />} >
          <Route path="upload" element={<Upload />} />
          <Route path="chip-fab" element={<ChipOrder />} />
          <Route path="before-checkout" element={<BeforeCheckout />} />
          <Route path="manage" element={<ManageLayout />}>
            {/* Pages for admins */
              cookies.userType === 'admin' && <>
                <Route path="admins"  >
                  <Route index element={<Admins />} />
                  <Route path="add" element={<AddOrEditAdmin />} />
                  <Route path=":id" >
                    <Route index element={<AddOrEditAdmin />} />
                    <Route path="edit" element={<AddOrEditAdmin />} />
                  </Route>
                </Route>
                <Route path="users">
                  <Route index element={<Users />} />
                  <Route path="add" element={<AddOrEditUser />} />
                  <Route path=":id" >
                    <Route index element={<AddOrEditUser />} />
                    <Route path="edit" element={<AddOrEditUser />} />
                    <Route path="files" element={<Files />} />
                    <Route path="orders" element={<Orders />} />
                  </Route>
                  <Route path="edit" element={<AddOrEditUser />} />
                </Route>
                <Route path="workers" >
                  <Route index element={<FoundryWorkers />} />
                  <Route path="add" element={<AddOrEditWorker />} />
                  <Route path=":id" >
                    <Route index element={<AddOrEditWorker />} />
                    <Route path="edit" element={<AddOrEditWorker />} />
                    <Route path="files" element={<Files />} />
                    <Route path="orders" element={<ChipOrders />} />
                  </Route>
                </Route>
                {/* <Route path="all-files" element={<AllFiles />} />
                <Route path="all-orders" element={<AllOrders />} /> */}
                {/* <Route path="admin-retrieve-worker-orders" element={<ChipOrders />} />
                <Route path="admin-retrieve-user-orders" element={<Orders />} /> */}
                <Route path="assign-orders" element={<AssignOrders />} /> {/* Do we still use this page? And if so, should be under orders? */}
              </>}
            {/* Pages for customers */
              cookies.userType === 'customer' && <>
                <Route path="address">
                  <Route index element={<Address />} />
                  <Route path="new" element={<AddNewAddress />} />
                  <Route path="update" element={<UpdateAddress />} />
                </Route>
                <Route path="files" element={<Files />} />
                <Route path="orders" element={<Orders />} />
                <Route path="cart" element={<Cart />} />
              </>
            }
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
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