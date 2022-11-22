import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ShopifyClient from 'shopify-buy';
// import { createBrowserHistory } from 'history';
import API from './api/api';
import Pusher from 'pusher-js';
import { customerGetApiToken } from './api/serverConfig';
import 'bootstrap';
// Router components
import { MainRouter, SubRouter } from 'router/routeMap.jsx';
import './global.css';

// Singleton pattern with async call, see adeneo's response from here:
// https://stackoverflow.com/questions/39553201/singleton-with-async-initialization
const Shopify = (function () {
  let instance;
  function init() {
    function privateMethod(token, domain) {
      // console.log("Building Shopify client!");
      return ShopifyClient.buildClient({
        storefrontAccessToken: token,
        domain,
      });
    }

    const privateAsync = new Promise((resolve, reject) => {
      API.Request(customerGetApiToken, 'GET', {}, true)
        .then((res) => {
          if (res.status === 200) {
            resolve(privateMethod(res.data.token, res.data.domain));
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });

    return {
      getPrivateValue() { return privateAsync; },
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
}());

export default Shopify;

export const pusher = (function () {
  let instance;
  function init() {
    function privateMethod(key) {
      return new Pusher(key, {
        cluster: 'us3',
        encrypted: true,
      });
    }

    const privateAsync = new Promise((resolve, reject) => {
      API.Request(customerGetApiToken, 'GET', {}, true)
        .then((res) => {
          if (res.status === 200) {
            resolve(privateMethod(res.data.info.key));
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });

    return {
      getPrivateValue() { return privateAsync; },
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
}());

// The root APP of React
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/subpage" component={SubRouter} />
          <Route path="/" render={() => <MainRouter />} />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
