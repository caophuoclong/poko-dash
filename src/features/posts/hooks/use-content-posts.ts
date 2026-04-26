import type {
  GetContentPostsResponse,
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
import { useApiQuery, useApiMutation } from '#/shared/hooks'

export function useContentPosts() {
  return useApiQuery(
    ['content-posts'],
    () => fetchContentPosts(),
    { fallback: [] as GetContentPostsResponse },
  )
}

export function useContentPost(postId: string) {
  return useApiQuery(
    ['content-posts', postId],
    () => fetchContentPost(postId, true),
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
