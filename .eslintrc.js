module.exports = {
  env: {
    browser: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 8,
  },
  globals: require("./p5Globals.js"),

  // require("./p5Globals.js"),
  rules: {
    "no-prototype-builtins": "off",
    indent: ["error", 2],
    quotes: [
      "error",
      "double",
      // { "avoid-escape": true, allowTemplateLiterals: true },
    ],
    semi: ["error", "always"],
    "linebreak-style": ["error", "unix"],
    // "no-unused-vars": ["error", { vars: "local" }],
    "no-console": "off",
  },
};
