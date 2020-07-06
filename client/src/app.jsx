
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from 'react-router-dom'
import ShopifyClient from 'shopify-buy';
import "bootstrap";
//import "bootstrap-modal";

// Router components
import {MainRouter, SubRouter} from 'router/routeMap.jsx';

//Using Shopify js-buy SDK to implement the checkout and payment functionalities
const shopifyClient = ShopifyClient.buildClient({
    storefrontAccessToken: 'c098a4c1f8d45e55b35caf24ca9c97bb',
    domain: 'wqntest.myshopify.com'
  });

//The root APP of React
class App extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        // shopifyClient.product.fetchAll(21).then((products) => {
        //     // Do something with the products
        //     console.log(products);
        // });
        // shopifyClient.product.fetch("Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1NjU1MzcwOTU3MTQ=").then((product) => {
        //     console.log(product);
        //     console.log(product.variants[0].price);
        // });
        // shopifyClient.product.fetch("Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM3NTY3NjE2MTIzMjI=").then((product) => {
        //     console.log(product.variants[1].price);
        // });
        return(
            <Router>
                <Switch>
                    <Route path="/subpage" component={SubRouter}/>
                    <Route path="/" render={() => <MainRouter shopifyClient={shopifyClient}/>} />
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(
    <App shopifyClient={shopifyClient} />,
    document.getElementById('app')
);
