const addConstraints = {
  phoneNumber: {
    presence: true,
    format: {
      pattern: /^\+?(\d{1,2})?\s??1?\-?\.?\s?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // see https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number (note I modified it to add capturing groups)
      message: 'must be a valid phone number',
    },
  },
  realm: {
    presence: false,
  },
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
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/,
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
};

const editConstraints = {
  phoneNumber: {
    presence: true,
    format: {
      pattern: /^\+?(\d{1,2})?\s??1?\-?\.?\s?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/, // see https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number (note I modified it to add capturing groups)
      message: 'must be a valid phone number',
    },
  },
  realm: {
    presence: false,
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
};

export { addConstraints, editConstraints };
