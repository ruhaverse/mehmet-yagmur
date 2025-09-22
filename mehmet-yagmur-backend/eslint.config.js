import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error',
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
];
