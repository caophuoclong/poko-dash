import { fetchPublications, retryPublication } from '../api/publication-api'
import { useApiQuery, useApiMutation } from '#/shared/hooks'

export function usePublications(postId: string) {
  return useApiQuery(
    ['publications', postId],
    () => fetchPublications(postId),
    { enabled: !!postId, fallback: [] },
  )
}

export function useRetryPublication() {
  return useApiMutation(retryPublication, {
    invalidateKeys: [['publications']],
  })
}
