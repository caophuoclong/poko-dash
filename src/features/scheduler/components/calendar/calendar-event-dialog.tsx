import type { CalendarEvent } from '../../types/calendar-event'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Edit, Trash2, ExternalLink } from 'lucide-react'

interface CalendarEventDialogProps {
  event: CalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
}

const PLATFORM_COLORS: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  facebook: {
    bg: 'bg-accent-blue-dim',
    text: 'text-accent-blue',
    label: 'Facebook',
  },
  instagram: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    label: 'Instagram',
  },
  tiktok: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'TikTok' },
  youtube: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'YouTube' },
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Đã lên lịch',
  queued: 'Đang chờ',
  draft: 'Nháp',
  published: 'Đã đăng',
  failed: 'Thất bại',
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: 'Cao', color: 'text-accent-orange' },
  medium: { label: 'Trung bình', color: 'text-accent-blue' },
  low: { label: 'Thấp', color: 'text-muted-text' },
}

export default function CalendarEventDialog({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CalendarEventDialogProps) {
  if (!event) return null

  const platformConfig =
    PLATFORM_COLORS[event.platform] || PLATFORM_COLORS.facebook
  const priorityConfig = PRIORITY_LABELS[event.priority]

  const handleEdit = () => {
    onEdit?.(event)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc muốn xóa lịch đăng "${event.title}"?`)) {
      onDelete?.(event)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-surface border-frost">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DialogTitle className="text-near-white text-lg">
                {event.title}
              </DialogTitle>
              <DialogDescription className="text-muted-text text-sm mt-1">
                Chi tiết lịch đăng
              </DialogDescription>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${platformConfig.bg} ${platformConfig.text}`}
            >
              {platformConfig.label}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="size-4 text-muted-text" />
            <span className="text-near-white">
              {new Date(event.scheduledAt).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="size-4 text-muted-text" />
            <span className="text-near-white">
              {new Date(event.scheduledAt).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {event.description && (
            <div className="bg-surface-2 border border-frost rounded-lg p-3">
              <p className="text-sm text-muted-text whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <div>
              <div className="text-xs text-muted-text mb-1">Trạng thái</div>
              <div className="text-sm text-near-white font-medium">
                {STATUS_LABELS[event.status] || event.status}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-text mb-1">Ưu tiên</div>
              <div className={`text-sm font-medium ${priorityConfig.color}`}>
                {priorityConfig.label}
              </div>
            </div>
          </div>

          {typeof event.metadata?.page === 'string' && (
            <div>
              <div className="text-xs text-muted-text mb-1">Trang đăng</div>
              <div className="text-sm text-near-white">
                {event.metadata.page}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-frost">
          {onEdit && (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Edit className="size-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
          {typeof event.metadata?.postUrl === 'string' && (
            <Button
              onClick={() =>
                window.open(event.metadata!.postUrl as string, '_blank')
              }
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <ExternalLink className="size-4 mr-2" />
              Xem bài
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
