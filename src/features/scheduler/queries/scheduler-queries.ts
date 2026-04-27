import { queryOptions } from '@tanstack/react-query'
import { fetchScheduledJobs, fetchScheduledJob } from '../api/scheduler-api'
import type {
  ScheduledJob,
  ListScheduledJobsParams,
} from '../types/scheduler.dto'

export const scheduledJobsQueryOptions = (params?: ListScheduledJobsParams) =>
  queryOptions<ScheduledJob[]>({
    queryKey: ['scheduled-jobs', params ?? {}],
    queryFn: () => fetchScheduledJobs(params),
    staleTime: 30_000,
  })

export const scheduledJobQueryOptions = (jobId: string) =>
  queryOptions<ScheduledJob>({
    queryKey: ['scheduled-jobs', jobId],
    queryFn: () => fetchScheduledJob(jobId),
    enabled: !!jobId,
    staleTime: 30_000,
  })
