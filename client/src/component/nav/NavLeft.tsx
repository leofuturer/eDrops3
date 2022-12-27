import React from 'react';
import AuthNavLink from './AuthNavLink';

function NavLeft() {
  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <h2 className="text-2xl font-medium">Account</h2>
      <div className="flex flex-col space-y-4 text-lg">
        <AuthNavLeftLink to="/manage/profile" userTypes={['admin', 'customer', 'worker']}>
          <i className="fa fa-book aspect-square" />
          <p className="">Profile</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/address" userTypes={['customer']} >
          <i className="fa fa-address-book aspect-square" />
          <p className="">Address Book</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/changepwd" userTypes={['admin', 'customer', 'worker']}>
          <i className="fa fa-key aspect-square" />
          <p className="">Password</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/cart" userTypes={['customer']}>
          <i className="fa fa-shopping-cart aspect-square" />
          <p className="">Cart</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/customer-orders" userTypes={['customer']}>
          <i className="fa fa-money-bill aspect-square" />
          <p className="">Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/all-orders" userTypes={['admin']}>
          <i className="fa fa-money-bill aspect-square" />
          <p className="">Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/files" userTypes={['customer']}>
          <i className="fa fa-database aspect-square" />
          <p className="">Mask Files</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/allfiles" userTypes={['admin']}>
          <i className="fa fa-database aspect-square" />
          <p className="">Mask Files</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/chip-orders" userTypes={['admin', 'customer', 'worker']}>
          <i className="fa fa-microchip aspect-square" />
          <p className="">Fab Orders</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/admins" userTypes={['admin']}>
          <i className="fa fa-user aspect-square" />
          <p className="">Admins</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/foundryworkers" userTypes={['admin']}>
          <i className="fa fa-users aspect-square" />
          <p className="">Foundry Workers</p>
        </AuthNavLeftLink>
        <AuthNavLeftLink to="/manage/users" userTypes={['admin']}>
          <i className="fa fa-address-card aspect-square" />
          <p className="">Users</p>
        </AuthNavLeftLink>
      </div>
    </div>
  );
}

export default NavLeft;

function AuthNavLeftLink({ to, children, userTypes }: { to: string, children: React.ReactNode, userTypes: string[] }) {
  return <AuthNavLink
    to={to}
    activeClassName="border-primary_light text-primary_light"
    className="flex flex-row space-x-4 px-4 border-l-4 items-center"
    userTypes={userTypes}>
    {children}
  </AuthNavLink>;
}
