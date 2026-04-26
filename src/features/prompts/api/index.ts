// layer: logic
import { fetchResource, createResource, updateResource, deleteResource } from '@/shared/api-client'
import type { Prompt, CreatePromptRequest, UpdatePromptRequest, RefinePromptRequest, RatePromptRequest, CompilePromptRequest, CompilePromptResponse } from '../types'

export function fetchPrompts(params?: { page?: number; limit?: number; status?: string }): Promise<Prompt[]> {
  return fetchResource<Prompt[]>('/prompts', params)
}

export function fetchPromptById(promptId: string): Promise<Prompt> {
  return fetchResource<Prompt>(`/prompts/${promptId}`)
}

export function createPrompt(data: CreatePromptRequest): Promise<Prompt> {
  return createResource<Prompt, CreatePromptRequest>('/prompts', data)
}

export function updatePrompt(promptId: string, data: UpdatePromptRequest): Promise<Prompt> {
  return updateResource<Prompt>(`/prompts/${promptId}`, data)
}

export function refinePrompt(promptId: string, data: RefinePromptRequest): Promise<Prompt> {
  return createResource<Prompt, { changes: UpdatePromptRequest }>(`/prompts/${promptId}/refine`, { changes: data })
}

export function ratePrompt(promptId: string, data: RatePromptRequest): Promise<Prompt> {
  return createResource<Prompt, RatePromptRequest>(`/prompts/${promptId}/rate`, data)
}

export function deletePrompt(promptId: string): Promise<void> {
  return deleteResource(`/prompts/${promptId}`)
}

export function compilePrompt(promptId: string, data: CompilePromptRequest): Promise<CompilePromptResponse> {
  return createResource<CompilePromptResponse, CompilePromptRequest>(`/prompts/${promptId}/compile`, data)
}

export function recordPromptUsage(promptId: string): Promise<{ message: string }> {
  return createResource<{ message: string }, void>(`/prompts/${promptId}/usage`, undefined)
}

export function fetchPromptVersions(promptId: string): Promise<{ versions: Prompt[] }> {
  return fetchResource<{ versions: Prompt[] }>(`/prompts/${promptId}/versions`)
}

export function searchPrompts(query: string): Promise<Prompt[]> {
  return fetchResource<Prompt[]>(`/prompts/search`, { query })
}

export function fetchMostUsedPrompts(limit = 10): Promise<Prompt[]> {
  return fetchResource<Prompt[]>(`/prompts/trending/most-used`, { limit })
}

export function fetchHighestRatedPrompts(limit = 10): Promise<Prompt[]> {
  return fetchResource<Prompt[]>(`/prompts/trending/highest-rated`, { limit })
}

export function fetchPromptsByType(type: string): Promise<Prompt[]> {
  return fetchResource<Prompt[]>(`/prompts/type/${type}`)
}

export function fetchPromptsByCategory(category: string): Promise<Prompt[]> {
  return fetchResource<Prompt[]>(`/prompts/category/${category}`)
}

export function fetchPromptsByRole(role: string): Promise<Prompt[]> {
  return fetchResource<Prompt[]>(`/prompts/role/${role}`)
}

export function fetchPromptsByTags(tags: string[]): Promise<Prompt[]> {
  return createResource<Prompt[], { tags: string[] }>('/prompts/by-tags', { tags })
}
