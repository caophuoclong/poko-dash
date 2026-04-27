import type {
  GetContentIdeasResponse,
  PatchContentIdeasByIdeaIdRequest,
} from '#/dtos/content-ideas'
import { useApiMutation, useApiQuery } from '#/shared/hooks'
import {
  fetchContentIdeas,
  fetchContentIdea,
  createContentIdea,
  updateContentIdea,
} from '../api/content-idea-api'

export function useContentIdeas() {
  return useApiQuery(['content-ideas'], () => fetchContentIdeas(), {
    fallback: [] as unknown as GetContentIdeasResponse,
  })
}

export function useContentIdea(ideaId: string | undefined) {
  return useApiQuery(
    ['content-ideas', ideaId ?? ''],
    () => fetchContentIdea(ideaId!),
    { enabled: !!ideaId },
  )
}

export function useCreateContentIdea() {
  return useApiMutation(createContentIdea, {
    invalidateKeys: [['content-ideas']],
  })
}

export function useUpdateContentIdea() {
  return useApiMutation(
    ({
      ideaId,
      data,
    }: {
      ideaId: string
      data: PatchContentIdeasByIdeaIdRequest
    }) => updateContentIdea(ideaId, data),
    {
      invalidateKeys: [['content-ideas']],
    },
  )
}
