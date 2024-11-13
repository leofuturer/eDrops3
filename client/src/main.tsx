import { ChatContextProvider, PusherContextProvider } from '@/context';
import { FlattenedRouteMap } from '@/router/map';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ProductsProvider } from '@/page/products/ProductsContext';
import './global.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CookiesProvider>
      <HelmetProvider>
          <PusherContextProvider>
            <ChatContextProvider>
              <ProductsProvider>
                <BrowserRouter>
                  <FlattenedRouteMap />
                </BrowserRouter>
              </ProductsProvider>
            </ChatContextProvider>
          </PusherContextProvider>
      </HelmetProvider>
    </CookiesProvider>
  </React.StrictMode>
)