// @ts-check

import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginTs from 'typescript-eslint'
import pluginWC from 'eslint-plugin-wc'
import pluginPrettier from 'eslint-config-prettier'

export default pluginTs.config(
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  pluginWC.configs['flat/recommended'],
  pluginPrettier
)
