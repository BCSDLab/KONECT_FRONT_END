import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import pluginQuery from '@tanstack/eslint-plugin-query';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      ...pluginQuery.configs['flat/recommended-strict'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/return-await': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'type', 'index'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'after' },

            { pattern: '**/*.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: './**/*.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: '*.{css,scss,sass}', group: 'index', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': 'error',
      'no-void': 'error',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/utils/ts/nativeBridge.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'ReactNativeWebView',
          message: 'ReactNativeWebView 브릿지는 @/utils/ts/nativeBridge를 통해서만 사용하세요.',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/apis/auth/index.ts', 'src/apis/client.ts', 'src/components/notification/hooks/useInboxNotificationStream.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.type='Identifier'][callee.name='fetch']",
          message: 'fetch 직접 호출 대신 apiClient를 사용하세요. 예외가 필요한 경우 허용 파일에서만 사용하세요.',
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='window'][callee.property.type='Identifier'][callee.property.name='fetch']",
          message: 'fetch 직접 호출 대신 apiClient를 사용하세요. 예외가 필요한 경우 허용 파일에서만 사용하세요.',
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='globalThis'][callee.property.type='Identifier'][callee.property.name='fetch']",
          message: 'fetch 직접 호출 대신 apiClient를 사용하세요. 예외가 필요한 경우 허용 파일에서만 사용하세요.',
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name='self'][callee.property.type='Identifier'][callee.property.name='fetch']",
          message: 'fetch 직접 호출 대신 apiClient를 사용하세요. 예외가 필요한 경우 허용 파일에서만 사용하세요.',
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
