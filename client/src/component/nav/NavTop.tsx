import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

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
            <h1 className="text-2xl font-bold hover:text-accent hidden lg:flex">eDrops</h1>
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
            <div className="relative">
              {/* 4/23/2020: Only show username to avoid text that's too long, which will break the CSS */}
              <div onClick={() => setShow(!show)} className="cursor-pointer hover:text-accent">{cookies.username}</div>
              {show &&
                <div className="absolute top-[60px] bg-white flex flex-col space-y-4 w-max -translate-x-1/4 p-4 text-sm text-black border">
                  <NavLink to="/manage/profile"
                    onClick={() => setShow(false)}
                    className="flex space-x-2 items-center hover:text-accent"><i className="fa fa-dashboard" /><p>Your Dashboard</p></NavLink>
                  {cookies.userType === 'customer' &&
                    <>
                      <NavLink to="/upload"
                        onClick={() => setShow(false)}
                        className="flex space-x-2 items-center hover:text-accent"><i className="fa fa-upload" /><p>Upload a file</p></NavLink>
                      <NavLink to="/manage/files"
                        onClick={() => setShow(false)}
                        className="flex space-x-2 items-center hover:text-accent"><i className="fa fa-database" /><p>Your Projects</p></NavLink>
                    </>
                  }
                  <NavLink to="/home"
                    onClick={() => signout()}
                    className="flex space-x-2 items-center hover:text-accent"><i className="fa fa-sign-out" /><p>Logout</p></NavLink>
                </div>
              }
            </div>
          </> :
            <>
              <NavLink to="/login" className="hover:text-accent">Login</NavLink>
              <NavLink to="/register" className="hover:text-accent">Sign Up</NavLink>
            </>
          }
        </div>
      </div>
    </header>
  );
}

export default NavTop;