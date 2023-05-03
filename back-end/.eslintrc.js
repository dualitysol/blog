module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "prettier"],
  env: {
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ["tests/*.spec.js"], // Or *.test.js
      rules: {
        "require-jsdoc": "off",
      },
    },
  ],
};
