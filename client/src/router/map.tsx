import AuthLayout from '@/component/layout/AuthLayout';
import Layout from '@/component/layout/Layout';
import ManageLayout from '@/component/layout/ManageLayout';
import { ROLES } from '@/lib/roles';
import { AddNewAddress, Address, Admins, BeforeCheckout, Cart, ChangePassword, CheckEmail, ChipOrder, EmailUnverified, EmailVerified, FeatureComing, Files, ForgetPass, FoundryWorkers, Home, Login, Orders, PageNotFound, Product, Products, Profile, Register, ResetPassword, UpdateAddress, Users } from '@/page/index';
import AddOrEditAdmin from '@/page/manage/admins/addOrEditAdmin';
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
import { ROUTES } from './routes';

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
        <Route path="product">
          <Route path=":id" element={<Product />} />
        </Route>
        <Route path="coming-soon" element={<FeatureComing />} />
        {/* The project page is currently unused */}
        {/* <Route path="project" element={<Project />} /> */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Register />} />
        <Route path="forgot-password" element={<ForgetPass />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="check-email" element={<CheckEmail />} />
        <Route path="email-verified" element={<EmailVerified />} />
        <Route path="email-unverified" element={<EmailUnverified />} />
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
                <Route path="customers">
                  <Route index element={<Users />} />
                  <Route path="add" element={<AddOrEditUser />} />
                  <Route path=":id" >
                    <Route index element={<AddOrEditUser />} />
                    <Route path="edit" element={<AddOrEditUser />} />
                    <Route path="files" element={<Files />} />
                    <Route path="orders" element={<Orders />} />
                  </Route>
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

export function FlattenedRouteMap() {
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
      <Route element={<Layout />}>
        <Route path={ROUTES.Root} element={<Navigate to="/home" replace />} />
        <Route path={ROUTES.Home} element={<Home />} />
        <Route path={ROUTES.Products} element={<Products />} />
        <Route path={ROUTES.Product} element={<Product />} />
        <Route path={ROUTES.ComingSoon} element={<FeatureComing />} />
        <Route path={ROUTES.Login} element={<Login />} />
        <Route path={ROUTES.Signup} element={<Register />} />
        <Route path={ROUTES.ForgotPassword} element={<ForgetPass />} />
        <Route path={ROUTES.ResetPassword} element={<ResetPassword />} />
        <Route path={ROUTES.CheckEmail} element={<CheckEmail />} />
        <Route path={ROUTES.EmailVerified} element={<EmailVerified />} />
        <Route path={ROUTES.EmailUnverified} element={<EmailUnverified />} />
        <Route element={<AuthLayout />} >
          <Route path={ROUTES.Upload} element={<Upload />} />
          <Route path={ROUTES.ChipFab} element={<ChipOrder />} />
          <Route path={ROUTES.BeforeCheckout} element={<BeforeCheckout />} />
          <Route element={<ManageLayout />}>
            {/* Pages for admins */
              cookies.userType === ROLES.Admin && <>
                <Route path={ROUTES.ManageAdmins} element={<Admins />} />
                <Route path={ROUTES.ManageAdminsAdd} element={<AddOrEditAdmin />} />
                <Route path={ROUTES.ManageAdminsUpdate} element={<AddOrEditAdmin />} />
                <Route path={ROUTES.ManageCustomers} element={<Users />} />
                <Route path={ROUTES.ManageCustomersAdd} element={<AddOrEditUser />} />
                <Route path={ROUTES.ManageCustomersUpdate} element={<AddOrEditUser />} />
                <Route path={ROUTES.ManageCustomersFiles} element={<Files />} />
                <Route path={ROUTES.ManageCustomersOrders} element={<Orders />} />
                <Route path={ROUTES.ManageWorkers} element={<FoundryWorkers />} />
                <Route path={ROUTES.ManageWorkersAdd} element={<AddOrEditWorker />} />
                <Route path={ROUTES.ManageWorkersUpdate} element={<AddOrEditWorker />} />
                <Route path={ROUTES.ManageWorkersFiles} element={<Files />} />
                <Route path={ROUTES.ManageWorkersOrders} element={<ChipOrders />} />
                {/* <Route path="all-files" element={<AllFiles />} />
                <Route path="all-orders" element={<AllOrders />} /> */}
                {/* <Route path="admin-retrieve-worker-orders" element={<ChipOrders />} />
                <Route path="admin-retrieve-user-orders" element={<Orders />} /> */}
                <Route path={ROUTES.ManageAssignOrders} element={<AssignOrders />} /> {/* Do we still use this page? And if so, should be under orders? */}
              </>}
            {/* Pages for customers */
              cookies.userType === ROLES.Customer && <>
                <Route path={ROUTES.ManageAddress} element={<Address />} />
                <Route path={ROUTES.ManageAddressNew} element={<AddNewAddress />} />
                <Route path={ROUTES.ManageAddressUpdate} element={<UpdateAddress />} />
                <Route path={ROUTES.ManageFiles} element={<Files />} />
                <Route path={ROUTES.ManageOrders} element={<Orders />} />
                <Route path={ROUTES.ManageCart} element={<Cart />} />
              </>
            }
            <Route path={ROUTES.ManageProfile} element={<Profile />} />
            <Route path={ROUTES.ManageChangePassword} element={<ChangePassword />} />
            <Route path={ROUTES.ManageChipOrders} element={<ChipOrders />} />
            <Route path="*" element={<Navigate to={ROUTES.ManageProfile} replace />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route >
      <Route path={ROUTES.SubpageOrderDetail} element={<OrderDetail />} />
      <Route path={ROUTES.SubpageOrderChat} element={<OrderChat />} />
    </Routes >
  );
}