import { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useNavigate } from 'react-router-dom';
import { CartContext } from '@/context/CartContext';
import UserMenu from './UserMenu';
import { ROUTES } from '@/router/routes';
import { ArrowUpTrayIcon, Bars3BottomRightIcon, Bars3Icon, CircleStackIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

function NavTop() {
  const [show, setShow] = useState(false);
  const [showDropNav, setShowDropNav] = useState(false);
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
    <header className="bg-primary w-full flex flex-col md:flex-row">
      <div className="h-[80px] w-full flex flex-row justify-between items-center px-4 md:px-6 lg:px-24 xl:px-48 text-xl lg:text-2xl font-medium text-white">
        <div className="flex flex-row items-center py-4 h-full space-x-8">
          <NavLink to={ROUTES.Home} className="flex-none flex flex-row items-end h-full">
            <img className="h-full flex-none" src="/img/edrop_logo_inverted.png" alt="" />
            <h1 className="text-4xl hover:text-accent hidden lg:flex">Droplets</h1>
          </NavLink>
          <NavLink to={ROUTES.Home} className="hover:text-accent hidden xl:flex pt-2">Home</NavLink>
          <NavLink to={ROUTES.Products} className="hover:text-accent hidden md:flex pt-2">Products</NavLink>
          <a href="https://community.edroplets.org" className="hover:text-accent hidden md:flex pt-2">Community</a>
        </div>
        <div className="hidden md:flex flex-row items-center h-full space-x-8 text-xl pt-2">
          {cookies.access_token ? <>
            {cookies.userType === "customer" && <>
              <NavLink to={ROUTES.ManageCart} className="hover:text-accent hidden lg:flex"><ShoppingCartIcon className="w-6" />
                {cart.numItems > 0 &&
                  <div className="relative">
                    <span className="absolute -top-4 -right-4 h-5 w-5 text-sm text-white flex items-center justify-center bg-red-600 rounded-xl">{cart.numItems}</span>
                  </div>}
              </NavLink>
              <NavLink to={ROUTES.Upload} className="hover:text-accent hidden lg:flex"><ArrowUpTrayIcon className="w-6" /></NavLink>
              <NavLink to={ROUTES.ManageFiles} className="hover:text-accent hidden lg:flex"><CircleStackIcon className="w-6" /></NavLink>
            </>}
            {cookies.userType === "admin" && <>
              <NavLink to={ROUTES.ManageFiles} className="hover:text-accent hidden lg:flex"><CircleStackIcon className="w-6" /></NavLink>
            </>}
            {cookies.userType === "worker" && <>
              <NavLink to={ROUTES.ManageOrders} className="hover:text-accent hidden lg:flex"><CircleStackIcon className="w-6" /></NavLink>
            </>}
            <UserMenu username={cookies.username} onSignout={signout} />
          </> :
            <>
              <NavLink to={ROUTES.Login} className="hover:text-accent text-2xl">Login</NavLink>
              <NavLink to={ROUTES.Signup} className="hover:text-accent text-2xl">Sign Up</NavLink>
            </>
          }
        </div>
        <div className="flex md:hidden flex-row justify-center items-center space-x-4">
          {cookies.access_token && <UserMenu username={cookies.username} onSignout={signout} />}
          {showDropNav ? <Bars3BottomRightIcon className="w-8 md:hidden text-2xl" onClick={() => setShowDropNav(!showDropNav)} /> : <Bars3Icon className="w-8 md:hidden text-2xl" onClick={() => setShowDropNav(!showDropNav)} />}
        </div>
      </div>
      {showDropNav &&
        <div className="flex flex-col bg-primary md:hidden text-white text-center px-4 space-y-2 py-2">
          {/* <NavLink to={ROUTES.Home} className="hover:text-accent text-2xl">Home</NavLink> */}
          <NavLink to={ROUTES.Products} className="hover:text-accent text-2xl">Products</NavLink>
          <NavLink to={ROUTES.ComingSoon} className="hover:text-accent text-2xl">Community</NavLink>
        </div>
      }
    </header >
  );
}

export default NavTop;