// @ts-check
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import reactCompilerPlugin from "eslint-plugin-react-compiler";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const typeCheckedFiles = ["**/*.{ts,tsx}"];

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "web-build/**",
      ".expo/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "expo-env.d.ts",
      "eslint.config.mjs",
      "metro.config.js",
      "postcss.config.mjs",
      "**/graphql/**",
      "**/chromatic.config.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: typeCheckedFiles,
  })),
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: typeCheckedFiles,
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: typeCheckedFiles,
  })),
  eslintConfigPrettier,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-compiler": reactCompilerPlugin,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          singleAttributePerLine: true,
        },
      ],
      "max-lines": [
        "error",
        {
          max: 1000,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 0,
          maxBOF: 0,
        },
      ],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      eqeqeq: "error",
      "import/no-default-export": "error",
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/export": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-compiler/react-compiler": "error",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "prefer-const": "error",
    },
  },
  {
    files: typeCheckedFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unnecessary-template-expression": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-unsafe-enum-comparison": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
    },
  },
  {
    files: [
      "**/components/**/*.{js,jsx,ts,tsx}",
      "**/atoms/**/*.{js,jsx,ts,tsx}",
      "**/screens/**/*.{js,jsx,ts,tsx}",
      "**/contents/**/*.{js,jsx,ts,tsx}",
      "**/hooks/**/*.{js,jsx,ts,tsx}",
    ],
    rules: {
      "max-lines": [
        "error",
        {
          max: 700,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: [
      "**/app/**/*.{js,jsx,ts,tsx}",
      "**/*.stories.{js,jsx,ts,tsx}",
      "**/*.config.{js,mjs,cjs,ts}",
      "**/*.d.ts",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
);
