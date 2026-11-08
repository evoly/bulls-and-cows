const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');

module.exports = [
    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ['**/*.js', '**/*.ts'],
        languageOptions: {
            // Объединяем глобальные переменные браузера и node, если нужно
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-var': 'error',
            'prefer-const': 'error',
            'no-console': 'warn',
        },
    },
    prettier,
];
