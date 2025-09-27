import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      'no-console': 'off',
      'react/prop-types': 'off',
    },
    plugins: {
      react: reactPlugin,
    },
  },
];