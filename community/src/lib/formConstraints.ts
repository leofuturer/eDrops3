export const signUpConstraints = {
  email: {
    presence: true,
    email: true,
  },
  username: {
    presence: true,
    length: {
      minimum: 4,
      maximum: 16,
    },
    format: {
      pattern: /^[a-z0-9_]{4,16}$/i,
      message: 'must only contain alphanumeric characters and underscores',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
    },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/,
      message: 'must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long',
    },
  },
  confirmPassword: {
    presence: true,
    equality: {
      attribute: 'password',
      message: 'must match password',
    },
  },
  phoneNumber: {
    format: {
      pattern: /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      message: 'must be a valid phone number',
    },
  },
  // firstName: {
  //   presence: true,
  // },
  // lastName: {
  //   presence: true,
  // },
};
