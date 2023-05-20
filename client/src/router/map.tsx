import AuthLayout from '@/component/layout/AuthLayout';
import Layout from '@/component/layout/Layout';
import ManageLayout from '@/component/layout/ManageLayout';
import { ROLES } from '@/lib/constants/roles';
import { AddNewAddress, Address, Admins, BeforeCheckout, Cart, ChangePassword, CheckEmail, ChipOrder, EmailUnverified, EmailVerified, FeatureComing, Files, ForgetPass, FoundryWorkers, Home, Login, PageNotFound, Product, Products, Profile, Register, ResetPassword, UpdateAddress, Users, OrderDetail, OrderChat, OwnOrders, CustomerOrders, AllFiles, AllOrders } from '@/page/index';
import AddOrEditAdmin from '@/page/manage/admins/addOrEditAdmin';
import AssignOrders from '@/page/manage/assign-orders';
import ChipOrders from '@/page/manage/chip-orders';
import AddOrEditUser from '@/page/manage/customers/addOrEditUser';
import AddOrEditWorker from '@/page/manage/workers/addOrEditWorker';
import Upload from '@/page/upload';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from './routes';

export function FlattenedRouteMap() {
  const [cookies, setCookie, removeCookie] = useCookies(['userType', 'access_token', 'username', 'userId']);

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
                <Route path={ROUTES.ManageCustomersOrders} element={<CustomerOrders />} />
                <Route path={ROUTES.ManageWorkers} element={<FoundryWorkers />} />
                <Route path={ROUTES.ManageWorkersAdd} element={<AddOrEditWorker />} />
                <Route path={ROUTES.ManageWorkersUpdate} element={<AddOrEditWorker />} />
                <Route path={ROUTES.ManageWorkersFiles} element={<Files />} />
                <Route path={ROUTES.ManageWorkersOrders} element={<ChipOrders />} />
                <Route path={ROUTES.ManageAllFiles} element={<AllFiles />} />
                <Route path={ROUTES.ManageAllOrders} element={<AllOrders />} />
              </>}
            {/* Pages for customers */
              cookies.userType === ROLES.Customer && <>
                <Route path={ROUTES.ManageAddress} element={<Address />} />
                <Route path={ROUTES.ManageAddressNew} element={<AddNewAddress />} />
                <Route path={ROUTES.ManageAddressUpdate} element={<UpdateAddress />} />
                <Route path={ROUTES.ManageFiles} element={<Files />} />
                <Route path={ROUTES.ManageOrders} element={<OwnOrders />} />
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