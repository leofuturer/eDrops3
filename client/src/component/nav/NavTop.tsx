import { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import UserMenu from './UserMenu';

function NavTop() {
  const [show, setShow] = useState(false);
  const cart = useContext(CartContext);

  const [cookies, setCookie, removeCookie] = useCookies(['username', 'userType', 'userId', 'access_token']);

  function signout() {
    setShow(false);
    removeCookie('userType', { path: '/' });
    removeCookie('username', { path: '/' });
    removeCookie('userId', { path: '/' });
    removeCookie('access_token', { path: '/' });
    // TODO: look into this later to see what can be done server-side for logout/token invalidation
  }

  return (
    <header className="h-[80px] bg-primary w-full">
      <div className="flex flex-row justify-between items-center px-[20%] h-full text-lg text-white font-semibold">
        <div className="flex flex-row items-center h-full space-x-8">
          <NavLink to="/home" className="flex-none flex flex-row items-center h-full">
            <h1 className="text-2xl font-bold hover:text-accent hidden lg:flex">eDroplets</h1>
            <img className="h-3/4 flex-none" src="/img/edrop_logo_inverted.png" alt="" />
          </NavLink>
          <NavLink to="/home" className="hover:text-accent hidden xl:flex">Home</NavLink>
          <NavLink to="/allItems" className="hover:text-accent">Products</NavLink>
          <NavLink to="/featureComing" className="hover:text-accent">Community</NavLink>
        </div>
        <div className="flex flex-row items-center h-full space-x-8">
          {cookies.access_token ? <>
            {cookies.userType === "customer" && <>
              <NavLink to="/manage/cart" className="hover:text-accent"><i className="fa fa-shopping-cart" />
                {cart.numItems > 0 &&
                  <div className="relative">
                    <span className="absolute -top-10 -right-4 h-5 w-5 text-sm text-white flex items-center justify-center bg-red-600 rounded-xl">{cart.numItems}</span>
                  </div>}
              </NavLink>
              <NavLink to="/upload" className="hover:text-accent"><i className="fa fa-upload" /></NavLink>
              <NavLink to="/manage/files" className="hover:text-accent"><i className="fa fa-database" /></NavLink>
            </>}
            {cookies.userType === "admin" && <>
              <NavLink to="/manage/allfiles" className="hover:text-accent"><i className="fa fa-database" /></NavLink>
            </>}
            {cookies.userType === "worker" && <>
              <NavLink to="/manage/chip-orders" className="hover:text-accent"><i className="fa fa-database" /></NavLink>
            </>}
            <UserMenu username={cookies.username} onSignout={signout} />
          </> :
            <>
              <NavLink to="/login" className="hover:text-accent">Login</NavLink>
              <NavLink to="/register" className="hover:text-accent">Sign Up</NavLink>
            </>
          }
        </div>
      </div>
    </header >
  );
}

export default NavTop;