import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules'] },

  // Browser app + shipped browser-side skill assets (src/, grid/assets/).
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Injected by vite.config.js `define`.
        __SKILL_MTIME__: 'readonly',
        __SKILL_VERSION__: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Allow intentionally-unused capitalized/underscored identifiers; ignore
      // unused catch bindings (best-effort `catch (e) {}` cleanup blocks).
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // Empty `catch {}` is a deliberate best-effort pattern in this codebase.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Advisory React Hooks v7 rules: surface as warnings rather than fail on
      // working patterns (recursive requestAnimationFrame; prop→state sync).
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  // Node-side tooling: ESM config + CommonJS installer.
  {
    files: ['vite.config.js'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  {
    files: ['bin/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
]
