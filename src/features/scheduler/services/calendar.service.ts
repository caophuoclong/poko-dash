import type {
  CalendarDay,
  CalendarEvent,
  CalendarMonth,
} from '../types/calendar-event'
import type { ScheduledJob } from '../types/scheduler.dto'

export function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return getDateKey(date1) === getDateKey(date2)
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getMonthStart(year: number, month: number): Date {
  return new Date(year, month, 1)
}

export function getMonthEnd(year: number, month: number): Date {
  return new Date(year, month + 1, 0)
}

export function getCalendarStartDate(year: number, month: number): Date {
  const monthStart = getMonthStart(year, month)
  const dayOfWeek = monthStart.getDay()
  const mondayIndex = (dayOfWeek + 6) % 7
  const calendarStart = new Date(monthStart)
  calendarStart.setDate(monthStart.getDate() - mondayIndex)
  return calendarStart
}

export function generateCalendarDays(
  year: number,
  month: number,
  events: CalendarEvent[] = [],
): CalendarDay[] {
  const days: CalendarDay[] = []
  const startDate = getCalendarStartDate(year, month)
  const currentDate = new Date(startDate)

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>(
    (acc, event) => {
      const dateKey = event.scheduledAt.slice(0, 10)
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(event)
      return acc
    },
    {},
  )

  for (let i = 0; i < 42; i++) {
    const dateKey = getDateKey(currentDate)
    const isCurrentMonth = currentDate.getMonth() === month

    days.push({
      date: new Date(currentDate),
      dateKey,
      isCurrentMonth,
      isToday: isToday(currentDate),
      events: eventsByDate[dateKey] || [],
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

export function generateCalendarMonth(
  year: number,
  month: number,
  events: CalendarEvent[] = [],
): CalendarMonth {
  return {
    year,
    month,
    days: generateCalendarDays(year, month, events),
  }
}

export function getMonthLabel(
  year: number,
  month: number,
  locale = 'vi-VN',
): string {
  const date = new Date(year, month, 1)
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

export function navigateMonth(
  year: number,
  month: number,
  direction: 'prev' | 'next',
): { year: number; month: number } {
  if (direction === 'next') {
    if (month === 11) {
      return { year: year + 1, month: 0 }
    }
    return { year, month: month + 1 }
  } else {
    if (month === 0) {
      return { year: year - 1, month: 11 }
    }
    return { year, month: month - 1 }
  }
}

interface ScheduledPost {
  id: string
  title: string
  scheduledAt: string
  status: string
  priority: string
  channel: string
  page: string
}

export function transformPostsToEvents(
  posts: ScheduledPost[],
): CalendarEvent[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    scheduledAt: post.scheduledAt,
    status: post.status as CalendarEvent['status'],
    priority: post.priority as CalendarEvent['priority'],
    platform: post.channel as CalendarEvent['platform'],
    page: post.page,
  }))
}

export function transformScheduledJobsToEvents(
  jobs: ScheduledJob[],
): CalendarEvent[] {
  return jobs.map((job) => ({
    id: job.jobId,
    title: job.postId,
    scheduledAt: job.scheduledAt,
    status: job.status as CalendarEvent['status'],
    priority: 'medium',
    platform: job.platform as CalendarEvent['platform'],
    page: job.platform,
  }))
}
