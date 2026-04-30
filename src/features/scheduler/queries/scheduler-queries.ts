import {
  getSchedulerControllerListQueryOptions,
  getSchedulerControllerFindByIdQueryOptions,
} from '#/api/client'

export const scheduledJobsQueryOptions = (params?: any) => ({
  ...getSchedulerControllerListQueryOptions(),
  staleTime: 30_000,
  select: (res: any) => res.data,
})

export const scheduledJobQueryOptions = (jobId: string) => ({
  ...getSchedulerControllerFindByIdQueryOptions(jobId),
  staleTime: 30_000,
  select: (res: any) => res.data,
})
