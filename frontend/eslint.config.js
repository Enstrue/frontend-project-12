import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginFunctional from 'eslint-plugin-functional';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: pluginReact,
      functional: pluginFunctional,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'react/prop-types': 0,
      'no-console': 0,
      'react/react-in-jsx-scope': 0,
      'functional/no-conditional-statements': 0,
      'functional/no-expression-statements': 0,
      'functional/immutable-data': 0,
      'functional/functional-parameters': 0,
      'functional/no-try-statements': 0,
      'functional/no-throw-statements': 0,
      'functional/no-return-void': 0,
      'no-underscore-dangle': [2, { 'allow': ['__filename', '__dirname'] }],
      'react/function-component-definition': [2, { 'namedComponents': 'arrow-function' }],
      'testing-library/no-debug': 0,
      'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }]
    },
  }
];
