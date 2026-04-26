// layer: logic
import { apiRequest } from './api'

export function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return ''
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value))
    }
  })
  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchResource<T>(
  path: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return apiRequest<T>(`${path}${buildQueryString(params)}`)
}

export async function createResource<T, TData = T>(
  path: string,
  data: unknown,
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateResource<T>(
  path: string,
  data: unknown,
): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteResource(path: string): Promise<void> {
  return apiRequest<void>(path, { method: 'DELETE' })
}
