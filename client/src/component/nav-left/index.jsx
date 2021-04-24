import React from 'react';
import './navLeft.css';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

class NavLeft extends React.Component {
  render() {
    const usertype = Cookies.get('userType');
    let filePath;
    if (usertype === 'admin') {
      filePath = '/manage/allfiles';
    } else {
      filePath = '/manage/files';
    }
    return (
      <div>
        <h2 className="admin-h2">Account</h2>
        <ul className="list-unstyled admin-ul">
          {
              Cookies.get('userType') == 'admin'
                ? (
                  <li>
                    <NavLink to="/manage/foundryworkers" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                      <span className="icon-nav"><i className="fa fa-users" /></span>
                      <span className="icon-txt">Foundry workers</span>
                    </NavLink>
                  </li>
                )
                : null
          }
          {
              Cookies.get('userType') == 'admin'
                ? (
                  <li>
                    <NavLink to="/manage/users" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                      <span className="icon-nav"><i className="fa fa-address-card" /></span>
                      <span className="icon-txt">Users</span>
                    </NavLink>
                  </li>
                )
                : null
          }
          {
              Cookies.get('userType') == 'admin'
                ? (
                  <li>
                    <NavLink to="/manage/admins" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                      <span className="icon-nav"><i className="fa fa-user" /></span>
                      <span className="icon-txt">Admins</span>
                    </NavLink>
                  </li>
                )
                : null
          }
          {
              Cookies.get('userType') == 'customer'
                ? (
                  <li>
                    <NavLink to="/manage/address" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                      <span className="icon-nav"><i className="fa fa-address-book" /></span>
                      <span className="icon-txt">Address Book</span>
                    </NavLink>
                  </li>
                )
                : null
          }
          {
                        // Cookies.get('userType') == 'customer'
                        //     ?
                        //     <li className="disabled">
                        //         <NavLink to="/manage/dashboard" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                        //             <span className="icon-nav"><i className="fa fa-dashboard"></i></span>
                        //             <span className="icon-txt">Dashboard</span>
                        //         </NavLink>
                        //     </li>
                        //     : null
                    }

          {/* <li>
                        <NavLink to="#" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                            <span className="icon-nav"><i className="fa fa-calendar"></i></span>
                            <span className="icon-txt">Event Center</span>
                        </NavLink>
                    </li> */}

          {
            Cookies.get('userType') == 'admin'
              ? (
                <li>
                  <NavLink to="/manage/profile" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                    <span className="icon-nav"><i className="fa fa-book" /></span>
                    <span className="icon-txt">Profile</span>
                  </NavLink>
                </li>
              )
              : (
                Cookies.get('userType') == 'worker'
                  ? (
                    <li>
                      <NavLink to="/manage/profile" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                        <span className="icon-nav"><i className="fa fa-book" /></span>
                        <span className="icon-txt">Profile</span>
                      </NavLink>
                    </li>
                  )
                  : (
                    <li>
                      <NavLink to="/manage/profile" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                        <span className="icon-nav"><i className="fa fa-book" /></span>
                        <span className="icon-txt">Profile</span>
                      </NavLink>
                    </li>
                  )
              )
          }

          <li>
            <NavLink to="/manage/changepwd" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
              <span className="icon-nav"><i className="fa fa-key" /></span>
              <span className="icon-txt">Password</span>
            </NavLink>
          </li>
          {
            Cookies.get('userType') == 'customer'
              ? (
                <li>
                  <NavLink to="/manage/cart" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                    <span className="icon-nav"><i className="fa fa-shopping-cart" /></span>
                    <span className="icon-txt">Cart</span>
                  </NavLink>
                </li>
              )
              : null
          }
          {
                        // Cookies.get('userType') == 'customer'
                        //     ?
                        //     <li>
                        //         <NavLink to="/manage/preferences" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                        //             <span className="icon-nav"><i className="fa fa-send"></i></span>
                        //             <span className="icon-txt">Preferences</span>
                        //         </NavLink>
                        //     </li>
                        //     : null
                    }
          {/* <li>
                        <NavLink to="#" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                            <span className="icon-nav"><i className="fa fa-bell"></i></span>
                            <span className="icon-txt">Notifications</span>
                        </NavLink>
                    </li> */}
          {
                        // Cookies.get('userType') == 'customer'
                        //     ?
                        //     <li>
                        //         <NavLink to="/manage/discounts" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                        //             <span className="icon-nav"><i className="fa fa-tag"></i></span>
                        //             <span className="icon-txt">Discounts</span>
                        //         </NavLink>
                        //     </li>
                        //     : null
                    }
          {
                        // Cookies.get('userType') == 'customer'
                        //     ?
                        //     <li>
                        //         <NavLink to="/manage/support" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                        //             <span className="icon-nav"><i className="fa fa-rocket"></i></span>
                        //             <span className="icon-txt">Support</span>
                        //         </NavLink>
                        //     </li>
                        //     : null
                    }
          {
            Cookies.get('userType') == 'customer'
              ? (
                <li>
                  <NavLink to="/manage/customer-orders" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                    <span className="icon-nav"><i className="fa fa-money" /></span>
                    <span className="icon-txt">Orders</span>
                  </NavLink>
                </li>
              )
              : Cookies.get('userType') === 'admin'
                ? (
                  <li>
                    <NavLink to="/manage/all-orders" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                      <span className="icon-nav"><i className="fa fa-money" /></span>
                      <span className="icon-txt">Orders</span>
                    </NavLink>
                  </li>
                )
                : null
          }

          {/* <li>
                        <NavLink to="#" activeStyle={{width:'117px',borderLeft:'3px solid #428bca',color:'#428bca'}}>
                            <span className="icon-nav"><i className="fa fa-building"></i></span>
                            <span className="icon-txt">Quotes</span>
                        </NavLink>
                    </li> */}
          {
                    Cookies.get('userType') === 'customer' || Cookies.get('userType') === 'admin'
                      ? (
                        <li>
                          <NavLink to={filePath} activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
                            <span className="icon-nav"><i className="fa fa-database" /></span>
                            <span className="icon-txt">Files</span>
                          </NavLink>
                        </li>
                      )
                      : null
                }
          <li>
            <NavLink to="/manage/chip-orders" activeStyle={{ width: '117px', borderLeft: '3px solid #428bca', color: '#428bca' }}>
              <span className="icon-nav"><i className="fa fa-microchip" /></span>
              <span className="icon-txt">Chip Fab Orders</span>
            </NavLink>
          </li>
        </ul>
      </div>

    );
  }
}

export default NavLeft;
