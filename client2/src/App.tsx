import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopifyClient from 'shopify-buy';
import API from './api/api';
import Pusher from 'pusher-js';
import { customerGetApiToken } from './api/serverConfig';
// Router components
import RouteMap from './router/routeMap';

// Singleton pattern with async call, see adeneo's response from here:
// https://stackoverflow.com/questions/39553201/singleton-with-async-initialization
export const Shopify = (function () {
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
            resolve(privateMethod(res.data.info.token, res.data.info.domain));
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
function App() {
  return (
    <BrowserRouter>
      <RouteMap />
    </BrowserRouter>
  );
}

export default App;