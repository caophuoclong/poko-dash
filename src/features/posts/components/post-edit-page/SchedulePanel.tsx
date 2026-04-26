import { useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  useScheduledJobForPost,
  useCreateScheduledJob,
  useUpdateScheduledJob,
  useCancelScheduledJob,
} from '@/features/scheduler/hooks/use-scheduler'
import type { ScheduledJobStatus } from '@/features/scheduler/types/scheduler.dto'

interface SchedulePanelProps {
  postId: string
  platform: string
}

const jobStatusLabel: Record<ScheduledJobStatus, string> = {
  scheduled: 'Đã lên lịch',
  published: 'Đã đăng',
  failed: 'Thất bại',
  pending: 'Chờ xử lý',
  cancelled: 'Đã hủy',
}

const jobStatusColor: Record<ScheduledJobStatus, string> = {
  scheduled: 'text-accent-blue bg-accent-blue-dim',
  published: 'text-accent-green bg-accent-green-dim',
  failed: 'text-red-400 bg-red-400/10',
  pending: 'text-muted-text bg-surface-2',
  cancelled: 'text-muted-text bg-surface-2',
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SchedulePanel({
  postId,
  platform,
}: SchedulePanelProps) {
  const { data: job, isLoading } = useScheduledJobForPost(postId)
  const createJob = useCreateScheduledJob()
  const updateJob = useUpdateScheduledJob()
  const cancelJob = useCancelScheduledJob()

  const [newScheduledAt, setNewScheduledAt] = useState('')
  const [rescheduleAt, setRescheduleAt] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-surface-2 rounded w-1/2" />
        <div className="h-9 bg-surface-2 rounded" />
      </div>
    )
  }

  if (job) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-text">Trạng thái</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              jobStatusColor[job.status] ?? 'text-muted-text bg-surface-2'
            }`}
          >
            {jobStatusLabel[job.status] ?? job.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-text">Thời gian đăng</span>
          <span className="text-sm text-near-white">
            {formatDateTime(job.scheduledAt)}
          </span>
        </div>

        {job.publishedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-text">Đã đăng lúc</span>
            <span className="text-sm text-near-white">
              {formatDateTime(job.publishedAt)}
            </span>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <label className="block text-sm text-near-white font-medium">
            Đổi lịch
          </label>
          <input
            type="datetime-local"
            value={rescheduleAt}
            onChange={(e) => setRescheduleAt(e.target.value)}
            className="w-full bg-surface-2 border border-frost rounded-lg px-4 py-2.5 text-sm text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!rescheduleAt || updateJob.isPending}
            onClick={() => {
              if (!rescheduleAt) return
              updateJob.mutate(
                {
                  jobId: job.jobId,
                  data: { scheduledAt: new Date(rescheduleAt).toISOString() },
                },
                { onSuccess: () => setRescheduleAt('') },
              )
            }}
          >
            {updateJob.isPending ? 'Đang lưu...' : 'Cập nhật lịch'}
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
          disabled={cancelJob.isPending}
          onClick={() => cancelJob.mutate(job.jobId)}
        >
          {cancelJob.isPending ? 'Đang hủy...' : 'Hủy lịch'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-text">Chưa có lịch đăng cho bài này.</p>
      <div className="space-y-2">
        <label className="block text-sm text-near-white font-medium">
          Thời gian đăng
        </label>
        <input
          type="datetime-local"
          value={newScheduledAt}
          onChange={(e) => setNewScheduledAt(e.target.value)}
          className="w-full bg-surface-2 border border-frost rounded-lg px-4 py-2.5 text-sm text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
        <Button
          type="button"
          className="w-full"
          disabled={!newScheduledAt || createJob.isPending}
          onClick={() => {
            if (!newScheduledAt) return
            createJob.mutate(
              {
                postId,
                platform,
                scheduledAt: new Date(newScheduledAt).toISOString(),
              },
              { onSuccess: () => setNewScheduledAt('') },
            )
          }}
        >
          {createJob.isPending ? 'Đang lên lịch...' : 'Lên lịch'}
        </Button>
      </div>
    </div>
  )
}
