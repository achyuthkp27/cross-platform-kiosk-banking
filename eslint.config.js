const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = tseslint.config(
    {
        ignores: ['node_modules/', 'dist/', 'build/', '.expo/', 'web-build/'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },
        rules: {
            // React rules
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,

            // Prettier integration (manually disable conflicting rules if needed, but using Prettier separately is often cleaner)
            // We will rely on running prettier check separately or using the prettier config if we want to run it via eslint

            'react/react-in-jsx-scope': 'off', // Not needed for React 17+
            'react/prop-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            // Disable overly strict rule - the patterns used in this codebase are valid
            // (conditional setState, initialization from localStorage, etc.)
            'react-hooks/set-state-in-effect': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    prettierConfig, // Disables eslint rules that conflict with prettier
);
