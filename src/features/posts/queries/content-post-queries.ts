import { queryOptions } from '@tanstack/react-query'
import { fetchContentPost, fetchContentPosts } from '../api/content-post-api'
import type {
  GetContentPostsResponse,
  GetContentPostsByPostIdResponse,
} from '#/dtos/content-posts'

export const contentPostsQueryOptions = (params?: {
  page?: number
  limit?: number
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
