import { apiRequest } from '#/shared/api'
import type {
  GetContentPostsResponse,
  PostContentPostsRequest,
  PostContentPostsResponse,
  GetContentPostsByPostIdResponse,
  PatchContentPostsByPostIdRequest,
  PatchContentPostsByPostIdResponse,
  PostContentPostsGenerateRequest,
  PostContentPostsGenerateResponse,
  PostContentPostsGenerateFromIdeaByIdeaIdResponse,
} from '#/dtos/content-posts'

export function fetchContentPosts(params?: {
  page?: number
  limit?: number
  includeProducts?: boolean
}): Promise<GetContentPostsResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', params.page.toString())
  if (params?.limit) query.set('limit', params.limit.toString())
  if (params?.includeProducts) query.set('include', 'products')

  const queryString = query.toString()
  return apiRequest<GetContentPostsResponse>(
    `/content-posts${queryString ? `?${queryString}` : ''}`,
  )
}

export function fetchContentPost(
  postId: string,
  includeProducts = false,
): Promise<GetContentPostsByPostIdResponse> {
  const query = includeProducts ? '?include=products' : ''
  return apiRequest<GetContentPostsByPostIdResponse>(
    `/content-posts/${postId}${query}`,
  )
}

export function generateFromIdea(
  ideaId: string,
): Promise<PostContentPostsGenerateFromIdeaByIdeaIdResponse> {
  return apiRequest<PostContentPostsGenerateFromIdeaByIdeaIdResponse>(
    `/content-posts/generate-from-idea/${ideaId}`,
    { method: 'POST' },
  )
}

export function generateContentPosts(
  data: PostContentPostsGenerateRequest,
): Promise<PostContentPostsGenerateResponse> {
  return apiRequest<PostContentPostsGenerateResponse>(
    '/content-posts/generate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )
}

export function createContentPost(
  data: PostContentPostsRequest,
): Promise<PostContentPostsResponse> {
  return apiRequest<PostContentPostsResponse>('/content-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateContentPost(
  postId: string,
  data: PatchContentPostsByPostIdRequest,
): Promise<PatchContentPostsByPostIdResponse> {
  return apiRequest<PatchContentPostsByPostIdResponse>(
    `/content-posts/${postId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )
}

export function deleteContentPost(postId: string): Promise<void> {
  return apiRequest<void>(`/content-posts/${postId}`, {
    method: 'DELETE',
  })
}
