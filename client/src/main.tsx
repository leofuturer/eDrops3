import { ChatContextProvider, PusherContextProvider, ShopifyContextProvider } from '@/context/index';
import { FlattenedRouteMap } from '@/router/map';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import './global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CookiesProvider>
      <HelmetProvider>
        <ShopifyContextProvider>
          <PusherContextProvider>
            <ChatContextProvider>
              <BrowserRouter>
                <FlattenedRouteMap />
              </BrowserRouter>
            </ChatContextProvider>
          </PusherContextProvider>
        </ShopifyContextProvider>
      </HelmetProvider>
    </CookiesProvider>
  </React.StrictMode>
)