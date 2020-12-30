import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ShopifyClient from 'shopify-buy';
import API from './api/api'
import {customerGetApiToken} from "./api/serverConfig";
import "bootstrap";
// Router components
import {MainRouter, SubRouter} from 'router/routeMap.jsx';

var Shopify = (function(){
    var shopify_instance = null;
    async function createInstance(token, domain){
        if(token === "" && domain === "") return null;
        const inst = ShopifyClient.buildClient({
            storefrontAccessToken: token,
            domain: domain
        });
        return inst;
    }
    return {
        getInstance: async function(token, domain){
            console.log("HI");
            console.log(shopify_instance);
            if(shopify_instance === null){
                API.Request(customerGetApiToken, 'GET', {}, true)
                .then(res => {
                    console.log("done");
                    if(res.status === 200){
                        shopify_instance = createInstance(res.data.info.token, res.data.info.domain);
                        return shopify_instance;
                    }
                })
                .catch(err => {
                    console.log(err);
                    return null;
                });
            } else {
                return shopify_instance;
            }
        }
    };
}());

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
