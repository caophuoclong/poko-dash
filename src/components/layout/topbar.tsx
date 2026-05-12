import { useContext, useState } from 'react'
import { Search, Bell, ChevronLeft } from 'lucide-react'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { PageHeaderContext } from '#/components/ui/page-header-context'
import { openCommandPalette } from '#/components/patterns/command-palette'
import { NotificationSheet } from '#/features/notifications/components/notification-sheet'
import { useNotificationStore } from '#/features/notifications/stores/notification-store'
import { Badge } from '#/components/ui/badge'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/button'

export function Topbar() {
  const ctx = useContext(PageHeaderContext)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const breadcrumb = ctx?.config?.breadcrumb
  const title = ctx?.config?.title
  const action = ctx?.config?.actions
  const center = ctx?.config?.center
  const backHref = ctx?.config?.backHref
  const backLabel = ctx?.config?.backLabel
  const navigate = useNavigate()
  return (
    <div
      data-slot="topbar"
      className="sticky top-0 z-10 flex items-center justify-between bg-surface gap-4 border-b border-[var(--color-hairline)] px-4 lg:px-6 h-12 shrink-0"
    >
      {/* Left: Sidebar trigger + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] lg:hidden" />
        {backHref ? (
          <Button
            onClick={() => {
              void navigate({ to: backHref })
            }}
            size={'sm'}
            variant={'link'}
            className="cursor-pointer"
            // className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            <ChevronLeft className="size-3.5" />
            <span>{backLabel}</span>
          </Button>
        ) : null}
        {title ? (
          <div className="flex items-center gap-1.5 min-w-0 text-sm">
            {breadcrumb ? (
              <>
                <span className="text-[var(--color-muted-soft)] shrink-0">
                  {breadcrumb}
                </span>
                <span className="text-[var(--color-muted)] shrink-0">/</span>
              </>
            ) : null}
            <span className="text-[var(--color-ink)] truncate font-medium">
              {title}
            </span>
          </div>
        ) : null}
      </div>
      {/* Center */}
      {center ? (
        <div className="absolute inset-x-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">{center}</div>
        </div>
      ) : null}
      {/* Right: Utilities */}
      <div className="flex items-center gap-1 shrink-0">
        {action}
        <button
          className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[var(--radius-xs)] text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors"
          title="Search (⌘K)"
          onClick={openCommandPalette}
        >
          <Search size={14} />
          <span className="hidden sm:inline text-[11px]">⌘K</span>
        </button>
        <button
          className="relative flex items-center justify-center h-8 w-8 rounded-[var(--radius-xs)] text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors"
          title="Notifications"
          onClick={() => setNotificationOpen(true)}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <Badge
              tone="orange"
              size="sm"
              className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] leading-none rounded-full"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </div>

      <NotificationSheet
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
    </div>
  )
}
