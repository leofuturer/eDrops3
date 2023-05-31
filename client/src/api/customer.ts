
import { Address, Customer } from './../types';
import { request, customer, customerByID, customerAddressesByID, customerResendVerifyEmail, customerGetApiToken } from '.'

// Customer

// export const customerSignUp = `${ApiRootUrl}/customers`;
//      (register) index.tsx
//          - Signing up and registering
/**
 * Takes the customer's data from the customer registration page to register a new customer
 */
export function signUp(customerData: Omit<Address, 'id'> & Omit<Customer, 'id'>): Promise<void> {
  return new Promise((resolve, reject) => {
    request(customer, 'POST', customerData, false)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

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
export function customerGetAddress(id: string, isDefault?: boolean): Promise<Address[]> {
  return new Promise((resolve, reject) => {
    const def: string = isDefault ? '?filter={"where":{"isDefault":true}}' : '';
    request(customerAddressesByID(id) + def, 'GET', {}, true)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function customerAddAddress(id: string, address: Omit<Address, 'id'>): Promise<void> {
  return new Promise((resolve, reject) => {
    request(customerAddressesByID(id), 'POST', address, true)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      });
  })
}

export function customerUpdateAddress(id: string, addressID: string, address: Omit<Address, 'id' | 'isDefault'>): Promise<void> {
  return new Promise((resolve, reject) => {
    request(customerAddressesByID(id) + `/${addressID}`, 'PATCH', address, true)
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  })
}

export function customerDeleteAddress(id: string, addressID: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request(`${customerAddressesByID(id)}?where={"id":"${addressID}"}`, 'DELETE', {}, true)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  })
}


// export const customerGetProfile = `${ApiRootUrl}/customers/id`;
//      (beforeCheckout) index.tsx
//          - Getting profile information
// export const customerGetName = `${ApiRootUrl}/customers/id?filter={"fields":["firstName","lastName"]}`;
//      CartContext.tsx
//          - Getting name for cart order
export function customerGet(id: string): Promise<Customer> {
  return new Promise((resolve, reject) => {
    request(customerByID(id), 'GET', {}, true)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}



// export const customerDeleteById = `${ApiRootUrl}/customers/id`;
//      (users) index.tsx
//          - Deleting user and associated customer
export function customerDelete(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request(customerByID(id), 'DELETE', {}, true)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// export const updateCustomerProfile = `${ApiRootUrl}/customers/id`;
//      customerProfile.tsx
//          - Updating profile
export function customerUpdate(id: string, userMes: Partial<Customer>): Promise<void> {
  return new Promise((resolve, reject) => {
    request(customerByID(id), 'PATCH', userMes, true)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        resolve(err)
      })
  })
}


// export const customerResendVerifyEmail = `${ApiRootUrl}/customers/resendVerifyEmail`;
//      (forgetPass) index.tsx
//          - Resend forgotten-password email
export function resendVerificationEmail(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request(customerResendVerifyEmail, 'POST', { email: email }, false)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        resolve(err)
      })
  })
}

// export const customerGetApiToken = `${ApiRootUrl}/customers/getApi`;
//      ShopifyContext.tsx
//          - Getting the API token
//      PusherContext.tsx
//          - Getting the API token
export function getApiToken(): Promise<{ token: string, domain: string, key: string }> {
  return new Promise((resolve, reject) => {
    request(customerGetApiToken, 'GET', {}, false)
      .then((res) => {
        if (res.status === 200) {
          resolve({ token: res.data.info.token, domain: res.data.info.domain, key: res.data.info.key })
        }
        reject(`Status returned as ${res.status}`)
      })
      .catch((err) => {
        reject(err)
      });
  })
}

// General uses:
//  customer signing up
//  getting information (e.g. addresses, names)
//  deleting customer (and associated user)
//  updating profile info
//  checking username/email uniqueness
//  forgetting/resetting/changing password
