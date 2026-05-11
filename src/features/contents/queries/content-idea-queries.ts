import {
  getContentIdeasControllerListPaginatedQueryOptions,
  getContentIdeasControllerFindByIdQueryOptions,
} from '#/api/client'

export const contentIdeasQueryOptions = (params?: {
  page?: number
  page_size?: number
  search?: string
  sort_by?: 'priority' | 'createdAt' | 'updatedAt' | 'status'
  sort_order?: 'asc' | 'desc'
}) => ({
  ...getContentIdeasControllerListPaginatedQueryOptions(params),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const contentIdeasInfiniteQueryOptions = (params?: {
  page_size?: number
  search?: string
  sort_by?: 'priority' | 'createdAt' | 'updatedAt' | 'status'
  sort_order?: 'asc' | 'desc'
}) => ({
  queryKey: ['content-ideas', 'infinite', params],
  initialPageParam: 1,
  staleTime: 30_000,
  queryFn: async ({ pageParam }: { pageParam: number }) => {
    const res = await import('#/api/client').then((m) =>
      m.getContentIdeasControllerListPaginatedQueryOptions({
        ...params,
        page: pageParam,
      }),
    )
    return (res as any).queryFn?.()
  },
  getNextPageParam: (lastPage: any) => lastPage?.data?.pagination?.next_page,
})

export const contentIdeaQueryOptions = (ideaId: string) => ({
  ...getContentIdeasControllerFindByIdQueryOptions(ideaId),
  staleTime: 30_000,
  select: (res: any) => res.data,
})
