
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from 'react-router-dom'
import ShopifyClient from 'shopify-buy';
import "bootstrap";

// Router components
import {MainRouter, SubRouter} from 'router/routeMap.jsx';

/*  Using Shopify js-buy SDK to implement the checkout and payment functionalities
    With the "ShopifyClient" Object passed down to the shop.jsx page, we can use 
    js-buy-sdk APIs to retrieve "product" data & create "order" in that Shopify development store
    specified by the domain and authenticated by the storefrontAccessToken
*/
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
