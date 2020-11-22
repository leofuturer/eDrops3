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
var Shopify = (function(){
    var shopify_instance = null;
    function createInstance(token, domain){
        if(token===""&&domain==="") return null;
        const inst = ShopifyClient.buildClient({
            storefrontAccessToken: token,
            domain: domain
        });
        return inst;
    }
    return {
        getInstance: function(token, domain){
            if(shopify_instance === null){
                shopify_instance = createInstance(token, domain);
            }
            return shopify_instance;
        }
    };
})();

export default Shopify;
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
                    <Route path="/" render={() => <MainRouter/>} />
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);
