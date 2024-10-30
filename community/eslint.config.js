// @ts-check
import pluginJs from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress/flat";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  { ignores: ["**/dist/*", "**/node_modules/*"]},
  { languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,           // JavaScript plugin 
  ...tseslint.configs.recommended,        // TypeScript plugin
  pluginReact.configs.flat.recommended,   // React plugin
  pluginReact.configs.flat['jsx-runtime'],   // React v17+ plugin
  pluginCypress.configs.recommended,      // Cypress plugin
];