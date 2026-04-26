import type {
  ScheduledJob,
  CreateScheduledJobRequest,
  PatchScheduledJobRequest,
  ListScheduledJobsParams,
} from '../types/scheduler.dto'
import { apiRequest } from '#/shared/api'

export function fetchScheduledJobs(
  params?: ListScheduledJobsParams,
): Promise<ScheduledJob[]> {
  const query = new URLSearchParams()
  if (params?.postId) query.set('postId', params.postId)
  if (params?.status) query.set('status', params.status)
  if (params?.platform) query.set('platform', params.platform)
  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)
  const qs = query.toString()
  return apiRequest<ScheduledJob[]>(`/scheduler/jobs${qs ? `?${qs}` : ''}`)
}

export function fetchScheduledJobForPost(
  postId: string,
): Promise<ScheduledJob | null> {
  return fetchScheduledJobs({ postId }).then((jobs) => jobs[0] ?? null)
}

export function fetchScheduledJob(jobId: string): Promise<ScheduledJob> {
  return apiRequest<ScheduledJob>(`/scheduler/jobs/${jobId}`)
}

export function createScheduledJob(
  data: CreateScheduledJobRequest,
): Promise<ScheduledJob> {
  return apiRequest<ScheduledJob>('/scheduler/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateScheduledJob(
  jobId: string,
  data: PatchScheduledJobRequest,
): Promise<ScheduledJob> {
  return apiRequest<ScheduledJob>(`/scheduler/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function cancelScheduledJob(jobId: string): Promise<void> {
  return apiRequest<void>(`/scheduler/jobs/${jobId}`, { method: 'DELETE' })
}
