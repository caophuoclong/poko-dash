import { ApiError } from './errors'

const API_BASE = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000'

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, init)
  if (!res.ok) {
    throw await ApiError.fromResponse(res)
  }
  return res.json() as Promise<T>
}
