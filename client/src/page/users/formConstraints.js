const constraints = {
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
      message: 'must only contain a-z, A-Z, 0-9 and _',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
    },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
      message: 'must at least contain a capital letter, a lowercase letter, a number, and be at least 8 characters long',
    },
  },
  confirmPassword: {
    presence: true,
    equality: {
      attribute: 'password',
      message: '^Two passwords do not match',
    },
  },
  // Add simple phone number validation - DY 4/14/2020
  phoneNumber: {
    format: {
      pattern: /^[^a-wA-WyzYZ]{10,}$/,
      message: "must not contain letters, except 'x' for extensions. Include area code, and if outside US, also country code",
    },
  },
  firstName: {
    presence: true,
  },
  lastName: {
    presence: true,
  },
  userType: {
    presence: true,
  },
};

export default constraints;
