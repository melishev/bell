import globals from 'globals'
import JSPlugin from '@eslint/js'
import { configs as TSConfigs } from 'typescript-eslint'
import { configs as WCConfigs } from 'eslint-plugin-wc'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  JSPlugin.configs.recommended,
  WCConfigs['flat/recommended'],
  ...TSConfigs['recommended'],
  eslintConfigPrettier,
]
