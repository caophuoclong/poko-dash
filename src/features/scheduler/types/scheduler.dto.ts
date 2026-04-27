// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Scheduler
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface PostSchedulerJobsRequest {
  postId: string
  platform: string
  scheduledAt: string
  utmCode?: string
}

export interface PatchSchedulerJobsByJobIdRequest {
  status?: 'pending' | 'scheduled' | 'published' | 'failed' | 'cancelled'
  scheduledAt?: string
  publishedAt?: string
  postUrl?: string
  utmCode?: string
}

// ─── Runtime types (not in OpenAPI spec but used internally) ────────────────

export type ScheduledJobStatus =
  | 'pending'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'cancelled'

export interface ScheduledJob {
  jobId: string
  postId: string
  platform: string
  status: ScheduledJobStatus
  scheduledAt: string
  publishedAt?: string
  postUrl?: string
  utmCode?: string
  createdAt: string
  updatedAt: string
}

export interface ListScheduledJobsParams {
  postId?: string
  status?: ScheduledJobStatus
  platform?: string
  from?: string
  to?: string
}

export type CreateScheduledJobRequest = PostSchedulerJobsRequest
export type PatchScheduledJobRequest = PatchSchedulerJobsByJobIdRequest
