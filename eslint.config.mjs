import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist", "node_modules"] },

    ...tseslint.configs.recommended,

    {
        files: ["**/*.{ts,js,mjs}"],
        plugins: {
            "unused-imports": unusedImports,
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            // Double quotes
            quotes: ["error", "double"],

            // 4-space indent
            indent: ["error", 4],

            // No trailing spaces
            "no-trailing-spaces": "error",

            // Remove unused variables (plugin replaces core rule)
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            // Remove unused imports
            "unused-imports/no-unused-imports": "error",

            // Sort and group imports
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            // General good practices
            eqeqeq: ["error", "always"],
            curly: "error",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "error",
            "prefer-const": "error",
            "no-var": "error",
        },
    },

    // Must be last: disables formatting rules that conflict with Prettier
    eslintConfigPrettier,
);
