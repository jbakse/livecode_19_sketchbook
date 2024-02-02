module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "17.00",
    },
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    jsx: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
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
