import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default [
  { ignores: [".next/**", "node_modules/**", "coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: { "@next/next/no-html-link-for-pages": "off" }
  }
];
