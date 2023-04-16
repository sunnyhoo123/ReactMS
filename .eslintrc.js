module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['react/recommended', 'airbnb', 'prettier', 'prettier/react'],
  // settings: {
  //   'import/resolver': {
  //     node: {
  //       path: ['src'],
  //       extensions: ['.js', '.jsx'],
  //     },
  //   },
  // },
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }], 'react-hooks/exhaustive-deps': 'error' },
};
