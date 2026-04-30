import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  usePostPublicationsControllerListForPost,
  getPostPublicationsControllerListForPostQueryKey,
} from '#/api/client'

export function usePublications(postId: string) {
  return usePostPublicationsControllerListForPost(postId, {
    query: {
      enabled: !!postId,
      select: (res: any) => res.data,
      placeholderData: [] as any,
    },
  })
}

export function useRetryPublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (publicationId: string) => {
      const res = await fetch(`/api/publications/${publicationId}/retry`, {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error(`Retry publication failed: ${res.status}`)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getPostPublicationsControllerListForPostQueryKey('')[0]],
      })
    },
  })
}
