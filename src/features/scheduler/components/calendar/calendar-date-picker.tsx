import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import type { CalendarEvent } from '../../types/calendar-event'
import { cn } from '#/shared/utils'
import { vi } from 'date-fns/locale'

interface CalendarDatePickerProps {
  value?: Date
  onSelect?: (date: Date | undefined) => void
  events?: CalendarEvent[]
  minDate?: Date
}

export default function CalendarDatePicker({
  value,
  onSelect,
  events = [],
  minDate,
}: CalendarDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value,
  )

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, number>()
    events.forEach((event) => {
      try {
        const date = new Date(event.scheduledAt)
        if (!isNaN(date.getTime())) {
          const dateKey = date.toISOString().slice(0, 10)
          map.set(dateKey, (map.get(dateKey) || 0) + 1)
        }
      } catch (error) {
        console.warn('Invalid date in event:', event.scheduledAt)
      }
    })
    return map
  }, [events])

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onSelect?.(date)
  }

  const modifiers = {
    hasEvents: (date: Date) => {
      const dateKey = date.toISOString().slice(0, 10)
      return eventsByDate.has(dateKey)
    },
  }

  const modifiersClassNames = {
    hasEvents:
      'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-accent-blue',
  }

  React.useEffect(() => {
    if (value && value.getTime() !== selectedDate?.getTime()) {
      setSelectedDate(value)
    }
  }, [value])

  return (
    <div className="w-full overflow-x-auto">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        locale={vi}
        disabled={(date: Date) => {
          if (minDate && date < minDate) return true
          return false
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className={cn(
          'min-w-[280px] w-full rounded-lg border border-frost bg-surface-2/40 p-3',
          '[&_.rdp-months]:w-full',
          '[&_.rdp-month]:w-full',
          '[&_.rdp-table]:w-full table-fixed',
          '[&_.rdp-caption]:flex [&_.rdp-caption]:justify-center [&_.rdp-caption]:mb-4',
          '[&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-medium [&_.rdp-caption_label]:text-near-white [&_.rdp-caption_label]:capitalize',
          '[&_.rdp-nav]:absolute [&_.rdp-nav]:inset-x-0 [&_.rdp-nav]:flex [&_.rdp-nav]:justify-between',
          '[&_.rdp-button]:size-7 [&_.rdp-button]:text-muted-text hover:[&_.rdp-button]:text-near-white hover:[&_.rdp-button]:bg-surface-2',
          '[&_.rdp-head_cell]:text-[11px] [&_.rdp-head_cell]:font-medium [&_.rdp-head_cell]:text-muted-text [&_.rdp-head_cell]:w-auto [&_.rdp-head_cell]:py-2',
          '[&_.rdp-cell]:p-0 [&_.rdp-cell]:text-center',
          '[&_.rdp-day]:w-full [&_.rdp-day]:h-8 [&_.rdp-day]:text-sm [&_.rdp-day]:font-normal [&_.rdp-day]:text-near-white',
          '[&_.rdp-day:hover]:bg-surface-2 [&_.rdp-day:hover]:text-near-white',
          '[&_.rdp-day_selected]:bg-accent-blue [&_.rdp-day_selected]:text-accent-on [&_.rdp-day_selected]:font-medium',
          '[&_.rdp-day_selected:hover]:bg-accent-blue [&_.rdp-day_selected:hover]:text-accent-on',
          '[&_.rdp-day_today]:bg-accent-orange/10 [&_.rdp-day_today]:text-accent-orange [&_.rdp-day_today]:font-medium',
          '[&_.rdp-day_outside]:text-muted-text/40',
          '[&_.rdp-day_disabled]:text-muted-text/20 [&_.rdp-day_disabled]:cursor-not-allowed',
        )}
      />

      {selectedDate && !isNaN(selectedDate.getTime()) && (
        <div className="mt-3 px-3 py-2 bg-surface-2 border border-frost rounded-lg">
          <div className="text-xs text-muted-text mb-0.5">Ngày đã chọn</div>
          <div className="text-sm text-near-white font-medium">
            {selectedDate.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {eventsByDate.has(selectedDate.toISOString().slice(0, 10)) && (
            <div className="mt-1 text-xs text-accent-blue">
              {eventsByDate.get(selectedDate.toISOString().slice(0, 10))} lịch
              đăng trong ngày này
            </div>
          )}
        </div>
      )}
    </div>
  )
}
