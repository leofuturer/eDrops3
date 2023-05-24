
// import React, { useEffect, useState } from 'react';
// import ShopifyClient from 'shopify-buy';
// import { request, customerGetApiToken } from '../api';

// const useShopify = () => {
//   const [token, setToken] = useState<string>('');
//   const [domain, setDomain] = useState<string>('');
//   const [shopify, setShopify] = useState<ShopifyClient.Client>(buildClient());

//   useEffect(() => {
//     request(customerGetApiToken, 'GET', {}, false)
//       .then((res) => {
//         if (res.status === 200) {
//           setToken(res.data.info.token)
//           setDomain(res.data.info.domain);
//         }
//       })
//       .catch((err) => {
//         // console.error(err);
//       });
//   }, [])

//   function buildClient(): ShopifyClient.Client{
//     const client = ShopifyClient.buildClient({
//       storefrontAccessToken: token,
//       domain,
//     });
//     return client;
//   }

//   useEffect(() => {
//     setShopify(buildClient());
//   }, [token, domain])

//   return shopify;
// }

// export const ShopifyContext = React.createContext<ReturnType<typeof useShopify>>({} as ReturnType<typeof useShopify>);

// export function ShopifyContextProvider({ children }: { children?: React.ReactNode }) {
//   return (
//     <ShopifyContext.Provider value={useShopify()}>
//       {children}
//     </ShopifyContext.Provider>
//   )
// }