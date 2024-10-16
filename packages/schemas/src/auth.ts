import { object, string, ref } from 'yup';
import { api } from '@edroplets/api';
import { confirmPasswordSchema, customerTypeSchema, emailSchema, firstNameSchema, lastNameSchema, passwordSchema, phoneNumberSchema, usernameSchema } from './lib/user';

// TODO: ensure yup objects conform to our types (e.g. Customer)
export const UserSchema = object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
})

export const UserSubmitSchema = UserSchema.test('credentialsTaken', 'Username or email already taken', ({ email, username }, ctx) =>
  api.user.credsTaken(username as string, email as string).then((data) => {
    if (data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
); // https://github.com/jaredpalmer/formik/issues/2146#issuecomment-720639988

export const CustomerSchema = UserSchema.shape({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phoneNumber: phoneNumberSchema,
  customerType: customerTypeSchema,
});

export const CustomerSubmitSchema = CustomerSchema.test('credentialsTaken', 'Username or email already taken', ({ email, username }, ctx) =>
  api.user.credsTaken(username as string, email as string).then((data) => {
    if (data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
);

export const AdminSchema = object().shape({
  phoneNumber: phoneNumberSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const AdminEditSchema = object().shape({
  phoneNumber: phoneNumberSchema,
  username: usernameSchema,
});

export const AdminSubmitSchema = AdminSchema.test('credentialsTaken', 'Username or email already taken', ({ email, username }, ctx) =>
  api.user.credsTaken(username as string, email as string).then((data) => {
    if (data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
);

export const WorkerSchema = object().shape({
  phoneNumber: phoneNumberSchema,
  affiliation: string().required('Affiliation can\'t be blank'),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const WorkerSubmitSchema = WorkerSchema.test('credentialsTaken', 'Username or email already taken', ({ email, username }, ctx) =>
  api.user.credsTaken(username, email).then((data) => {
    if (data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
);

export const LoginSchema = object().shape({
  usernameOrEmail: string()
    .required('Username or email can\'t be blank'),
  password: string()
    .required('Password can\'t be blank'),
});

export const ResetPasswordSchema = object().shape({
  newPassword: string()
    .required('Password can\'t be blank')
    .min(8, 'Password is too short (minimum is 8 characters)')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, 'Password must contain a uppercase letter, lowercase letter, and number.'),
  confirmNewPassword: string()
    .required('Confirm password can\'t be blank')
    .oneOf([ref('newPassword')], 'Passwords must match'),
});

export const ChangePasswordSchema = object().shape({
  oldPassword: string()
    .required('Old password can\'t be blank'),
}).concat(ResetPasswordSchema);
