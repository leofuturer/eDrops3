import React, { useEffect, useState, useContext } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import {
  customerLogout, AdminLogout, FoundryWorkerLogout, userLogout,
  getCustomerCart,
  getProductOrders, getChipOrders
} from '../../api/serverConfig';
import API from '../../api/api';
import './navTop.css'
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
  const notLoggedIn = (cookies.userType === undefined);
  return (
    // At this time the className "header-div" has no use
    // <CartContext.Consumer>
    //   {(contextProps) => {
    <header className="h-[80px] bg-primary w-full">
      <div className="flex flex-row justify-center items-center">
        <NavLink to="/home" className="flex flex-row items-center"><h1 className="text-6xl font-bold hover:text-accent">eDrops</h1> <img className="website-logo" src="/img/edrop_logo_inverted.png" alt="" /></NavLink>
        <ul className="ul-nav">
          <li><NavLink to="/home" className="hover:text-accent">Home</NavLink></li>
          <li><NavLink to="/allItems" className="hover:text-accent">Products</NavLink></li>
          <li><NavLink to="/featureComing" className="hover:text-accent">Community</NavLink></li>
          <li className="li-spacer">&nbsp;</li>
          <li>
            {cookies.userType === 'customer'
              ? notLoggedIn
                ? <NavLink to="/login" className="hover:text-accent"><i className="fa fa-shopping-cart" /></NavLink> // Cannot view cart if not logged in
                : <NavLink to="/manage/cart" className="hover:text-accent"><i className="fa fa-shopping-cart" />
                  <span className='badge' style={{ display: context.items ? 'inline-block' : 'none' }}>{context.items}
                  </span>
                </NavLink>
              : null}
          </li>
          { /* Should we be using NavLink or href? NavLink prevents page reloading */}
          <li><NavLink to="/featureComing"><i className="fa fa-search" /></NavLink></li>
          {
            cookies.userType === 'customer'
              ? <li><NavLink to="/upload" className="hover:text-accent"><i className="fa fa-upload" /></NavLink></li>
              : null
          }
          {
            notLoggedIn ? null
              : (cookies.userType === 'customer'
                ? <li><NavLink to="/manage/files" className="hover:text-accent"><i className="fa fa-database" /></NavLink></li>
                : (cookies.userType === 'admin'
                  ? <li><NavLink to="/manage/allfiles" className="hover:text-accent"><i className="fa fa-database" /></NavLink></li>
                  : null)
              )
          }
          {
            notLoggedIn ? <li><NavLink to="/login">Login</NavLink></li>
              : (
                <li className="li-username">
                  {/* 4/23/2020: Only show username to avoid text that's too long, which will break the CSS */}
                  <a onClick={() => showDrowpn()} style={{ cursor: 'pointer' }}>{cookies.username}</a>
                  <div style={drown} className="div-drownup">
                    <ul className="list-styled" style={{ height: '60px' }}>
                      <li onClick={() => handleHideDrown()}>
                        <i className="fa fa-dashboard" style={{ paddingRight: '15px' }} />
                        <NavLink to="/manage/profile">Your Dashboard</NavLink>
                      </li>
                      {
                        cookies.userType === 'customer'
                          ? (
                            <li onClick={() => handleHideDrown()}>
                              <i className="fa fa-upload" style={{ paddingRight: '15px' }} />
                              <NavLink to="/upload">Upload a file</NavLink>
                            </li>
                          )
                          : null
                      }
                      {
                        cookies.userType === 'customer'
                          ? (
                            <li onClick={() => handleHideDrown()}>
                              <i className="fa fa-database" style={{ paddingRight: '15px' }} />
                              <NavLink to="/manage/files">Your Projects</NavLink>
                            </li>
                          )
                          : null
                      }
                      <li onClick={() => signout()}>
                        <i className="fa fa-sign-out" style={{ paddingRight: '15px' }} />
                        <NavLink to="/home">Logout</NavLink>
                      </li>
                    </ul>
                  </div>
                </li>
              )
          }
          {
            notLoggedIn
              ? <li><NavLink to="/register">Sign Up</NavLink></li>
              : null
          }
        </ul>
        {/* </div> */}
      </div>
    </header>
    //   }}
    // </CartContext.Consumer>
  );
}

// NavTop = withRouter(NavTop);
NavTop.contextType = CartContext;
export default hoistNonReactStatics(NavTop, withRouter(NavTop));