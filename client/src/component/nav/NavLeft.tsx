import React from 'react';
import AuthNavLink from './AuthNavLink';
import { ROUTES } from '@/router/routes';
import { BanknotesIcon, BookOpenIcon, CircleStackIcon, CpuChipIcon, CurrencyDollarIcon, KeyIcon, ShoppingCartIcon, UserCircleIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';

function NavLeft() {
  return (
    <div className="flex flex-col items-center space-y-8 pt-24">
      <div className="flex flex-col space-y-4 text-lg">
        <AuthNavLeftLink to={ROUTES.ManageProfile} userTypes={['admin', 'customer', 'worker']}>
          <UserCircleIcon className="w-6" />
          <p className="">Profile</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageAddress} userTypes={['customer']} >
          <BookOpenIcon className="w-6" />
          <p className="">Address Book</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageChangePassword} userTypes={['admin', 'customer', 'worker']}>
          <KeyIcon className="w-6" />
          <p className="">Password</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageCart} userTypes={['customer']}>
          <ShoppingCartIcon className="w-6" />
          <p className="">Cart</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageOrders} userTypes={['customer']}>
          <BanknotesIcon className="w-6" />
          <p className="">Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageAllOrders} userTypes={['admin']}>
          <BanknotesIcon className="w-6" />
          <p className="">Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageFiles} userTypes={['customer']}>
          <CircleStackIcon className="w-6" />
          <p className="">Mask Files</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageAllFiles} userTypes={['admin']}>
          <CircleStackIcon className="w-6" />
          <p className="">Mask Files</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageChipOrders} userTypes={['admin', 'customer', 'worker']}>
          <CpuChipIcon className="w-6 text-center" />
          <p className="">Fab Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageAdmins} userTypes={['admin']}>
          <UserIcon className="w-6 text-center" />
          <p className="">Admins</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageWorkers} userTypes={['admin']}>
          <UsersIcon className="w-6 text-center" />
          <p className="">Foundry Workers</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to={ROUTES.ManageCustomers} userTypes={['admin']}>
          <UserGroupIcon className="w-6 text-center" />
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
    activeClassName="border-primary-light text-primary-light"
    className="flex flex-row space-x-4 px-4 border-l-4 items-center"
    userTypes={userTypes}>
    {children}
  </AuthNavLink>;
}
