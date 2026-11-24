import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import wallhavenHandler from './api/wallhaven.js'

function localWallhavenApi() {
  return {
    name: 'heywalls-local-wallhaven-api',
    configureServer(server) {
      server.middlewares.use('/api/wallhaven', async (request, response) => {
        const url = new URL(request.url || '/', 'http://localhost')
        const query = Object.fromEntries(url.searchParams.entries())
        const apiResponse = {
          statusCode: 200,
          headers: {},
          setHeader(name, value) {
            this.headers[name] = value
            return this
          },
          status(code) {
            this.statusCode = code
            return this
          },
          json(payload) {
            response.statusCode = this.statusCode
            for (const [name, value] of Object.entries(this.headers)) response.setHeader(name, value)
            response.setHeader('Content-Type', 'application/json; charset=utf-8')
            response.end(JSON.stringify(payload))
          },
        }

        try {
          await wallhavenHandler({ method: request.method, query }, apiResponse)
        } catch {
          response.statusCode = 500
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ error: 'Could not load wallpapers. Please try again shortly.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localWallhavenApi()],
})
