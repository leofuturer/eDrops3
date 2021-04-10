import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  customerLogout, AdminLogout, FoundryWorkerLogout, userLogout,
} from '../../api/serverConfig';
import API from '../../api/api';

class NavTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      drownH: '60px',
    };
  }

  signout() {
    let url = '';
    if (Cookies.get('userType') === 'admin') {
      url = AdminLogout;
    } else if (Cookies.get('userType') === 'customer') {
      url = customerLogout;
    } else if (Cookies.get('userType') === 'worker') {
      url = FoundryWorkerLogout;
    }
    Cookies.remove('userType');
    Cookies.remove('username');
    Cookies.remove('userId');
    API.Request(url, 'POST', {}, true)
      .then((res) => {
        Cookies.remove('access_token');
        API.Request(userLogout, 'POST', {}, true)
          .then((res) => {
            Cookies.remove('base_access_token');
            this.setState({ show: false });
            this.props.history.push('/home');
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleHideDrown() {
    this.setState({ show: false });
  }

  showDrowpn() {
    if (Cookies.get('userType') !== 'customer') {
      this.setState({ drownH: '60px' });
    }
    this.setState({ show: !this.state.show });
  }

  render() {
    const drown = {
      display: this.state.show ? 'block' : 'none',
    };
    const notLoggedIn = (Cookies.get('username') === undefined);
    return (
    // At this time the className "header-div" has no use
      <header className="header-div">
        <nav className="container-nav">
          <div className="header-brand">
            <a href="/home">EDrop</a>
          </div>
          <div className="">
            <ul className="ul-nav">
              <li><NavLink to="/home">Home</NavLink></li>
              <li><NavLink to="/featureComing">EWOD CAD</NavLink></li>
              <li><NavLink to="/upload">EWOD Chip Fabrication</NavLink></li>
              <li><NavLink to="/allItems">Products</NavLink></li>
              <li><NavLink to="/featureComing">Community</NavLink></li>
              <li><NavLink to="/featureComing">Support</NavLink></li>
              <li>
                { Cookies.get('userType') === 'customer'
                  ? notLoggedIn
                    ? <NavLink to="/login"><i className="fa fa-shopping-cart" /></NavLink> // Cannot view cart if not logged in
                    : <NavLink to="/manage/cart"><i className="fa fa-shopping-cart" /></NavLink>
                  : null}
              </li>
              { /* Should we be using NavLink or href? NavLink prevents page reloading */ }
              <li><a href="/featureComing"><i className="fa fa-search" /></a></li>
              {
                                Cookies.get('userType') === 'customer'
                                  ? <li><a href="/upload"><i className="fa fa-upload" /></a></li>
                                  : null
                            }
              {
                                notLoggedIn ? null
                                  : (Cookies.get('userType') === 'customer'
                                    ? <li><NavLink to="/manage/files"><i className="fa fa-database" /></NavLink></li>
                                    : (Cookies.get('userType') === 'admin'
                                      ? <li><a href="/manage/allfiles"><i className="fa fa-database" /></a></li>
                                      : null)
                                  )
                            }
              {
                                notLoggedIn ? <li><NavLink to="/login">Login</NavLink></li>
                                  : (
                                    <li className="li-username">
                                      {/* 4/23/2020: Only show username to avoid text that's too long, which will break the CSS */}
                                      <a onClick={() => this.showDrowpn()} style={{ cursor: 'pointer' }}>{Cookies.get('username')}</a>
                                      <div style={drown} className="div-drownup">
                                        <ul className="list-styled" style={{ height: '60px' }}>
                                          <li onClick={() => this.handleHideDrown()}>
                                            <i className="fa fa-dashboard" style={{ paddingRight: '15px' }} />
                                            <NavLink to="/manage/profile">Your Dashboard</NavLink>
                                          </li>
                                          {
                                                    Cookies.get('userType') == 'customer'
                                                      ? (
                                                        <li onClick={() => this.handleHideDrown()}>
                                                          <i className="fa fa-upload" style={{ paddingRight: '15px' }} />
                                                          <NavLink to="/upload">Upload a file</NavLink>
                                                        </li>
                                                      )
                                                      : null
                                                }
                                          {
                                                    Cookies.get('userType') == 'customer'
                                                      ? (
                                                        <li onClick={() => this.handleHideDrown()}>
                                                          <i className="fa fa-database" style={{ paddingRight: '15px' }} />
                                                          <NavLink to="/manage/files">Your Projects</NavLink>
                                                        </li>
                                                      )
                                                      : null
                                                }
                                          <li onClick={() => this.signout()}>
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
          </div>
        </nav>
      </header>
    );
  }
}

NavTop = withRouter(NavTop);
export default NavTop;
