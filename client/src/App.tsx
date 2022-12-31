import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopifyClient from 'shopify-buy';
import API from './api/lib/api';
import Pusher from 'pusher-js';
import { customerGetApiToken } from './api/lib/serverConfig';
// Router components
import RouteMap from './router/routeMap';
import { HelmetProvider } from 'react-helmet-async';

const useShopify = () => {
  const [token, setToken] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [shopify, setShopify] = useState<ShopifyClient.Client | null>(null);

  useEffect(() => {
    API.Request(customerGetApiToken, 'GET', {}, true)
      .then((res) => {
        if (res.status === 200) {
          setToken(res.data.info.token)
          setDomain(res.data.info.domain);
        }
      })
      .catch((err) => {
        // console.error(err);
      });
  }, [])

  useEffect(() => {
    if (token && domain) {
      const client = ShopifyClient.buildClient({
        storefrontAccessToken: token,
        domain,
      });
      setShopify(client);
    }
  }, [token, domain])

  return shopify;
}

const usePusher = () => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [key, setKey] = useState<string>('');

  useEffect(() => {
    API.Request(customerGetApiToken, 'GET', {}, true)
      .then((res) => {
        if (res.status === 200) {
          setKey(res.data.info.key);
        }
      })
      .catch((err) => {
        // console.error(err);
      });
  }, [])

  useEffect(() => {
    if (key) {
      const client = new Pusher(key, {
        cluster: 'us3',
        // encrypted: true, // TODO: This is not working, see docs to look into message encryption
      });
      setPusher(client);
    }
  }, [key])

  return pusher;
}

export const ShopifyContext = React.createContext<ReturnType<typeof useShopify>>(null);

function ShopifyContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ShopifyContext.Provider value={useShopify()}>
      {children}
    </ShopifyContext.Provider>
  )
}

export const PusherContext = React.createContext<ReturnType<typeof usePusher>>(null);

function PusherContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <PusherContext.Provider value={usePusher()}>
      {children}
    </PusherContext.Provider>
  )
}

// The root APP of React
function App() {
  return (
    <HelmetProvider>
      <ShopifyContextProvider>
        <PusherContextProvider>
          <BrowserRouter>
            <RouteMap />
          </BrowserRouter>
        </PusherContextProvider>
      </ShopifyContextProvider>
    </HelmetProvider>
  );
}

export default App;