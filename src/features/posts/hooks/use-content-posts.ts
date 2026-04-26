import type {
  GetContentPostsResponse,
  GetContentPostsByPostIdResponse,
  PatchContentPostsByPostIdRequest,
} from '#/dtos/content-posts'
import {
  fetchContentPosts,
  fetchContentPost,
  generateContentPosts,
  generateFromIdea,
  createContentPost,
  updateContentPost,
  deleteContentPost,
} from '../api/content-post-api'
import { useApiQuery, useApiMutation } from '@/hooks/use-api-query'
import { MOCK_CONTENT_POSTS } from '#/shared/mock-data'

export function useContentPosts() {
  return useApiQuery(
    ['content-posts'],
    async () => {
      const posts = await fetchContentPosts()
      return posts.length > 0 ? posts : ([] as GetContentPostsResponse)
    },
    { fallback: [] as GetContentPostsResponse },
  )
}

export function useContentPost(postId: string) {
  return useApiQuery(
    ['content-posts', postId],
    async () => {
      const res = await fetchContentPost(postId, true)
      if (!res) {
        const mockPost = MOCK_CONTENT_POSTS.find((p) => p.postId === postId)
        if (!mockPost) throw new Error('Post not found')
        return mockPost as GetContentPostsByPostIdResponse
      }
      return res
    },
    {
      enabled: !!postId,
      silentError: false,
    },
  )
}

export function useGenerateFromIdea() {
  return useApiMutation(generateFromIdea, {
    invalidateKeys: [['content-posts'], ['content-ideas']],
  })
}

export function useGenerateContentPosts() {
  return useApiMutation(generateContentPosts, {
    invalidateKeys: [['content-posts']],
  })
}

export function useCreateContentPost() {
  return useApiMutation(createContentPost, {
    invalidateKeys: [['content-posts']],
  })
}

export function useUpdateContentPost() {
  return useApiMutation(
    ({
      postId,
      data,
    }: {
      postId: string
      data: PatchContentPostsByPostIdRequest
    }) => updateContentPost(postId, data),
    {
      invalidateKeys: [['content-posts']],
    },
  )
}

export function useDeleteContentPost() {
  return useApiMutation(deleteContentPost, {
    invalidateKeys: [['content-posts']],
  })
}
