import type { CalendarEvent } from '../types/calendar-event'
import type { ScheduledJob } from '../types/scheduler.dto'

interface ScheduledPost {
  id: string
  title: string
  scheduledAt: string
  status: string
  priority: string
  channel: string
  page: string
}

export function transformPostsToEvents(
  posts: ScheduledPost[],
): CalendarEvent[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    scheduledAt: post.scheduledAt,
    status: post.status as CalendarEvent['status'],
    priority: post.priority as CalendarEvent['priority'],
    platform: post.channel as CalendarEvent['platform'],
    page: post.page,
  }))
}

export function transformScheduledJobsToEvents(
  jobs: ScheduledJob[],
): CalendarEvent[] {
  return jobs.map((job) => ({
    id: job.jobId,
    title: job.postId,
    scheduledAt: job.scheduledAt,
    status: job.status as CalendarEvent['status'],
    priority: 'medium' as CalendarEvent['priority'],
    platform: job.platform as CalendarEvent['platform'],
    page: job.platform,
  }))
}
