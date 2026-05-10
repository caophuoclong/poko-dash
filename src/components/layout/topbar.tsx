import { useContext } from 'react'
import { Search, Bell } from 'lucide-react'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { PageHeaderContext } from '#/components/ui/page-header-context'

export function Topbar() {
  const ctx = useContext(PageHeaderContext)

  const breadcrumb = ctx?.config?.breadcrumb
  const title = ctx?.config?.title

  return (
    <div
      data-slot="topbar"
      className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] px-4 lg:px-6 h-12 shrink-0"
    >
      {/* Left: Sidebar trigger + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] lg:hidden" />
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

      {/* Right: Utilities */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[var(--radius-xs)] text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors"
          title="Search (⌘K)"
        >
          <Search size={14} />
          <span className="hidden sm:inline text-[11px]">⌘K</span>
        </button>
        <button
          className="relative flex items-center justify-center h-8 w-8 rounded-[var(--radius-xs)] text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors"
          title="Notifications"
        >
          <Bell size={15} />
        </button>
      </div>
    </div>
  )
}
