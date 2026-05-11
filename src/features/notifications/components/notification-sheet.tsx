import { useMemo } from 'react'
import {
  Bell,
  Check,
  Eye,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { EmptyState } from '#/components/ui/empty-state'
import { cn } from '#/shared/utils'
import { useNotificationStore } from '#/features/notifications/stores/notification-store'
import type { NotificationSeverity } from '#/features/notifications/types'
import { formatRelativeTime } from '#/shared/utils/date'

const severityConfig: Record<
  NotificationSeverity,
  { icon: React.ReactNode; tone: 'green' | 'yellow' | 'orange' | 'neutral' }
> = {
  info: { icon: <Info size={14} />, tone: 'neutral' },
  success: { icon: <CheckCircle2 size={14} />, tone: 'green' },
  warning: { icon: <AlertTriangle size={14} />, tone: 'yellow' },
  error: { icon: <AlertCircle size={14} />, tone: 'orange' },
}

interface NotificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationSheet({
  open,
  onOpenChange,
}: NotificationSheetProps) {
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationStore()

  const sorted = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [notifications],
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col border-l border-[var(--color-hairline)] bg-[var(--color-canvas)]"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-[var(--color-hairline)] px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-sm font-medium text-[var(--color-ink)]">
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Badge tone="orange" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--color-muted)] h-auto py-1 px-2"
              onClick={markAllAsRead}
            >
              <Check size={12} />
              Mark all read
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {sorted.length === 0 ? (
            <div className="p-6 flex items-center justify-center">
              <EmptyState
                variant="card"
                icon={<Bell />}
                title="No notifications"
                description="You're all caught up. New notifications will appear here."
              />
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-hairline)]">
              {sorted.map((n) => {
                const sev = severityConfig[n.severity]
                return (
                  <button
                    key={n.id}
                    type="button"
                    className={cn(
                      'w-full text-left px-4 py-3 transition-colors hover:bg-[var(--color-surface-soft)] focus:bg-[var(--color-surface-soft)] outline-none',
                      !n.read && 'bg-accent-blue-dim/30',
                    )}
                    onClick={() => {
                      if (!n.read) markAsRead(n.id)
                      if (n.actionTo) {
                        onOpenChange(false)
                        void navigate({ to: n.actionTo })
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                          sev.tone === 'green' &&
                            'bg-accent-green-dim text-accent-green',
                          sev.tone === 'yellow' &&
                            'bg-accent-yellow/10 text-accent-yellow',
                          sev.tone === 'orange' &&
                            'bg-accent-red/10 text-accent-red',
                          sev.tone === 'neutral' &&
                            'bg-accent-blue-dim text-accent-blue',
                        )}
                      >
                        {sev.icon}
                      </div>
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={cn(
                              'text-sm leading-snug',
                              !n.read
                                ? 'font-medium text-[var(--color-ink)]'
                                : 'text-[var(--color-muted)]',
                            )}
                          >
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-accent-blue shrink-0 mt-1.5" />
                          )}
                        </div>
                        {n.description && (
                          <p className="text-xs text-[var(--color-muted)] line-clamp-2">
                            {n.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[var(--color-muted-soft)]">
                            {formatRelativeTime(n.createdAt)}
                          </span>
                          {n.actionLabel && (
                            <span className="text-[11px] text-accent-blue font-medium">
                              {n.actionLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-[var(--color-hairline)] px-4 py-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-[var(--color-muted)]"
              onClick={() => {
                onOpenChange(false)
                void navigate({ to: '/dash/settings' })
              }}
            >
              Notification settings
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
