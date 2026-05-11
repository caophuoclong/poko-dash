import { useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import {
  useContentIdeasControllerListPaginated,
  getContentIdeasControllerListPaginatedQueryKey,
  useContentIdeasControllerCreate,
  useContentIdeasControllerFindById,
  useContentIdeasControllerUpdate,
  useContentIdeasControllerGenerateIdeas,
  useContentIdeasControllerDelete,
} from '#/api/client'

export function useContentIdeas() {
  return useContentIdeasControllerListPaginated(undefined, {
    query: {
      select: (res) => {
        console.log('🚀 ~ useContentIdeas ~ res:', res)

        return res.data
      },
      placeholderData: [] as any,
    },
  })
}

export function useContentIdea(ideaId: string | undefined) {
  return useContentIdeasControllerFindById(ideaId ?? '', {
    query: {
      enabled: !!ideaId,
      select: (res: any) => res.data,
    },
  })
}

export function useCreateContentIdea() {
  const queryClient = useQueryClient()
  const m = useContentIdeasControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentIdeasControllerListPaginatedQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ data: variables }, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync({ data: variables }, options),
  }
}

export function useUpdateContentIdea() {
  const queryClient = useQueryClient()
  const m = useContentIdeasControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentIdeasControllerListPaginatedQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate(
        { ideaId: variables.ideaId, data: variables.data },
        options,
      ),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync(
        { ideaId: variables.ideaId, data: variables.data },
        options,
      ),
  }
}

export function useGenerateContentIdeas() {
  const queryClient = useQueryClient()
  const m = useContentIdeasControllerGenerateIdeas({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentIdeasControllerListPaginatedQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ data: variables }, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync({ data: variables }, options),
  }
}

export function useDeleteContentIdea() {
  const queryClient = useQueryClient()
  return useContentIdeasControllerDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentIdeasControllerListPaginatedQueryKey(),
        })
      },
    },
  })
}
