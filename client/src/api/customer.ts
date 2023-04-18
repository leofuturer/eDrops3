// Customer

// export const customerSignUp = `${ApiRootUrl}/customers`;
//      (register) index.tsx
//          - Signing up and registering

// export const customerLogin = `${ApiRootUrl}/customers/login`; // not used

// export const customerLogout = `${ApiRootUrl}/customers/logout`; // not used

// export const customerAddresses = `${ApiRootUrl}/customers/id/customerAddresses`;
//      addNewAddress.tsx
//          - Adding new address
//      (address) index.tsx
//          - Getting addresses
//      updateAddress.tsx
//          - updating address
//      (beforeCheckout) index.tsx
//          - Getting addresses
//      customerProfile.tsx
//          - Getting (default) address, updating addresses

// export const customerGetProfile = `${ApiRootUrl}/customers/id`;
//      (beforeCheckout) index.tsx
//          - Getting profile information (only used addresses)

// export const customerGetName = `${ApiRootUrl}/customers/id?filter={"fields":["firstName","lastName"]}`;
//      CartContext.tsx
//          - Getting name for cart order

// export const customerDeleteById = `${ApiRootUrl}/customers/id`;
//      (users) index.tsx
//          - Deleting user and associated customer

// export const updateCustomerProfile = `${ApiRootUrl}/customers/id`;
//      customerProfile.tsx
//          - Updating profile

// export const findCustomerByWhere = `${ApiRootUrl}/customers`; // not used

// export const credsTaken = `${ApiRootUrl}/users/creds-taken`;
//      auth.ts
//          - checks if email or username has been taken

// export const customerResendVerifyEmail = `${ApiRootUrl}/customers/resendVerifyEmail`;
//      (forgetPass) index.tsx
//          - Resend forgotten-password email

// export const customerGetApiToken = `${ApiRootUrl}/customers/getApi`;
//      ShopifyContext.tsx
//          - Getting the API token
//      PusherContext.tsx
//          - Getting the API token

// General uses:
//  customer signing up
//  getting information (e.g. addresses, names)
//  deleting customer (and associated user)
//  updating profile info
//  checking username/email uniqueness
//  forgetting/resetting/changing password
