import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  RefinePromptRequest,
  RatePromptRequest,
  CompilePromptRequest,
  CompilePromptResponse,
} from '../types'
import { apiRequest } from '#/shared/api'

export function fetchPrompts(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<Prompt[]> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', params.page.toString())
  if (params?.limit) query.set('limit', params.limit.toString())
  if (params?.status) query.set('status', params.status)
  const qs = query.toString()
  return apiRequest<Prompt[]>(`/prompts${qs ? `?${qs}` : ''}`)
}

export function fetchPromptById(promptId: string): Promise<Prompt> {
  return apiRequest<Prompt>(`/prompts/${promptId}`)
}

export function createPrompt(data: CreatePromptRequest): Promise<Prompt> {
  return apiRequest<Prompt>('/prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updatePrompt(
  promptId: string,
  data: UpdatePromptRequest,
): Promise<Prompt> {
  return apiRequest<Prompt>(`/prompts/${promptId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function refinePrompt(
  promptId: string,
  data: RefinePromptRequest,
): Promise<Prompt> {
  return apiRequest<Prompt>(`/prompts/${promptId}/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function ratePrompt(
  promptId: string,
  data: RatePromptRequest,
): Promise<Prompt> {
  return apiRequest<Prompt>(`/prompts/${promptId}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deletePrompt(promptId: string): Promise<void> {
  return apiRequest<void>(`/prompts/${promptId}`, { method: 'DELETE' })
}

export function compilePrompt(
  promptId: string,
  data: CompilePromptRequest,
): Promise<CompilePromptResponse> {
  return apiRequest<CompilePromptResponse>(`/prompts/${promptId}/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function recordPromptUsage(
  promptId: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/prompts/${promptId}/usage`, {
    method: 'POST',
  })
}

export function fetchPromptVersions(
  promptId: string,
): Promise<{ versions: Prompt[] }> {
  return apiRequest<{ versions: Prompt[] }>(`/prompts/${promptId}/versions`)
}

export function searchPrompts(query: string): Promise<Prompt[]> {
  return apiRequest<Prompt[]>(
    `/prompts/search?query=${encodeURIComponent(query)}`,
  )
}

export function fetchMostUsedPrompts(limit = 10): Promise<Prompt[]> {
  return apiRequest<Prompt[]>(`/prompts/trending/most-used?limit=${limit}`)
}

export function fetchHighestRatedPrompts(limit = 10): Promise<Prompt[]> {
  return apiRequest<Prompt[]>(`/prompts/trending/highest-rated?limit=${limit}`)
}

export function fetchPromptsByType(type: string): Promise<Prompt[]> {
  return apiRequest<Prompt[]>(`/prompts/type/${type}`)
}

export function fetchPromptsByCategory(category: string): Promise<Prompt[]> {
  return apiRequest<Prompt[]>(`/prompts/category/${category}`)
}

export function fetchPromptsByRole(role: string): Promise<Prompt[]> {
  return apiRequest<Prompt[]>(`/prompts/role/${role}`)
}

export function fetchPromptsByTags(tags: string[]): Promise<Prompt[]> {
  return apiRequest<Prompt[]>('/prompts/by-tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tags }),
  })
}
