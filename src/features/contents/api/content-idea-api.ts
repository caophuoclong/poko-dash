import type {
  GetContentIdeasResponse,
  PostContentIdeasRequest,
  PostContentIdeasResponse,
  PatchContentIdeasByIdeaIdRequest,
  PatchContentIdeasByIdeaIdResponse,
  PostContentIdeasGenerateRequest,
} from '#/dtos/content-ideas'
import { apiRequest } from '#/shared/api'

export function fetchContentIdeas(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<GetContentIdeasResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', params.page.toString())
  if (params?.limit) query.set('limit', params.limit.toString())
  if (params?.status) query.set('status', params.status)

  const queryString = query.toString()
  return apiRequest<GetContentIdeasResponse>(
    `/content-ideas${queryString ? `?${queryString}` : ''}`,
  )
}

export function fetchContentIdea(
  ideaId: string,
): Promise<GetContentIdeasResponse[number]> {
  return apiRequest<GetContentIdeasResponse[number]>(`/content-ideas/${ideaId}`)
}

export function createContentIdea(
  data: PostContentIdeasRequest,
): Promise<PostContentIdeasResponse> {
  return apiRequest<PostContentIdeasResponse>('/content-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateContentIdea(
  ideaId: string,
  data: PatchContentIdeasByIdeaIdRequest,
): Promise<PatchContentIdeasByIdeaIdResponse> {
  return apiRequest<PatchContentIdeasByIdeaIdResponse>(
    `/content-ideas/${ideaId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )
}

export function deleteContentIdea(ideaId: string): Promise<void> {
  return apiRequest<void>(`/content-ideas/${ideaId}`, {
    method: 'DELETE',
  })
}

export function generateContentIdeas(
  data: PostContentIdeasGenerateRequest & {
    productIds: string[]
    count?: number
  },
): Promise<void> {
  return apiRequest<void>('/content-ideas/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
