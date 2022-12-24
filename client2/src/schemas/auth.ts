import * as Yup from 'yup';
import API from '../api/api';
import { customerCredsTaken } from '../api/serverConfig';

export const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email can\'t be blank'),
  username: Yup.string()
    .required('Username can`t be blank')
    .min(4, 'Username is too short (minimum is 4 characters)')
    .max(16, 'Username is too long (maximum is 16 characters)')
    .matches(/^[a-z0-9_]{4,16}$/i, 'Username must only contain a-z, A-Z, 0-9 and _'),
  password: Yup.string()
    .required('Password can\'t be blank')
    .min(8, 'Password is too short (minimum is 8 characters)')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, 'Password must contain a uppercase letter, lowercase letter, and number.'),
  confirmPassword: Yup.string()
    .required('Confirm password can\'t be blank')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  phoneNumber: Yup.string()
    .test('phoneNumber', 'Phone number must be valid', (value) => {
      if (!value) return true
      return /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
    }),
  // .notRequired()
  // .matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Phone number must be valid'),
  firstName: Yup.string()
    .required('First name can\'t be blank'),
  lastName: Yup.string()
    .required('Last name can\'t be blank'),
  customerType: Yup.string()
    .required('Customer type can\'t be blank'),
});

export const SignupSubmitSchema = SignupSchema.test('credentialsTaken', 'Username or email already taken', async ({ email, username }, ctx) =>
  API.Request(customerCredsTaken, 'POST', { username, email }, false).then((res) => {
    if (res.data.emailTaken) return ctx.createError({ path: 'email', message: 'Email already taken' })
    if (res.data.usernameTaken) return ctx.createError({ path: 'username', message: 'Username already taken' })
    return true
  })
); // https://github.com/jaredpalmer/formik/issues/2146#issuecomment-720639988

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
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});