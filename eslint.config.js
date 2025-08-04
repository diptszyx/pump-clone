import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
  {
    plugins: {
      next: nextPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
