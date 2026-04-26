import type { CalendarEvent } from '../../types/calendar-event'
import { cn } from '#/shared/utils'

interface CalendarEventCardProps {
  event: CalendarEvent
  onClick?: (e: React.MouseEvent) => void
}

const platformColors: Record<string, string> = {
  facebook: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  tiktok: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function CalendarEventCard({
  event,
  onClick,
}: CalendarEventCardProps) {
  const time = new Date(event.scheduledAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-2 py-1 rounded border text-[11px] transition-all hover:scale-[1.02]',
        platformColors[event.platform] ||
          'bg-surface-2 text-muted-text border-frost',
      )}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="font-medium truncate flex-1">{time}</span>
        {event.priority === 'high' && (
          <span className="text-accent-orange text-[9px]">!</span>
        )}
      </div>
      <div className="truncate opacity-90">{event.title}</div>
    </button>
  )
}
