import {
  request,
  user,
  userbyID,
  userBaseFind,
  userBaseDeleteById,
  updateUserBaseProfile,
  userLogin,
  userForgetPass,
  userChangePass,
  userResetPass,
  userCredsTaken
} from '../api';

// Overall User



// export const userBaseFind = `${ApiRootUrl}/users`;
//      addOrEditAdmin.tsx
//          - used for finding admin data: first update the admin profile, then also get the user's id and update that
//      (admin) index.tsx
//          - used for deleting admin (deleting user and admin thing separately)
//      (fndry) index.tsx
//          - used for deleting foundry workers (deleting user and foundry thing separately)
//      addOrEditUser.tsx
//          - used for editing customers (editing user and customer thing separately)
//      (user)  index.tsx
//          - used for deleting customers (deleting user and customer thing separately)

/** 
   * Given an email string, returns associated user id
   */
async function userFind(email: string): Promise<string> {

  return new Promise((resolve, reject) => {
    request(`${user}?filter={"where": {"email": "${email}"}}`, 'GET', {}, true).then((res) => {
      resolve(res.data[0].id)
    }).catch((err) => {
      console.log(err);
      reject(err)
    })
  })
}


// export const credsTaken = `${ApiRootUrl}/users/creds-taken`;
//      auth.ts
//          - checks if email or username has been taken
/**
 *  Given an email and username, checks if they are being used. Retuns in the format of two bools, the first respective the the username, the second to the email
*/
export async function credsTaken(email: string | undefined, username: string | undefined): Promise<{ usernameTaken: boolean; emailTaken: boolean }> {
  return new Promise((resolve, reject) => {
    request(userCredsTaken, 'POST', { username, email }, false).then((res) => {
      resolve({ usernameTaken: res.data.usernameTaken, emailTaken: res.data.emailTaken })
    }).catch((err) => {
      console.log(err);
      reject(err)
    })
  })
}

// export const userBaseDeleteById = `${ApiRootUrl}/users/id`;
//      (admin) index.tsx
//          - used for deleting admin (deleting user and admin thing separately)
//      (fndry) index.tsx
//          - used for deleting foundry workers (deleting user and foundry thing separately)
//      (user)  index.tsx
//          - used for deleting customers (deleting user and customer thing separately)
/**
 * Deletes the user with the given email
 */
export async function userDelete(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    userFind(email).then((id) => {
      request(userbyID(id), 'DELETE', {}, true).then((res) => {
        resolve()
      }).catch((err) => {
        console.log(err);
        reject(err)
      })
    })
  })
}

// export const updateUserBaseProfile = `${ApiRootUrl}/users/id`;
//      addOrEditAdmin.tsx
//          - used for updating admin's base user
//      addOrEditUser.tsx
//          - used for updating foundry worker's base user
/**
 * Given an email or id, updates the user profile
 */
export async function userUpdate(mes: { phoneNumber: string, username: string, email: string }, id?: string, email?: string): Promise<void> {
  if (typeof id != 'undefined') {
    return new Promise((resolve, reject) => {
      request(userbyID(id), 'PATCH', mes, true).then((res) => {
        resolve()
      }).catch((err) => {
        console.log(err);
        reject(err)
      })
    })
  }
  else if (typeof email != 'undefined') {
    return new Promise((resolve, reject) => {
      userFind(email).then((id) => {
        request(userbyID(id), 'PATCH', mes, true).then((res) => {
          resolve()
        }).catch((err) => {
          console.log(err);
          reject(err)
        })
      })
    })
  }
  return new Promise((resolve, reject) => { reject() })
}

// export const userLogin = `${ApiRootUrl}/users/login`;
//      (login) index.tsx
//          - logging in with react on the login page
//      auth.ts
//          - defining a login function
/**
 * Attempts to login given a username/email and password
 */
export function login(data: {
  email: string; password: string; username?: undefined;
} | {
  username: string; password: string; email?: undefined;
}): Promise<any> {

  return new Promise((resolve, reject) => {
    request(userLogin, 'POST', data, false)
      .then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
  })
}


// export const userForgetPass = `${ApiRootUrl}/users/reset`;
//      (forgetpass) index.tsx
//          - implementing the forget password feature (sending the email)'
/**
 * Sends the reset password email to the given email, if the user exists.
 */
export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request(userForgetPass, 'POST', { email: email }, false)
      .then((res) => { resolve() })
      .catch((err) => { reject(err) })
  })
}


// export const userChangePass = `${ApiRootUrl}/users/change-password`;
//      (changepass) index.tsx
//          - updating the password on the profile page
/**
 * Changes the password for the given user
 */
export function changePassword(oldPass: string, newPass: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request(userChangePass, 'POST', { oldPassword: oldPass, newPassword: newPass }, true)
      .then((res) => { resolve() })
      .catch((err) => { reject(err) })
  })
}

// export const userResetPass = `${ApiRootUrl}/users/reset-password`;
//      (resetpass) index.tsx
//          - resetting the password (after sending the email)
export function resetPassword(password: string, token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    request(userResetPass, 'POST', { newPassword: password, accessToken: token }, false)
      .then((res) => { resolve() })
      .catch((err) => { reject(err) })
  })
}

// General Uses:
//  Deleting Users (also as admins and Foundry Workers)
//  Updating Users (also as admins and Foundry Workers)
//  Also, Forgetting/Resetting/Changing password things
