import { format, parseISO } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'
import type { DashboardScheduledItem } from '#/dtos/dashboard'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '#/shared/utils'

interface UpcomingScheduleListProps {
  items: DashboardScheduledItem[]
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: 'blue',
  tiktok: 'purple',
  instagram: 'orange',
  youtube: 'red',
  blog: 'green',
}

const STATUS_TONES: Record<
  DashboardScheduledItem['status'],
  'neutral' | 'orange' | 'red'
> = {
  pending: 'neutral',
  queued: 'orange',
  failed: 'red',
}

export function UpcomingScheduleList({ items }: UpcomingScheduleListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-frost bg-surface p-4">
        <h3 className="text-sm font-semibold text-near-white mb-3">
          Upcoming schedule
        </h3>
        <EmptyState
          variant="inline"
          icon="calendar"
          title="No scheduled posts"
          description="Schedule posts to see them here"
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-frost bg-surface p-4">
      <h3 className="text-sm font-semibold text-near-white mb-3">
        Upcoming schedule
      </h3>
      <div className="space-y-2">
        {items.slice(0, 5).map((item) => (
          <ScheduledItemCard key={item.id} item={item} />
        ))}
      </div>
      {items.length > 5 && (
        <p className="text-xs text-muted-text text-center mt-3">
          +{items.length - 5} more scheduled
        </p>
      )}
    </div>
  )
}

interface ScheduledItemCardProps {
  item: DashboardScheduledItem
}

function ScheduledItemCard({ item }: ScheduledItemCardProps) {
  const scheduledDate = parseISO(item.scheduledAt)
  const platformColor =
    PLATFORM_COLORS[item.platform.toLowerCase()] || 'neutral'

  return (
    <div className="rounded-md border border-frost/50 bg-surface-2 p-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-muted-text shrink-0" />
          <p className="text-xs font-medium text-near-white">
            {format(scheduledDate, 'MMM d, h:mm a')}
          </p>
        </div>
        <Badge tone={platformColor as any} size="sm">
          {item.platform}
        </Badge>
      </div>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-text line-clamp-1">{item.title}</p>
        <Badge tone={STATUS_TONES[item.status]} size="sm" variant="outline">
          {item.status}
        </Badge>
      </div>
    </div>
  )
}
