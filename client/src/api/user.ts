import {
  request,
  userSignUp,
  userBaseFind,
  userBaseDeleteById,
  updateUserBaseProfile,
  userLogin,
  userLogout,
  userForgetPass,
  userChangePass,
  userResetPass,
} from '../api';

// Overall User

// export const userSignUp = `${ApiRootUrl}/users`; // not used

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

// export const userBaseDeleteById = `${ApiRootUrl}/users/id`;
//      (admin) index.tsx
//          - used for deleting admin (deleting user and admin thing separately)
//      (fndry) index.tsx
//          - used for deleting foundry workers (deleting user and foundry thing separately)
//      (user)  index.tsx
//          - used for deleting customers (deleting user and customer thing separately)

// export const updateUserBaseProfile = `${ApiRootUrl}/users/id`;
//      addOrEditAdmin.tsx
//          - used for updating admin's base user
//      addOrEditUser.tsx
//          - used for updating foundry worker's base user

// export const userLogin = `${ApiRootUrl}/users/login`;
//      (login) index.tsx
//          - logging in with react on the login page
//      auth.ts
//          - defining a login function

// export const userLogout = `${ApiRootUrl}/users/logout`;  // not used

// export const userForgetPass = `${ApiRootUrl}/users/reset`;
//      (forgetpass) index.tsx
//          - implementing the forget password feature (sending the email)

// export const userChangePass = `${ApiRootUrl}/users/change-password`;
//      (changepass) index.tsx
//          - updating the password on the profile page

// export const userResetPass = `${ApiRootUrl}/users/reset-password`;
//      (resetpass) index.tsx
//          - resetting the password (after sending the email)

// General Uses:
//  Deleting Users (also as admins and FWorkers)
//  Updating Users (also as admins and FWorkers)
