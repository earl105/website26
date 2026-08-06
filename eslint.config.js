import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // Pin the TS project root to this directory. Without it, tooling infers
      // it and can pick up stray tsconfigs elsewhere in the tree (e.g. a
      // leftover git worktree), which fails with a "multiple candidate
      // TSConfigRootDirs" parsing error.
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
