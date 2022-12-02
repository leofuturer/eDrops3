import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import {
  customerLogout, AdminLogout, FoundryWorkerLogout, userLogout,
  getCustomerCart,
  getProductOrders, getChipOrders
} from '../../api/serverConfig';
import API from '../../api/api';
import { CartContext } from '../../context/CartContext'
import hoistNonReactStatics from 'hoist-non-react-statics';

function NavTop() {
  const [show, setShow] = useState(false);
  const [drownH, setDrownH] = useState('60px');

  const context = useContext(CartContext);
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'userType', 'userId', 'access_token']);

  useEffect(() => {
    if (cookies.username !== undefined) {
      setUpCartItems();
    }
  }, [cookies.username]);

  function signout() {
    // let url = '';
    // if (Cookies.get('userType') === 'admin') {
    //   url = AdminLogout;
    // } else if (Cookies.get('userType') === 'customer') {
    //   url = customerLogout;
    // } else if (Cookies.get('userType') === 'worker') {
    //   url = FoundryWorkerLogout;
    // }
    removeCookie('userType');
    removeCookie('username');
    removeCookie('userId');
    removeCookie('access_token');
    // Maybe look into this later to see what can be done server-side for logout/token invalidation
    // API.Request(url, 'POST', {}, true)
    //   .then((res) => {
    //     Cookies.remove('access_token');
    //     API.Request(userLogout, 'POST', {}, true)
    //       .then((res) => {
    //         Cookies.remove('base_access_token');
    //         this.setState({ show: false });
    //         this.props.history.push('/home');
    //       });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }

  function handleHideDrown() {
    setShow(false);
  }

  function showDrowpn() {
    if (cookies.userType !== 'customer') {
      setDrownH('60px');
    }
    setShow(!show);
  }

  function setUpCartItems() {
    if (cookies.userType === 'customer') {
      let url = getCustomerCart.replace('id', cookies.userId);
      API.Request(url, 'GET', {}, true)
        .then((res) => {
          if (res.data.id) {
            const orderInfoId = res.data.id;
            url = getProductOrders.replace('id', orderInfoId);
            API.Request(url, 'GET', {}, true)
              .then((res) => {
                let quantity = res.data.reduce((prev: number, curr: { quantity: number }) => prev + curr.quantity, 0);
                context.setProductQuantity(quantity);
                url = getChipOrders.replace('id', orderInfoId);
                API.Request(url, 'GET', {}, true)
                  .then((res) => {
                    quantity = res.data.reduce((prev: number, curr: { quantity: number }) => prev + curr.quantity, 0);
                    context.setChipQuantity(quantity);
                    context.setCartQuantity();
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }


  const drown = {
    display: show ? 'block' : 'none',
  };
  return (
    // At this time the className "header-div" has no use
    // <CartContext.Consumer>
    //   {(contextProps) => {
    <header className="h-[80px] bg-primary w-full">
      <div className="flex flex-row justify-between items-center px-[20%] h-full text-3xl font-semibold">
        <div className="flex flex-row items-center h-full space-x-8">
          <NavLink to="/home" className="flex flex-row items-center">
            <h1 className="text-6xl font-bold text-white hover:text-accent">eDrops</h1>
            <img className="max-h-[50px]" src="/img/edrop_logo_inverted.png" alt="" />
          </NavLink>
          <NavLink to="/home" className="hover:text-accent">Home</NavLink>
          <NavLink to="/allItems" className="hover:text-accent">Products</NavLink>
          <NavLink to="/featureComing" className="hover:text-accent">Community</NavLink>
        </div>
        <div className="flex flex-row items-center h-full space-x-8">
          {cookies.access_token ?
            <>
              {
                cookies.userType === "customer" &&
                <>
                  { /* Should we be using NavLink or href? NavLink prevents page reloading */}
                  {/* <NavLink to="/featureComing"><i className="fa fa-search" /></NavLink> */}
                  <NavLink to="/manage/cart" className="hover:text-accent"><i className="fa fa-shopping-cart" />
                    {context.items && context.items > 0 &&
                      <div className="relative">
                        <span className="absolute -top-12 -right-4 h-6 w-6 text-sm text-white flex items-center justify-center bg-[#d60000] rounded-[11px]">{context.items}</span>
                      </div>
                    }
                  </NavLink>
                  <NavLink to="/upload" className="hover:text-accent"><i className="fa fa-upload" /></NavLink>
                  <NavLink to="/manage/files" className="hover:text-accent"><i className="fa fa-database" /></NavLink>
                </>
              }
              {
                cookies.userType === "admin" &&
                <>
                  <NavLink to="/manage/allfiles" className="hover:text-accent"><i className="fa fa-database" /></NavLink>
                </>
              }
              <div className="">
                {/* 4/23/2020: Only show username to avoid text that's too long, which will break the CSS */}
                <div onClick={() => showDrowpn()} className="cursor-pointer">{cookies.username}</div>
                {
                  show &&
                  <div className="relative top-12 -left-12">
                    <div className="absolute bg-white flex flex-col space-y-4 w-[150%] p-4 text-lg text-black border">
                      <div onClick={() => handleHideDrown()}>
                        <i className="fa fa-dashboard" style={{ paddingRight: '15px' }} />
                        <NavLink to="/manage/profile">Your Dashboard</NavLink>
                      </div>
                      {
                        cookies.userType === 'customer'
                          ? (
                            <div onClick={() => handleHideDrown()}>
                              <i className="fa fa-upload" style={{ paddingRight: '15px' }} />
                              <NavLink to="/upload">Upload a file</NavLink>
                            </div>
                          )
                          : null
                      }
                      {
                        cookies.userType === 'customer'
                          ? (
                            <div onClick={() => handleHideDrown()}>
                              <i className="fa fa-database" style={{ paddingRight: '15px' }} />
                              <NavLink to="/manage/files">Your Projects</NavLink>
                            </div>
                          )
                          : null
                      }
                      <div onClick={() => signout()}>
                        <i className="fa fa-sign-out" style={{ paddingRight: '15px' }} />
                        <NavLink to="/home" className="hover:text-accent">Logout</NavLink>
                      </div>
                    </div>
                  </div>
                }

              </div>
            </>
            :
            <>
              <NavLink to="/login" className="hover:text-accent">Login</NavLink>
              <NavLink to="/register" className="hover:text-accent">Sign Up</NavLink>
            </>
          }
        </div>
      </div>
    </header>
    // </CartContext.Consumer>
  );
}

export default NavTop;