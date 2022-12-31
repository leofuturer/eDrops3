module.exports = {
  env: {
    browser: true,
    es2022: true,
    'cypress/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    'cypress'
  ],
  rules: {
    'max-len': ['error', { code: 130 }],
    'linebreak-style': ['off'],
  },
};
