import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: { tsconfigPaths: true },
    server: {
      proxy: {
        '/api': {
          target: env.BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      devtools(),
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})
