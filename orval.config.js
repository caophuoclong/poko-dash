import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: './openapi.json',
    output: {
      target: './src/api/client.ts',
      schemas: './src/api/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
})
