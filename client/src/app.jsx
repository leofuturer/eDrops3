import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ShopifyClient from 'shopify-buy';
import API from './api/api'
import {customerGetApiToken} from "./api/serverConfig";
import { createBrowserHistory } from 'history';
import "bootstrap";
// Router components
import {MainRouter, SubRouter} from 'router/routeMap.jsx';

// Singleton pattern with async call, see adeneo's response from here:
// https://stackoverflow.com/questions/39553201/singleton-with-async-initialization
var Shopify = (function(){
    var instance;
    function init(){
        function privateMethod(token, domain){
            // console.log("Building Shopify client!");
            return ShopifyClient.buildClient({
                storefrontAccessToken: token,
                domain: domain
            });
        }

        var privateAsync = new Promise(function(resolve, reject){
            API.Request(customerGetApiToken, 'GET', {}, true)
            .then(res => {
                if(res.status === 200){
                    resolve(privateMethod(res.data.info.token, res.data.info.domain));
                }
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
        });

        return {
            getPrivateValue: function() { return privateAsync; }
        };
    };

    return {
        getInstance: function() {
            if(!instance){
                instance = init();
            }
            return instance;
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
