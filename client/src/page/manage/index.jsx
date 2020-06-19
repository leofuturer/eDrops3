import React from 'react';
import {Route, Switch, Redirect, withRouter} from "react-router-dom";

import NavLeft from 'component/nav-left/index.jsx';
//Customers
import Profile from 'page/profile/index.jsx';
import Password from 'page/changePass/index.jsx';
import Address from 'page/address/index.jsx';
import AddNewAddress from 'page/address/addNewAddress.jsx';
import UpdateAddress from 'page/address/updateAddress.jsx';

//Workers
import FoundryWorker from 'page/foundryWorker/index.jsx';
import Users from 'page/users/index.jsx';
import AddOrEditWorker from 'page/foundryWorker/addOrEditWorker.jsx';
import AddOrEditUser from 'page/users/addOrEditUser.jsx';
//Files
import Files from 'page/files/index.jsx';
import AllFiles from 'page/files/allFiles.jsx';
import AssignFile from 'page/files/assign.jsx';

//Orders
import Orders from 'page/order/index.jsx';
import AllOrders from 'page/order/allOrders.jsx';
import AssignOrders from 'page/order/assignOrders.jsx';

import Cookies from "js-cookie";
import { getAllOrderInfos } from '../../api/serverConfig';

const routes = [
    //Pages for Admin:
    //Admin view(manage) all workers
    {
        path: "/manage/foundryworkers",
        component: FoundryWorker
    },
    //Admin add new workers
    {
        path: "/manage/foundryworkers/addfoundryworker",
        component: AddOrEditWorker
    },
    //Admin edit worker's profile
    {
        path: "/manage/foundryworkers/editworker",
        component: AddOrEditWorker
    },
    //Admin view(manage) all customers
    {
        path: "/manage/users",
        component: Users
    },
    //Admin add new customers
    {
        path: "/manage/users/addNewUser",
        component: AddOrEditUser
    },
    //Admin edit user's profile
    {
        path: "/manage/users/edituser",
        component: AddOrEditUser
    },
    //Admin view(manage) all files
    {
        path: "/manage/allfiles",
        component: AllFiles
    },
    //Admin view files belongs to a certain customer/worker
    {
        path: "/manage/admin-retrieve-user-files",
        component: Files
    },
    //Admin assign files to workers
    {
        path: "/manage/assign",
        component: AssignFile
    },
    //Admin view all orders
    {
        path: "/manage/all-orders",
        component: AllOrders 
    },
    //Admin assigne orders
    {
        path: "/manage/assign-orders",
        component: AssignOrders
    },

    //Pages for customers:
        //Customer view(manage) all of their address cards
    {
        path: "/manage/address",
        component: Address
    },
    //Customer view & edit their profile
    {
        path: "/manage/profile",
        component: Profile
    },
    //Customer change his password
    {
        path: "/manage/changepwd",
        component: Password
    },

    //Customer add a new address card
    {
        path: "/manage/address/newAddress",
        component: AddNewAddress
    },
    //Customer edit a certain address
    {
        path: "/manage/address/updateAddress",
        component: UpdateAddress
    },
    //Customer view(manage) all his files
    {
        path: "/manage/files",
        component: Files
    },
    {
        path: "/manage/customer-orders",
        component: Orders
    },

    //Pages for foundry workers
    //Worker view(manage) their profiles
    {
        path: "/manage/foundryworkprofile",
        component: Profile
    },
    {
        path: "/manage/workerfiles",
        component: Files
    },
    {
        path: "/manage/worker-orders",
        component: Orders
    },
];


class Manage extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        if(Cookies.get('username') === undefined){
            return <Redirect to='/login'></Redirect>
        }
        return(
            <div className="manage">
                <div className="left-nav">
                    <NavLeft/>
                </div>
                <div className="right-content">
                    <Switch>    
                        {routes.map((route, index) => (
                            <Route exact
                                key={index}
                                path={route.path}
                                component={route.component}
                            />
                        ))}

                        {/*Forced redirections when none of the path above is matched*/}
                        {
                            Cookies.get('userType') === 'customer'
                                ?
                                <Redirect from="/manage" to="/manage/profile"/>
                                : null
                        }
                        {
                            Cookies.get('userType') === 'admin'
                                ?
                                <Redirect to="/manage/all-orders"/>
                                : null
                        }
                        {
                            Cookies.get('userType') === 'worker'
                                ?
                                <Redirect from="/manage" to="/manage/worker-orders"/>
                                : null
                        }

                    </Switch>
                </div>
                <div className="hr-div-login"></div>
            </div>
        )
    }
};
Manage = withRouter(Manage);
export default Manage;