import { createFileRoute } from '@tanstack/react-router'

// Hop-by-hop headers that must not be forwarded
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
])

async function proxyRequest(request: Request): Promise<Response> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'
  const url = new URL(request.url)
  const target = `${backendUrl}${url.pathname}${url.search}`

  const headers = new Headers()
  for (const [key, value] of request.headers.entries()) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  }

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  })

  const responseHeaders = new Headers()
  for (const [key, value] of upstream.headers.entries()) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      responseHeaders.set(key, value)
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: ({ request }) => proxyRequest(request),
      POST: ({ request }) => proxyRequest(request),
      PUT: ({ request }) => proxyRequest(request),
      PATCH: ({ request }) => proxyRequest(request),
      DELETE: ({ request }) => proxyRequest(request),
    },
  },
})
