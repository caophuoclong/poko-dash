import type {
  GetContentIdeasResponse,
  PatchContentIdeasByIdeaIdRequest,
} from '#/dtos/content-ideas'
import { useApiMutation, useApiQuery } from '#/hooks/use-api-query'
import { MOCK_CONTENT_IDEAS } from '#/shared/mock-data'
import {
  fetchContentIdeas,
  createContentIdea,
  updateContentIdea,
} from '../api/content-idea-api'

export function useContentIdeas() {
  return useApiQuery(
    ['content-ideas'],
    async () => {
      const ideas = await fetchContentIdeas()
      return ideas.length > 0
        ? ideas
        : (MOCK_CONTENT_IDEAS as GetContentIdeasResponse)
    },
    { fallback: MOCK_CONTENT_IDEAS as GetContentIdeasResponse },
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
