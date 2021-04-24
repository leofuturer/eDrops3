import React from 'react';
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router-dom';

import NavLeft from 'component/nav-left/index.jsx';
// Customers
import Profile from 'page/profile/index.jsx';
import Password from 'page/changePass/index.jsx';
import Address from 'page/address/index.jsx';
import AddNewAddress from 'page/address/addNewAddress.jsx';
import UpdateAddress from 'page/address/updateAddress.jsx';

// Workers
import FoundryWorker from 'page/foundryWorker/index.jsx';
import Users from 'page/users/index.jsx';
import AddOrEditWorker from 'page/foundryWorker/addOrEditWorker.jsx';
import AddOrEditUser from 'page/users/addOrEditUser.jsx';

// Admins
import Admins from 'page/admins/index.jsx';
import AddOrEditAdmin from 'page/admins/addOrEditAdmin.jsx';

// Files
import Files from 'page/files/index.jsx';
import AllFiles from 'page/files/allFiles.jsx';

// Orders
import Orders from 'page/order/index.jsx';
import AllOrders from 'page/order/allOrders.jsx';
import AssignOrders from 'page/order/assignOrders.jsx';
import ChipOrders from 'page/order/chipOrders.jsx';

// Cart
import Cart from 'page/cart/index.jsx';

import Cookies from 'js-cookie';
import Shopify from '../../app.jsx';

const routes = [
  // Pages for Admin:
  // Admin view(manage) all workers
  {
    path: '/manage/foundryworkers',
    component: FoundryWorker,
  },
  // Admin add new workers
  {
    path: '/manage/foundryworkers/addfoundryworker',
    component: AddOrEditWorker,
  },
  // Admin edit worker's profile
  {
    path: '/manage/foundryworkers/editworker',
    component: AddOrEditWorker,
  },
  // Admin view(manage) all customers
  {
    path: '/manage/users',
    component: Users,
  },
  // Admin add new customers
  {
    path: '/manage/users/addNewUser',
    component: AddOrEditUser,
  },
  // Admin edit user's profile
  {
    path: '/manage/users/edituser',
    component: AddOrEditUser,
  },
  // Admin view(manage) all admins
  {
    path: '/manage/admins',
    component: Admins,
  },
  // Admin add new admin
  {
    path: '/manage/admins/addNewAdmin',
    component: AddOrEditAdmin,
  },
  // Admin edit an admin
  {
    path: '/manage/admins/editAdmin',
    component: AddOrEditAdmin,
  },
  // Admin view(manage) all files
  {
    path: '/manage/allfiles',
    component: AllFiles,
  },
  // Admin view files belongs to a certain customer/worker
  {
    path: '/manage/admin-retrieve-user-files',
    component: Files,
  },
  // Admin view all orders
  {
    path: '/manage/all-orders',
    component: AllOrders,
  },
  // Admin view orders belonging to a certain customer
  {
    path: '/manage/admin-retrieve-user-orders',
    component: Orders,
  },
  // Admin assigne orders
  {
    path: '/manage/assign-orders',
    component: AssignOrders,
  },

  // Pages for customers:
  // Customer view(manage) all of their address cards
  {
    path: '/manage/address',
    component: Address,
  },
  // Customer view & edit their profile
  {
    path: '/manage/profile',
    component: Profile,
  },
  // Customer change his password
  {
    path: '/manage/changepwd',
    component: Password,
  },

  // Customer add a new address card
  {
    path: '/manage/address/newAddress',
    component: AddNewAddress,
  },

  // Customer edit a certain address
  {
    path: '/manage/address/updateAddress',
    component: UpdateAddress,
  },
  // Customer view(manage) all his files
  {
    path: '/manage/files',
    component: Files,
  },
  {
    path: '/manage/customer-orders',
    component: Orders,
  },
  {
    path: '/manage/cart',
    component: Cart,
  },

  // Pages for foundry workers
  // Worker view(manage) their profiles
  {
    path: '/manage/foundryworkprofile',
    component: Profile,
  },

  // page for users to view their custom chip orders
  {
    path: '/manage/chip-orders',
    component: ChipOrders,
  },
];

class Manage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="manage">
        <div className="left-nav">
          <NavLeft />
        </div>
        <div className="right-content">
          <Switch>
            {routes.map((route, index) => (
              route.path !== '/manage/cart'
                ? (
                  <Route
                    exact
                    key={index}
                    path={route.path}
                    component={route.component}
                  />
                ) : (
                  <Route
                    key={index}
                    path={route.path}
                    render={({ location, history }) => <Cart shopifyClient={Shopify.getInstance().getPrivateValue()} location={location} history={history} />}
                  />
                )
            ))}

            {/* Forced redirections when none of the path above is matched */}
            {
                            Cookies.get('userType') === 'customer'
                              ? <Redirect from="/manage" to="/manage/profile" />
                              : null
                        }
            {
                            Cookies.get('userType') === 'admin'
                              ? <Redirect to="/manage/all-orders" />
                              : null
                        }
            {
                            Cookies.get('userType') === 'worker'
                              ? <Redirect from="/manage" to="/manage/chip-orders" />
                              : null
                        }
          </Switch>
        </div>
        <div className="hr-div-login" />
      </div>
    );
  }
}

Manage = withRouter(Manage);
export default Manage;
