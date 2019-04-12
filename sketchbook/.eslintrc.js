module.exports = {
  extends: "eslint:recommended",
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "no-unused-vars": ["error", { vars: "local" }],
    "no-console": "off",
  },
};
