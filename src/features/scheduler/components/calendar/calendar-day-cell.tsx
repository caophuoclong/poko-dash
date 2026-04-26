import type { CalendarDay, CalendarEvent } from '../../types/calendar-event'
import { cn } from '#/shared/utils'
import CalendarEventCard from './calendar-event-card'

interface CalendarDayCellProps {
  day: CalendarDay
  onDayClick?: (dateKey: string) => void
  onEventClick?: (event: CalendarEvent) => void
  maxVisibleEvents?: number
}

export default function CalendarDayCell({
  day,
  onDayClick,
  onEventClick,
  maxVisibleEvents = 3,
}: CalendarDayCellProps) {
  const visibleEvents = day.events.slice(0, maxVisibleEvents)
  const overflowCount = day.events.length - maxVisibleEvents

  const handleDayClick = () => {
    if (onDayClick) {
      onDayClick(day.dateKey)
    }
  }

  return (
    <div
      className={cn(
        'min-h-28 border-b border-r border-frost p-2 last:border-r-0 transition-colors',
        !day.isCurrentMonth && 'bg-surface-2/50 opacity-60',
        day.isCurrentMonth && 'hover:bg-surface-2 cursor-pointer',
      )}
      onClick={handleDayClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-sm inline-flex items-center justify-center w-7 h-7 rounded-full',
            day.isToday && 'bg-accent-orange text-accent-on font-semibold',
            !day.isToday && day.isCurrentMonth && 'text-near-white',
            !day.isToday && !day.isCurrentMonth && 'text-muted-text',
          )}
        >
          {day.date.getDate()}
        </span>
        {day.events.length > 0 && (
          <span className="text-[10px] text-muted-text">
            {day.events.length}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {visibleEvents.map((event) => (
          <CalendarEventCard
            key={event.id}
            event={event}
            onClick={(e) => {
              e.stopPropagation()
              onEventClick?.(event)
            }}
          />
        ))}
        {overflowCount > 0 && (
          <button
            className="text-[10px] text-accent-blue hover:text-near-white w-full text-left px-1 py-0.5 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onDayClick?.(day.dateKey)
            }}
          >
            +{overflowCount} thêm
          </button>
        )}
      </div>
    </div>
  )
}
