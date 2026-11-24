import { fileURLToPath, URL } from 'node:url'

import { defineConfig, lazyPlugins } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import fmtConfig from './fmt.config'
import lintConfig from './lint.config'

// https://vite.dev/config/
export default defineConfig({
  base: '/cv/',
  staged: {
    '*': 'vp check --fix',
  },
  fmt: fmtConfig,
  lint: {
    ...lintConfig,
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  plugins: lazyPlugins(() => [vue(), vueDevTools({ launchEditor: 'zed' })]),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
