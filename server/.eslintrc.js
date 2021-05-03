module.exports = {
  env: {
    commonjs: true,
    es2017: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'loopback',
  ],
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    'linebreak-style': ['off'],
    'no-param-reassign': 0,
    'max-len': ['error', {code: 120}],
  },
};
