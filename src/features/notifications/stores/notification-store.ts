import { create } from 'zustand'
import type { Notification } from '../types'

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Workflow "Daily Content Digest" completed',
    description: '12 nodes executed in 3.2s with 100% success rate.',
    severity: 'success',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    actionLabel: 'View run',
    actionTo: '/dash/workflows',
  },
  {
    id: 'n2',
    title: 'Post "Summer Sale Roundup" published',
    description: 'Successfully published to Facebook and Instagram.',
    severity: 'success',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actionLabel: 'View post',
    actionTo: '/dash/posts',
  },
  {
    id: 'n3',
    title: 'Workflow "SEO Analyzer" failed at node #4',
    description: 'API rate limit exceeded. Retry after 60 seconds.',
    severity: 'error',
    read: false,
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    actionLabel: 'View workflow',
    actionTo: '/dash/workflows',
  },
  {
    id: 'n4',
    title: '3 new content ideas generated',
    description: 'AI generated ideas based on trending topics in your niche.',
    severity: 'info',
    read: true,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actionTo: '/dash/content',
  },
  {
    id: 'n5',
    title: 'Schedule conflict detected',
    description:
      'Two posts are scheduled for the same time slot tomorrow at 9:00 AM.',
    severity: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    actionTo: '/dash/schedule',
  },
]

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    )
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    })
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }))
    set({ notifications: updated, unreadCount: 0 })
  },
}))
