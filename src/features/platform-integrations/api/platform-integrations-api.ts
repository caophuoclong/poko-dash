import type {
  GetPlatformIntegrationsResponse,
  GetPlatformIntegrationResponse,
  PostPlatformIntegrationsRequest,
  PostPlatformIntegrationsResponse,
  PostIntegrationReconnectResponse,
  PostOAuthStartResponse,
  GetAvailableTargetsResponse,
  PlatformProvider,
} from '#/dtos/platform-integrations'

const API_BASE = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000'

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, init)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export function fetchPlatformIntegrations(params?: {
  page?: number
  limit?: number
  provider?: string
  status?: string
}): Promise<GetPlatformIntegrationsResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', params.page.toString())
  if (params?.limit) query.set('limit', params.limit.toString())
  if (params?.provider) query.set('provider', params.provider)
  if (params?.status) query.set('status', params.status)
  const qs = query.toString()
  return apiRequest<GetPlatformIntegrationsResponse>(
    `/platform-integrations${qs ? `?${qs}` : ''}`,
  )
}

export function fetchPlatformIntegration(
  id: string,
): Promise<GetPlatformIntegrationResponse> {
  return apiRequest<GetPlatformIntegrationResponse>(
    `/platform-integrations/${id}`,
  )
}

export function createPlatformIntegrations(
  data: PostPlatformIntegrationsRequest,
): Promise<PostPlatformIntegrationsResponse> {
  return apiRequest<PostPlatformIntegrationsResponse>(
    '/platform-integrations',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )
}

export function reconnectIntegration(
  id: string,
): Promise<PostIntegrationReconnectResponse> {
  return apiRequest<PostIntegrationReconnectResponse>(
    `/platform-integrations/${id}/reconnect`,
    { method: 'POST' },
  )
}

export function deleteIntegration(id: string): Promise<void> {
  return apiRequest<void>(`/platform-integrations/${id}`, {
    method: 'DELETE',
  })
}

export function startOAuthConnect(
  provider: PlatformProvider,
  redirectUri: string,
): Promise<PostOAuthStartResponse> {
  return apiRequest<PostOAuthStartResponse>('/platform-oauth/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, redirectUri }),
  })
}

export function fetchAvailableTargets(
  provider: PlatformProvider,
  code: string,
): Promise<GetAvailableTargetsResponse> {
  return apiRequest<GetAvailableTargetsResponse>(
    `/platform-oauth/available-targets`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, code }),
    },
  )
}
