
import React, { useEffect, useState } from 'react';
import ShopifyClient from 'shopify-buy';
import { request, customerGetApiToken } from '../api';

const useShopify = () => {
  const [token, setToken] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [shopify, setShopify] = useState<ShopifyClient.Client | null>(null);

  useEffect(() => {
    request(customerGetApiToken, 'GET', {}, true)
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

export const ShopifyContext = React.createContext<ReturnType<typeof useShopify>>(null);

export function ShopifyContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ShopifyContext.Provider value={useShopify()}>
      {children}
    </ShopifyContext.Provider>
  )
}
export default ShopifyContextProvider;