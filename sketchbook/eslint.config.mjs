import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.all,

  {
    rules: {
      "no-console": "off",
      "sort-imports": "off",
      "capitalized-comments": "off",
      "func-style": "off",
      "sort-keys": "off",
      "max-statements": ["error", 100],
      "max-lines-per-function": ["error", 200],
      "max-lines": ["error", 200],
      "one-var": "off",
      "no-magic-numbers": "off",
      "no-prototype-builtins": "off",
      "curly": ["error", "multi-line"],
      "id-length": "off",
      "no-ternary": "off",
      "no-use-before-define": ["error", { functions: false, classes: false }],
      "no-plusplus": "off",
      "no-warning-comments": "off",
      "prefer-template": "off",
    },
  },
];
