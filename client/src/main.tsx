import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ChatContextProvider } from './context/ChatContext';
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
            <ChatContextProvider>
              <BrowserRouter>
                <RouteMap />
              </BrowserRouter>
            </ChatContextProvider>
          </ShopifyContextProvider>
        </HelmetProvider>
      </CookiesProvider>
    </QueryClientProvider>
  </React.StrictMode>
)