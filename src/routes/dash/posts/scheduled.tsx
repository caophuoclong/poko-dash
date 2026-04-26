import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '#/components/ui/simple-page'
import { Calendar } from 'lucide-react'

export const Route = createFileRoute('/dash/posts/scheduled')({
  component: ScheduledPostsPage,
})

function ScheduledPostsPage() {
  return <SimplePage title="Bài viết đã lên lịch" subtitle="Xem và quản lý các bài viết đã lên lịch" icon={Calendar} />
}
