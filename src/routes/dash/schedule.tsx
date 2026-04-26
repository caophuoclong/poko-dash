import { createFileRoute } from '@tanstack/react-router'
import { scheduledJobsQueryOptions } from '#/features/scheduler/queries/scheduler-queries'
import ScheduledPostsPage from '#/features/scheduler/components/scheduled-posts-page'

export const Route = createFileRoute('/dash/schedule')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(scheduledJobsQueryOptions()),
  component: ScheduledPostsPage,
})
