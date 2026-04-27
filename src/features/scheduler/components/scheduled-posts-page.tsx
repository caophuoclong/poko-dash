import { useContentPosts } from '#/features/posts/hooks/use-content-posts'
import { useScheduledJobs } from '../hooks/use-scheduler'
import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import CalendarMonthView from './calendar/calendar-month-view'
import { transformScheduledJobsToEvents } from '../services/calendar.service'
import type { GetContentPostsResponse } from '#/dtos/content-posts'

type PostSummary = GetContentPostsResponse[number]

function ScheduledPostsPageInner() {
  const { data: allPosts = [], isLoading } = useContentPosts()
  const { data: scheduledJobs = [] } = useScheduledJobs()

  const calendarEvents = useMemo(
    () => transformScheduledJobsToEvents(scheduledJobs),
    [scheduledJobs],
  )

  const scheduledPosts = useMemo(
    () =>
      allPosts.filter((p) => p.status === 'queued' || p.status === 'approved'),
    [allPosts],
  )

  const postsByDate = useMemo(() => {
    const map: Record<string, PostSummary[]> = {}
    for (const post of scheduledPosts) {
      const key = post.updatedAt.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(post)
    }
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, posts]) => ({ date, posts }))
  }, [scheduledPosts])

  if (isLoading) {
    return <div className="p-12 text-center text-muted-text">Đang tải...</div>
  }

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-near-white tracking-tight mb-1">
          Bài đã lên lịch
        </h1>
        <p className="text-sm text-muted-text">
          {scheduledPosts.length} bài viết đang chờ đăng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-surface border border-frost rounded-xl px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-muted-text">
            Tổng bài đã lên lịch
          </div>
          <div className="mt-1 text-xl font-semibold text-near-white">
            {scheduledPosts.length}
          </div>
        </div>
        <div className="bg-surface border border-frost rounded-xl px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-muted-text">
            Trong hàng đợi
          </div>
          <div className="mt-1 text-xl font-semibold text-accent-orange">
            {scheduledPosts.filter((p) => p.status === 'queued').length}
          </div>
        </div>
        <div className="bg-surface border border-frost rounded-xl px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-muted-text">
            Đã duyệt
          </div>
          <div className="mt-1 text-xl font-semibold text-accent-blue">
            {scheduledPosts.filter((p) => p.status === 'approved').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <CalendarMonthView events={calendarEvents} />
        </div>

        <aside className="xl:col-span-1">
          {postsByDate.length === 0 ? (
            <div className="bg-surface border border-frost rounded-xl p-12 text-center text-muted-text">
              Không có bài viết nào đã lên lịch
            </div>
          ) : (
            postsByDate.map((group) => (
              <section
                key={group.date}
                className="bg-surface border border-frost rounded-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-frost flex items-center justify-between">
                  <div className="text-sm font-medium text-near-white">
                    {new Date(group.date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-muted-text">
                    {group.posts.length} bài
                  </div>
                </div>

                <div className="divide-y divide-frost">
                  {group.posts.map((post) => (
                    <div
                      key={post.postId}
                      className="p-4 flex items-center gap-4 hover:bg-surface-2 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent-blue-dim flex items-center justify-center shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle
                            cx="9"
                            cy="9"
                            r="7"
                            style={{ stroke: 'var(--t-accent-blue)' }}
                            strokeWidth="1.5"
                          />
                          <path
                            d="M9 5v4l3 3"
                            style={{ stroke: 'var(--t-accent-blue)' }}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-near-white truncate">
                          {post.title}
                        </div>
                        <div className="text-xs text-muted-text mt-0.5 capitalize">
                          {post.platform}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link
                          to="/dash/posts/$postId/edit"
                          params={{ postId: post.postId }}
                          className="text-xs text-muted-text hover:text-near-white px-2 py-1 rounded transition-colors"
                        >
                          Sửa
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </aside>
      </div>
    </div>
  )
}

export default function ScheduledPostsPage() {
  return <ScheduledPostsPageInner />
}
