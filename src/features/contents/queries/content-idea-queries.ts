import { queryOptions } from '@tanstack/react-query'
import { fetchContentIdeas, fetchContentIdea } from '../api/content-idea-api'
import type { GetContentIdeasResponse } from '#/dtos/content-ideas'

export const contentIdeasQueryOptions = (params?: {
  page?: number
  limit?: number
  status?: string
}) =>
  queryOptions<GetContentIdeasResponse>({
    queryKey: ['content-ideas', params ?? {}],
    queryFn: () => fetchContentIdeas(params),
    staleTime: 30_000,
  })

export const contentIdeaQueryOptions = (ideaId: string) =>
  queryOptions<GetContentIdeasResponse[number]>({
    queryKey: ['content-ideas', ideaId],
    queryFn: () => fetchContentIdea(ideaId),
    enabled: !!ideaId,
    staleTime: 30_000,
  })
