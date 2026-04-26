import { queryOptions } from '@tanstack/react-query'
import { fetchContentPost, fetchContentPosts } from '../api/content-post-api'
import { fetchContentIdeas } from '#/features/contents/api/content-idea-api'
import type {
  GetContentPostsResponse,
  GetContentPostsByPostIdResponse,
} from '#/dtos/content-posts'
import type { GetContentIdeasResponse } from '#/dtos/content-ideas'

export const contentIdeasQueryOptions = () =>
  queryOptions<GetContentIdeasResponse>({
    queryKey: ['content-ideas'],
    queryFn: () => fetchContentIdeas(),
    staleTime: 30_000,
  })

export const contentPostsQueryOptions = (params?: {
  page?: number
  limit?: number
  ideaId?: string
}) =>
  queryOptions<GetContentPostsResponse>({
    queryKey: ['content-posts', params ?? {}],
    queryFn: () => fetchContentPosts(params),
    staleTime: 30_000,
  })

export const contentPostQueryOptions = (postId: string) =>
  queryOptions<GetContentPostsByPostIdResponse>({
    queryKey: ['content-posts', postId],
    queryFn: () => fetchContentPost(postId, true),
    enabled: !!postId,
    staleTime: 30_000,
  })
