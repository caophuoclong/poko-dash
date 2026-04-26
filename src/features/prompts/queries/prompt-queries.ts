import { queryOptions } from '@tanstack/react-query'
import { fetchPrompts, fetchPromptById } from '../api/prompt-api'
import type { Prompt } from '../types/prompt'

export const promptsQueryOptions = (params?: {
  page?: number
  limit?: number
  status?: string
}) =>
  queryOptions<Prompt[]>({
    queryKey: ['prompts', params ?? {}],
    queryFn: () => fetchPrompts(params),
    staleTime: 30_000,
  })

export const promptQueryOptions = (promptId: string) =>
  queryOptions<Prompt>({
    queryKey: ['prompts', promptId],
    queryFn: () => fetchPromptById(promptId),
    enabled: !!promptId,
    staleTime: 30_000,
  })
