import React from 'react';
import AuthNavLink from './AuthNavLink';
import { ROUTES } from '@/router/routes';

function NavLeft() {
  return (
    <div className="flex flex-col items-center space-y-8 pt-24">
      <div className="flex flex-col space-y-4 text-lg">
        <AuthNavLeftLink to={ROUTES.ManageProfile} userTypes={['admin', 'customer', 'worker']}>
          <i className="fa fa-book w-6 text-center" />
          <p className="">Profile</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageAddress} userTypes={['customer']} >
          <i className="fa fa-address-book w-6 text-center" />
          <p className="">Address Book</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageChangePassword} userTypes={['admin', 'customer', 'worker']}>
          <i className="fa fa-key w-6 text-center" />
          <p className="">Password</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageCart} userTypes={['customer']}>
          <i className="fa fa-shopping-cart w-6 text-center" />
          <p className="">Cart</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageOrders} userTypes={['customer']}>
          <i className="fa fa-money-bill w-6 text-center" />
          <p className="">Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageOrders} userTypes={['admin']}>
          <i className="fa fa-money-bill w-6 text-center" />
          <p className="">Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageFiles} userTypes={['customer']}>
          <i className="fa fa-database w-6 text-center" />
          <p className="">Mask Files</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageFiles} userTypes={['admin']}>
          <i className="fa fa-database w-6 text-center" />
          <p className="">Mask Files</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageOrders} userTypes={['admin', 'customer', 'worker']}>
          <i className="fa fa-microchip w-6 text-center" />
          <p className="">Fab Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageAdmins} userTypes={['admin']}>
          <i className="fa fa-user w-6 text-center" />
          <p className="">Admins</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageWorkers} userTypes={['admin']}>
          <i className="fa fa-user-group w-6 text-center" />
          <p className="">Foundry Workers</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageCustomers} userTypes={['admin']}>
          <i className="fa fa-users w-6 text-center" />
          <p className="">Customers</p>
        </AuthNavLeftLink>
      </div>
    </div>
  );
}

export default NavLeft;

function AuthNavLeftLink({ to, children, userTypes }: { to: ROUTES, children: React.ReactNode, userTypes: string[] }) {
  return <AuthNavLink
    to={to}
    activeClassName="border-primary_light text-primary_light"
    className="flex flex-row space-x-4 px-4 border-l-4 items-center"
    userTypes={userTypes}>
    {children}
  </AuthNavLink>;
}
