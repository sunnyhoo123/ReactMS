module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:storybook/recommended'],
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
  ignorePatterns: ['*/App.js', 'src/index.js'],
  plugins: ['prettier'],
  rules: { eqeqeq: 'off', curly: 'error', quotes: ['error', 'double'] },
};
