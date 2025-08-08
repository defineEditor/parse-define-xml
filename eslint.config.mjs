import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, prettier, {
    rules: {
        "no-restricted-imports": [
            "error",
            {
                patterns: [".*"],
            },
        ],
        "no-trailing-spaces": "error",
        "func-style": ["error", "expression"],
        indent: ["error", 4],
    },
});
