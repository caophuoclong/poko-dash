import {
  getContentPostsControllerListQueryOptions,
  getContentPostsControllerFindByIdQueryOptions,
  getContentIdeasControllerListPaginatedQueryOptions,
} from '#/api/client'

export const contentIdeasQueryOptions = () => ({
  ...getContentIdeasControllerListPaginatedQueryOptions(),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const contentPostsQueryOptions = (params?: {
  page?: number
  limit?: number
  ideaId?: string
}) => ({
  ...getContentPostsControllerListQueryOptions(),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const contentPostQueryOptions = (postId: string) => ({
  ...getContentPostsControllerFindByIdQueryOptions(postId, {
    include: 'products',
  }),
  staleTime: 30_000,
  select: (res: any) => res.data,
})
