import * as React from 'react'
import type { CalendarEvent } from '../../types/calendar-event'
import {
  generateCalendarMonth,
  getMonthLabel,
  navigateMonth,
} from '#/shared/calendar-utils'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import CalendarDayCell from './calendar-day-cell'
import CalendarEventDialog from './calendar-event-dialog'
import { fetchScheduledJobs } from '../../api/scheduler-api'
import { transformScheduledJobsToEvents } from '../../services/calendar.service'

interface CalendarMonthViewProps {
  events?: CalendarEvent[]
  onDayClick?: (dateKey: string) => void
  onEventClick?: (event: CalendarEvent) => void
  onCreateEvent?: () => void
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export default function CalendarMonthView({
  events: externalEvents,
  onDayClick,
  onEventClick,
  onCreateEvent,
}: CalendarMonthViewProps) {
  const controlled = externalEvents !== undefined

  const [currentDate, setCurrentDate] = React.useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const [fetchedEvents, setFetchedEvents] = React.useState<CalendarEvent[]>([])
  const [loading, setLoading] = React.useState(!controlled)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] =
    React.useState<CalendarEvent | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (controlled) return

    let cancelled = false
    setLoading(true)
    setError(null)

    const from = new Date(currentDate.year, currentDate.month, 1).toISOString()
    const to = new Date(
      currentDate.year,
      currentDate.month + 1,
      0,
      23,
      59,
      59,
    ).toISOString()

    fetchScheduledJobs({ from, to })
      .then((jobs) => {
        if (!cancelled) {
          setFetchedEvents(transformScheduledJobsToEvents(jobs))
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Không thể tải dữ liệu lịch.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [controlled, currentDate.year, currentDate.month])

  const events = controlled ? externalEvents! : fetchedEvents

  const calendarMonth = React.useMemo(
    () => generateCalendarMonth(currentDate.year, currentDate.month, events),
    [currentDate.year, currentDate.month, events],
  )

  const monthLabel = getMonthLabel(currentDate.year, currentDate.month)

  const handlePrevMonth = () => {
    const { year, month } = navigateMonth(
      currentDate.year,
      currentDate.month,
      'prev',
    )
    setCurrentDate({ year, month })
  }

  const handleNextMonth = () => {
    const { year, month } = navigateMonth(
      currentDate.year,
      currentDate.month,
      'next',
    )
    setCurrentDate({ year, month })
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentDate({ year: now.getFullYear(), month: now.getMonth() })
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogOpen(true)
    onEventClick?.(event)
  }

  const handleEventEdit = (event: CalendarEvent) => {
    window.location.href = `/dash/posts/edit?id=${event.id}`
  }

  const handleEventDelete = (_event: CalendarEvent) => {}

  if (loading) {
    return (
      <div className="bg-surface border border-frost rounded-2xl overflow-hidden">
        <div className="p-6 flex items-center justify-center text-sm text-muted-text gap-2">
          <div className="size-4 border-2 border-muted-text border-t-transparent rounded-full animate-spin" />
          Đang tải lịch...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface border border-frost rounded-2xl overflow-hidden">
        <div className="p-6 flex items-center justify-center">
          <div className="text-sm text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-frost rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-frost flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-near-white capitalize">
            {monthLabel}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="size-8"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 px-3 text-xs"
            >
              Hôm nay
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="size-8"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        {onCreateEvent && (
          <Button
            onClick={onCreateEvent}
            className="bg-accent-orange text-accent-on hover:bg-accent-orange-light"
            size="sm"
          >
            <Plus className="size-4 mr-2" />
            Tạo lịch đăng
          </Button>
        )}
      </div>

      <div className="grid grid-cols-7 border-b border-frost bg-surface-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-medium text-muted-text"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarMonth.days.map((day) => (
          <CalendarDayCell
            key={day.dateKey}
            day={day}
            onDayClick={onDayClick}
            onEventClick={handleEventClick}
          />
        ))}
      </div>

      <CalendarEventDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />

      {events.length === 0 && (
        <div className="px-6 py-8 text-center border-t border-frost">
          <p className="text-sm text-muted-text">
            Chưa có lịch đăng nào. Nhấn "Tạo lịch đăng" để bắt đầu.
          </p>
        </div>
      )}
    </div>
  )
}
