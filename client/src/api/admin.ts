import { request, admin, adminByID } from '.'
import { Admin } from '../types'
// Admin


// export const adminGetProfile = `${ApiRootUrl}/admins/id`;
//      orderChat.tsx
//          - getting messages (for chat feature)
//      adminProfile.tsx
//          - getting profile info
export function adminGet(id: string): Promise<Admin> {
  return new Promise((resolve, reject) => {
    request(adminByID(id), 'GET', {}, true)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })

}

// export const findAdminByWhere = `${ApiRootUrl}/admins`;
//      (admins) index.tsx
//          - gets a list of all the admins
export function adminGetAll(): Promise<Admin[]> {
  return new Promise((resolve, reject) => {
    request(admin, 'GET', {}, true)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      });
  })
}

// export const addAdmin = `${ApiRootUrl}/admins`;
//      addOrEditAdmin.tsx
//          - Add new admin
export function adminAdd(adminData: Partial<Admin>): Promise<Admin> {
  return new Promise((resolve, reject) => {
    request(admin, 'POST', adminData, true)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// export const updateAdminProfile = `${ApiRootUrl}/admins/id`;
//      addOrEditAdmin.tsx
//          - Updating admin profile
//      AdminProfile.tsx
//          - Updating admin profile
export function adminUpdate(id: string, adminData: Partial<Admin>): Promise<void> {
  return new Promise((resolve, reject) => {
    request(adminByID(id), 'PATCH', adminData, true)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}


// export const deleteAdminById = `${ApiRootUrl}/admins/id`;
//      (admins) index.tsx
//          - delete an admin
export function adminDelete(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request(adminByID(id), 'DELETE', {}, true)
      .then((res) => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// export const adminDownloadFile = `${ApiRootUrl}/admins/downloadFile`;
//      addFiles.tsx
//          - looking at or downloading any uploaded file
//      (files) index.tsx
//          - downloading files for user
//      chipOrders.tsx
//          - download chip order



// export const returnAllItems = `${ApiRootUrl}/admins/getItems`;
//      (allitems) index.tsx
//          - gets a list of all of the items


// general uses
//  getting admin profile info
//  updating admin profile info
//  delete admin
//  list and access (download) files
//  add new customer, admin, foundry worker
//  get a list of all customers, admins, foundry workers, and shop items
