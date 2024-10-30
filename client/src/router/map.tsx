import AuthLayout from '@/component/layout/AuthLayout';
import Layout from '@/component/layout/Layout';
import ManageLayout from '@/component/layout/ManageLayout';
import { ROLES } from '@/lib/constants/roles';
import { AddAdmin, AddCustomer, AddNewAddress, AddWorker, Address, Admins, AllFiles, AllOrders, BeforeCheckout, Cart, ChangePassword, CheckEmail, ChipOrder, ChipOrders, CustomerOrders, Customers, EmailUnverified, EmailVerified, FeatureComing, Files, ForgetPass, FoundryWorkers, Home, Login, ManageAdmin, ManageCustomer, ManageWorker, OrderChat, OrderDetail, OwnOrders, PageNotFound, Product, Products, Profile, Register, ResetPassword, UpdateAddress, WorkerOrders } from '@/page/index';
import Upload from '@/page/upload';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';

function Redirect({url}: {url: string}) {
  useEffect(() => {
    window.location.href=url;
  }, []);
  return null;
}

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
        <Route path={ROUTES.Design} element={<Redirect url="http://cad.edroplets.org"/>}/>
        <Route path={ROUTES.Community} element={<Redirect url="http://community.edroplets.org"/>}/>
        <Route path={ROUTES.Control} element={<Redirect url="http://gui.edroplets.org"/>}/>
        <Route path={ROUTES.Product} element={<Product />} />
        <Route path={ROUTES.ComingSoon} element={<FeatureComing />} />
        <Route path={ROUTES.Login} element={<Login />} />
        <Route path={ROUTES.Signup} element={<Register />} />
        <Route path={ROUTES.ForgotPassword} element={<ForgetPass />} />
        <Route path={ROUTES.ResetPassword} element={<ResetPassword />} />
        <Route path={ROUTES.CheckEmail} element={<CheckEmail />} />
        <Route path={ROUTES.EmailVerified} element={<EmailVerified />} />
        <Route path={ROUTES.EmailUnverified} element={<EmailUnverified />} />
        <Route path={ROUTES.Upload} element={<Upload />} />
        <Route path={ROUTES.ChipFab} element={<ChipOrder />} />
        <Route element={<AuthLayout />} >
          <Route path={ROUTES.BeforeCheckout} element={<BeforeCheckout />} />
          <Route element={<ManageLayout />}>
            {/* Pages for admins */
              cookies.userType === ROLES.Admin && <>
                <Route path={ROUTES.ManageAdmins} element={<Admins />} />
                <Route path={ROUTES.ManageAdminsAdd} element={<AddAdmin />} />
                <Route path={ROUTES.ManageAdminsUpdate} element={<ManageAdmin />} />
                <Route path={ROUTES.ManageCustomers} element={<Customers />} />
                <Route path={ROUTES.ManageCustomersAdd} element={<AddCustomer />} />
                <Route path={ROUTES.ManageCustomersUpdate} element={<ManageCustomer />} />
                <Route path={ROUTES.ManageCustomersFiles} element={<Files />} />
                <Route path={ROUTES.ManageCustomersOrders} element={<CustomerOrders />} />
                <Route path={ROUTES.ManageWorkers} element={<FoundryWorkers />} />
                <Route path={ROUTES.ManageWorkersAdd} element={<AddWorker />} />
                <Route path={ROUTES.ManageWorkersUpdate} element={<ManageWorker />} />
                <Route path={ROUTES.ManageWorkersFiles} element={<Files />} />
                <Route path={ROUTES.ManageWorkersOrders} element={<WorkerOrders />} />
                <Route path={ROUTES.ManageAllFiles} element={<AllFiles />} />
                <Route path={ROUTES.ManageAllOrders} element={<AllOrders />} />
              </>}
            {/* Pages for customers */
              cookies.userType === ROLES.Customer && <>
                <Route path={ROUTES.ManageAddress} element={<Address />} />
                <Route path={ROUTES.ManageAddressAdd} element={<AddNewAddress />} />
                <Route path={ROUTES.ManageAddressEdit} element={<UpdateAddress />} />
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