export type EventStatus = 'draft' | 'scheduled' | 'published' | 'failed'
export type EventPriority = 'low' | 'medium' | 'high'
export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'youtube'

export interface CalendarEvent {
  id: string
  title: string
  scheduledAt: string
  status: EventStatus
  priority: EventPriority
  platform: Platform
  page: string
  contentType?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface CalendarDay {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface CalendarMonth {
  year: number
  month: number
  days: CalendarDay[]
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda'

export interface CalendarFilters {
  platforms?: Platform[]
  statuses?: EventStatus[]
  priorities?: EventPriority[]
}
