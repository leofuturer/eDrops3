module.exports = {
  env: {
    commonjs: true,
    es2017: true,
    node: true,
  },
  extends: [
    '@loopback/eslint-config'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'linebreak-style': ['off'],
    'no-param-reassign': 0,
    'max-len': 'off',
    // 'max-len': ['error', { code: 120 }],
    // TODO: Fix these linting issues
    '@typescript-eslint/naming-convention': 'off', // Need to standardize naming conventions
    '@typescript-eslint/no-floating-promises': 'off', // Need to fix floating promises
    'no-useless-catch': 'off', // Need to fix useless catch
    '@typescript-eslint/ban-ts-comment': 'off', // Need to check if ts-ignore is used only when needed
    '@typescript-eslint/no-unused-vars': 'off', // Fix unused variables
    'no-await-in-loop': 'off', // Need to fix await in loops, use Promise.all instead
    'no-restricted-syntax': 'off', // Need to fix for loops, same as above
    'no-async-promise-executor': 'off', // Need to fix async/await, same as above
    'class-methods-use-this': 'off', // Need to fix class methods
    'no-useless-return': 'off', // Need to fix useless returns (some unimplemented functions)
    '@typescript-eslint/no-shadow': 'off', // Need to fix shadowing (variables using the same name)
    'arrow-body-style': 'off', // Need to fix arrow functions
    'no-prototype-builtins': 'off', // Need to fix prototype builtins
    // Loopback specific linting rules
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
  },
};
