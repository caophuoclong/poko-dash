import {
  getContentIdeasControllerListPaginatedQueryOptions,
  getContentIdeasControllerFindByIdQueryOptions,
} from '#/api/client'

export const contentIdeasQueryOptions = (params?: {
  page?: number
  limit?: number
  status?: string
}) => ({
  ...getContentIdeasControllerListPaginatedQueryOptions(params),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const contentIdeaQueryOptions = (ideaId: string) => ({
  ...getContentIdeasControllerFindByIdQueryOptions(ideaId),
  staleTime: 30_000,
  select: (res: any) => res.data,
})
