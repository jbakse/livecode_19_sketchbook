module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["eslint:recommended"],

  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    jsx: true,
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "no-unused-vars": 0, //["error", { vars: "local" }],
    "no-console": "off",
    "no-prototype-builtins": "off",
    "sort-inputs": "off",
  },
};
