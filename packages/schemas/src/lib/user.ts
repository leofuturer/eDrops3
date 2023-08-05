import * as Yup from 'yup';

export const emailSchema = Yup.string()
  .email('Invalid email')
  .required('Email can\'t be blank');

export const usernameSchema = Yup.string()
  .required('Username can`t be blank')
  .min(4, 'Username is too short (minimum is 4 characters)')
  .max(16, 'Username is too long (maximum is 16 characters)')
  .matches(/^[a-z0-9_]{4,16}$/i, 'Username must only contain a-z, A-Z, 0-9 and _');

export const passwordSchema = Yup.string()
  .required('Password can\'t be blank')
  .min(8, 'Password is too short (minimum is 8 characters)')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, 'Password must contain a uppercase letter, lowercase letter, and number.');

export const confirmPasswordSchema = Yup.string()
  .required('Confirm password can\'t be blank')
  .oneOf([Yup.ref('password')], 'Passwords must match');

export const phoneNumberSchema = Yup.string()
  .test('phoneNumber', 'Phone number must be valid', (value) => {
    if (!value) return true
    return /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
  });
// .notRequired()
// .matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Phone number must be valid')

export const firstNameSchema = Yup.string()
  .required('First name can\'t be blank')

export const lastNameSchema = Yup.string()
  .required('Last name can\'t be blank')

export const customerTypeSchema = Yup.string()
  .required('Customer type can\'t be blank')
  .oneOf(['person', 'company'], 'Customer type must be either person or company')