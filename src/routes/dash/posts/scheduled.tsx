import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dash/posts/scheduled')({
  component: ScheduledPostsPage,
})

function ScheduledPostsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-near-white">Bài viết đã lên lịch</h1>
    </div>
  )
}
