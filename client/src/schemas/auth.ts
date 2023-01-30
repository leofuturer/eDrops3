import * as Yup from 'yup';
import { request } from '../api';
import { adminCredsTaken, customerCredsTaken } from '../api';
import { confirmPasswordSchema, customerTypeSchema, emailSchema, firstNameSchema, lastNameSchema, passwordSchema, phoneNumberSchema, usernameSchema } from './lib/user';

// TODO: ensure yup objects conform to our types (e.g. Customer)
export const UserSchema = Yup.object().shape({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  phoneNumber: phoneNumberSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  customerType: customerTypeSchema,
});

export const UserSubmitSchema = UserSchema.test('credentialsTaken', 'Username or email already taken', async ({ email, username }, ctx) =>
  request(customerCredsTaken, 'POST', { username, email }, false).then((res) => {
    if (res.data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (res.data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
); // https://github.com/jaredpalmer/formik/issues/2146#issuecomment-720639988

export const AdminSchema = Yup.object().shape({
  phoneNumber: phoneNumberSchema,
  realm: Yup.string().optional(),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const AdminEditSchema = Yup.object().shape({
  phoneNumber: phoneNumberSchema,
  realm: Yup.string().required('Realm can\'t be blank'),
  username: usernameSchema,
});

export const AdminSubmitSchema = AdminSchema.test('credentialsTaken', 'Username or email already taken', async ({ email, username }, ctx) =>
  request(adminCredsTaken, 'POST', { username, email }, false).then((res) => {
    if (res.data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (res.data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
);

export const WorkerSchema = Yup.object().shape({
  phoneNumber: phoneNumberSchema,
  affiliation: Yup.string().required('Affiliation can\'t be blank'),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

// export const WorkerSubmitSchema = WorkerSchema.test('credentialsTaken', 'Username or email already taken', async ({ email, username }, ctx) =>
//   request(workerCredsTaken, 'POST', { username, email }, false).then((res) => {
//     if (res.data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
//     if (res.data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
//     return true
//   })
// );

export const LoginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required('Username or email can\'t be blank'),
  password: Yup.string()
    .required('Password can\'t be blank'),
});

export const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Password can\'t be blank')
    .min(8, 'Password is too short (minimum is 8 characters)')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, 'Password must contain a uppercase letter, lowercase letter, and number.'),
  confirmNewPassword: Yup.string()
    .required('Confirm password can\'t be blank')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('Old password can\'t be blank'),
}).concat(ResetPasswordSchema);
