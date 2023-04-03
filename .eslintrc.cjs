module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
};
