import { queryOptions } from '@tanstack/react-query'
import { fetchContentIdeas } from '../api/content-idea-api'
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
