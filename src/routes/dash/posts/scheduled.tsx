import { createFileRoute } from '@tanstack/react-router'
import { usePageHeader } from '#/components/ui/page-header-context'

export const Route = createFileRoute('/dash/posts/scheduled')({
  component: ScheduledPostsPage,
})

function ScheduledPostsPage() {
  usePageHeader({
    title: 'Bài viết đã lên lịch',
    subtitle: 'Xem và quản lý các bài viết đã lên lịch',
  })

  return (
    <div className="p-6 text-center text-muted-text">
      Scheduled posts coming soon...
    </div>
  )
}
