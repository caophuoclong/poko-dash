import {
  getPromptsControllerListQueryOptions,
  getPromptsControllerFindByIdQueryOptions,
} from '#/api/client'

export const promptsQueryOptions = (params?: {
  page?: number
  limit?: number
  status?: string
}) => ({
  ...getPromptsControllerListQueryOptions(),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const promptQueryOptions = (promptId: string) => ({
  ...getPromptsControllerFindByIdQueryOptions(promptId),
  staleTime: 30_000,
  select: (res: any) => res.data,
})
