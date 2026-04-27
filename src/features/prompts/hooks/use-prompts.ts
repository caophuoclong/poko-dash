// layer: logic
import { useApiQuery, useApiMutation } from '#/shared/hooks'
import type { CreatePromptRequest, UpdatePromptRequest } from '../types'
import * as promptApi from '../api/prompt-api'

export function usePrompts(params?: { status?: string }) {
  return useApiQuery(
    ['prompts', params],
    () => promptApi.fetchPrompts(params),
    { fallback: [] },
  )
}

export function usePrompt(promptId: string) {
  return useApiQuery(
    ['prompts', promptId],
    () => promptApi.fetchPromptById(promptId),
    { enabled: !!promptId, silentError: false },
  )
}

export function useMostUsedPrompts(limit = 10) {
  return useApiQuery(
    ['prompts', 'trending', 'most-used', limit],
    () => promptApi.fetchMostUsedPrompts(limit),
    { fallback: [] },
  )
}

export function useHighestRatedPrompts(limit = 10) {
  return useApiQuery(
    ['prompts', 'trending', 'highest-rated', limit],
    () => promptApi.fetchHighestRatedPrompts(limit),
    { fallback: [] },
  )
}

export function usePromptVersions(promptId: string) {
  return useApiQuery(
    ['prompts', promptId, 'versions'],
    () => promptApi.fetchPromptVersions(promptId),
    { enabled: !!promptId, fallback: { versions: [] } },
  )
}

export function useSearchPrompts(query: string) {
  return useApiQuery(
    ['prompts', 'search', query],
    () => promptApi.searchPrompts(query),
    { enabled: query.length > 1, fallback: [] },
  )
}

export function useCreatePrompt() {
  return useApiMutation(
    (data: CreatePromptRequest) => promptApi.createPrompt(data),
    {
      invalidateKeys: [['prompts']],
    },
  )
}

export function useUpdatePrompt() {
  return useApiMutation(
    ({ promptId, data }: { promptId: string; data: UpdatePromptRequest }) =>
      promptApi.updatePrompt(promptId, data),
    { invalidateKeys: [['prompts']] },
  )
}

export function useDeletePrompt() {
  return useApiMutation(
    (promptId: string) => promptApi.deletePrompt(promptId),
    {
      invalidateKeys: [['prompts']],
    },
  )
}

export function useCompilePrompt() {
  return useApiMutation(
    ({
      promptId,
      data,
    }: {
      promptId: string
      data: { variables: Record<string, unknown> }
    }) => promptApi.compilePrompt(promptId, data),
  )
}

export function useRecordPromptUsage() {
  return useApiMutation(
    (promptId: string) => promptApi.recordPromptUsage(promptId),
    {
      invalidateKeys: [['prompts']],
    },
  )
}

export function useRefinePrompt() {
  return useApiMutation(
    ({
      promptId,
      data,
    }: {
      promptId: string
      data: { changes: Partial<CreatePromptRequest> }
    }) => promptApi.refinePrompt(promptId, data),
    { invalidateKeys: [['prompts']] },
  )
}

export function useRatePrompt() {
  return useApiMutation(
    ({ promptId, data }: { promptId: string; data: { rating: number } }) =>
      promptApi.ratePrompt(promptId, data),
    { invalidateKeys: [['prompts']] },
  )
}
