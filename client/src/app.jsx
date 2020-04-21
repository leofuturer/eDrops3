
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from 'react-router-dom'
import ShopifyClient from 'shopify-buy';
import "bootstrap";
//import "bootstrap-modal";

import Layout from 'component/layout/index.jsx';
//Pages
import Home from 'page/home/index.jsx';
import Login from 'page/login/index.jsx';
import Register from 'page/register/index.jsx';
import Upload from 'page/fileUpload/index.jsx';
import OrderDetail from 'page/order/orderDetail.jsx';
import Project from 'page/project/index.jsx';
import Manage from 'page/manage/index.jsx';
//import Profile from "page/profile/index.jsx";
import ForgetPass from 'page/forgetPass/index.jsx';
import Shop from 'page/shop/shop.jsx';

//Using Shopify js-buy SDK to implement the checkout and payment functionalities
const shopifyClient = ShopifyClient.buildClient({
    storefrontAccessToken: process.env.SHOPIFY_TOKEN,
    domain: 'wqntest.myshopify.com'
  });

//The root APP of React
class App extends React.Component {
    constructor(props){
        super(props);
        console.log(shopifyClient);
    }

    

    render() {
        let LayoutRouter = (
            <Layout>
                <Switch>
                    <Route  path="/home" component={Home}/>
                    <Route  path="/upload" component={Upload}/>
                    <Route  path="/shop" render={({location, history}) => <Shop location={location} history={history} shopifyClient={this.props.shopifyClient}/>}/>
                    {/* The project page has not been used by now*/}
                    <Route  path="/project" component={Project}/>
                    <Route  path="/manage" component={Manage}/>
                    <Route  path="/login"  component={Login}/>
                    <Route  path="/register" component={Register}/>
                    <Route  path="/forgetPass" component={ForgetPass}/>
                    {/*The /profile route is of no use right now, it is used in <Manage> component*/}
                    {/*<Route  path="/profile" component={Profile}/>*/}
                </Switch>
            </Layout>
        );

        let SubPageRouter = (
            <Switch>
                <Route path="/subpage/order-detail" component={OrderDetail}/>
            </Switch>
        );

        return(
            <Router>
                <Switch>
                    {/*<Route path="/subpage/order-detail" component={OrderDetail}/>*/}
                    <Route path="/subpage" render={() => SubPageRouter}/>
                    <Route path="/" render={ () => LayoutRouter}/>
                    
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(
    <App shopifyClient={shopifyClient} />,
    document.getElementById('app')
);


