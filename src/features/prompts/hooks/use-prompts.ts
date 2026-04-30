import { useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import {
  usePromptsControllerList,
  getPromptsControllerListQueryKey,
  usePromptsControllerCreate,
  usePromptsControllerFindById,
  usePromptsControllerUpdate,
  usePromptsControllerDelete,
  usePromptsControllerCompile,
  usePromptsControllerRecordUsage,
  usePromptsControllerRefine,
  usePromptsControllerRatePrompt,
  usePromptsControllerSearch,
  usePromptsControllerMostUsed,
  usePromptsControllerHighestRated,
  usePromptsControllerGetVersionHistory,
} from '#/api/client'

export function usePrompts(params?: { status?: string }) {
  return usePromptsControllerList({
    query: {
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function usePrompt(promptId: string) {
  return usePromptsControllerFindById(promptId, {
    query: {
      enabled: !!promptId,
      select: (res: any) => res.data,
    },
  })
}

export function useMostUsedPrompts(limit = 10) {
  return usePromptsControllerMostUsed({
    query: {
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function useHighestRatedPrompts(limit = 10) {
  return usePromptsControllerHighestRated({
    query: {
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function usePromptVersions(promptId: string) {
  return usePromptsControllerGetVersionHistory(promptId, {
    query: {
      enabled: !!promptId,
      select: (res: any) => res.data,
      placeholderData: { versions: [] } as any,
    },
  })
}

export function useSearchPrompts(query: string) {
  return usePromptsControllerSearch({
    query: {
      enabled: query.length > 1,
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

function wrapMutation<T extends { mutate: any; mutateAsync: any }>(
  m: T,
  wrapper: (variables: any) => any,
): UseMutationResult<any, any, any> {
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m as any
  return {
    ...rest,
    mutate: (variables: any, options?: any) => origMutate(wrapper(variables), options),
    mutateAsync: (variables: any, options?: any) => origMutateAsync(wrapper(variables), options),
  } as UseMutationResult<any, any, any>
}

export function useCreatePrompt() {
  const queryClient = useQueryClient()
  return wrapMutation(
    usePromptsControllerCreate({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPromptsControllerListQueryKey(),
          })
        },
      },
    }),
    (data: any) => ({ data }),
  )
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient()
  return wrapMutation(
    usePromptsControllerUpdate({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPromptsControllerListQueryKey(),
          })
        },
      },
    }),
    (v: any) => ({ promptId: v.promptId, data: v.data }),
  )
}

export function useDeletePrompt() {
  const queryClient = useQueryClient()
  return wrapMutation(
    usePromptsControllerDelete({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPromptsControllerListQueryKey(),
          })
        },
      },
    }),
    (promptId: any) => ({ promptId }),
  )
}

export function useCompilePrompt() {
  return usePromptsControllerCompile()
}

export function useRecordPromptUsage() {
  const queryClient = useQueryClient()
  return wrapMutation(
    usePromptsControllerRecordUsage({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPromptsControllerListQueryKey(),
          })
        },
      },
    }),
    (promptId: any) => ({ promptId }),
  )
}

export function useRefinePrompt() {
  const queryClient = useQueryClient()
  return wrapMutation(
    usePromptsControllerRefine({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPromptsControllerListQueryKey(),
          })
        },
      },
    }),
    (v: any) => ({ promptId: v.promptId, data: v.data }),
  )
}

export function useRatePrompt() {
  const queryClient = useQueryClient()
  return wrapMutation(
    usePromptsControllerRatePrompt({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getPromptsControllerListQueryKey(),
          })
        },
      },
    }),
    (v: any) => ({ promptId: v.promptId, data: v.data }),
  )
}
