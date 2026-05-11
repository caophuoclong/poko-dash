import { useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import {
  useContentPostsControllerList,
  getContentPostsControllerListQueryKey,
  useContentPostsControllerCreate,
  useContentPostsControllerFindById,
  useContentPostsControllerPatch,
  useContentPostsControllerDelete,
  useContentPostsControllerGenerateFromProducts,
  useContentPostsControllerGenerateFromIdea,
} from '#/api/client'
import { ContentPostSchema } from '../schemas/content-post.schema'

export function useContentPosts(options?: { ideaId?: string }) {
  return useContentPostsControllerList({
    query: {
      select: (res) => ({
        data: ContentPostSchema.array().parse(res.data.data),
      }),
      placeholderData: [] as any,
    },
  })
}

export function useContentPost(postId: string) {
  return useContentPostsControllerFindById(
    postId,
    { include: 'products' },
    {
      query: {
        enabled: !!postId,
        select: (res: any) => res.data,
      },
    },
  )
}

export function useGenerateFromIdea() {
  const queryClient = useQueryClient()
  const m = useContentPostsControllerGenerateFromIdea({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentPostsControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ ideaId: variables }, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync({ ideaId: variables }, options),
  }
}

export function useGenerateContentPosts() {
  const queryClient = useQueryClient()
  const m = useContentPostsControllerGenerateFromProducts({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentPostsControllerListQueryKey(),
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

export function useCreateContentPost() {
  const queryClient = useQueryClient()
  const m = useContentPostsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentPostsControllerListQueryKey(),
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

export function useUpdateContentPost() {
  const queryClient = useQueryClient()
  const m = useContentPostsControllerPatch({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentPostsControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate(
        { postId: variables.postId, data: variables.data },
        options,
      ),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync(
        { postId: variables.postId, data: variables.data },
        options,
      ),
  }
}

export function useDeleteContentPost() {
  const queryClient = useQueryClient()
  const m = useContentPostsControllerDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getContentPostsControllerListQueryKey(),
        })
      },
    },
  })
  const { mutate: origMutate, mutateAsync: origMutateAsync, ...rest } = m
  return {
    ...rest,
    mutate: (variables: any, options?: any) =>
      origMutate({ postId: variables }, options),
    mutateAsync: (variables: any, options?: any) =>
      origMutateAsync({ postId: variables }, options),
  }
}
