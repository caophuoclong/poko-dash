import { Skeleton } from '@/components/feedback/skeleton'
import { StatsSkeleton } from '@/components/feedback'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <StatsSkeleton />

      {/* Pipeline snapshot */}
      <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-sm)] border border-[var(--color-hairline-soft)] bg-[var(--color-surface-soft)] p-3 space-y-2"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4"
          >
            <Skeleton className="h-3 w-28 mb-3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, col) => (
          <div
            key={col}
            className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4"
          >
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-hairline-soft)] bg-[var(--color-surface-soft)] p-3"
                >
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-2.5 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
