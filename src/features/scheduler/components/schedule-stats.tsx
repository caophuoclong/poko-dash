import * as React from 'react'
import { fetchScheduledJobs } from '../api/scheduler-api'
import type { ScheduledJob } from '../types/scheduler.dto'

function getWeekRange(): { from: string; to: string } {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { from: monday.toISOString(), to: sunday.toISOString() }
}

export default function ScheduleStats() {
  const [jobs, setJobs] = React.useState<ScheduledJob[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const { from, to } = getWeekRange()
    fetchScheduledJobs({ from, to })
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [])

  const totalThisWeek = jobs.length
  const pending = jobs.filter(
    (j) => j.status === 'pending' || j.status === 'scheduled',
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-surface border border-frost rounded-2xl px-4 py-3">
        <div className="text-xs uppercase tracking-wide text-muted-text">
          Tổng lịch tuần này
        </div>
        <div className="mt-1 text-xl font-semibold text-near-white">
          {loading ? <span className="text-muted-text">—</span> : totalThisWeek}
        </div>
      </div>
      <div className="bg-surface border border-frost rounded-2xl px-4 py-3">
        <div className="text-xs uppercase tracking-wide text-muted-text">
          Đã xuất bản
        </div>
        <div className="mt-1 text-xl font-semibold text-accent-orange">
          {loading ? (
            <span className="text-muted-text">—</span>
          ) : (
            jobs.filter((j) => j.status === 'published').length
          )}
        </div>
      </div>
      <div className="bg-surface border border-frost rounded-2xl px-4 py-3">
        <div className="text-xs uppercase tracking-wide text-muted-text">
          Đang chờ queue
        </div>
        <div className="mt-1 text-xl font-semibold text-accent-blue">
          {loading ? <span className="text-muted-text">—</span> : pending}
        </div>
      </div>
    </div>
  )
}
