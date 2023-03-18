import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { PusherContextProvider } from './context/PusherContext';
import { ShopifyContextProvider } from './context/ShopifyContext';
import './global.css';
import RouteMap from './router/routeMap';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <HelmetProvider>
          <ShopifyContextProvider>
            <PusherContextProvider>
              <BrowserRouter>
                <RouteMap />
              </BrowserRouter>
            </PusherContextProvider>
          </ShopifyContextProvider>
        </HelmetProvider>
      </CookiesProvider>
    </QueryClientProvider>
  </React.StrictMode>
)