export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  title: string
  description?: string
  severity: NotificationSeverity
  read: boolean
  createdAt: string
  actionLabel?: string
  actionTo?: string
}
