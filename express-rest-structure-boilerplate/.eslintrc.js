module.exports = {
  env: {
    es6: true,
    node: true,
    // mocha: true, can be also set
  },
  extends: ['eslint:recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  globals: {
    describe: true,
    it: true,
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
  },
};
