import { cn } from '#/shared/utils'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-frost bg-surface p-4 space-y-2"
          >
            <div className="h-3 w-20 bg-surface-2 rounded" />
            <div className="h-8 w-16 bg-surface-2 rounded" />
            <div className="h-2.5 w-24 bg-surface-2 rounded" />
          </div>
        ))}
      </div>

      {/* Pipeline snapshot */}
      <div className="rounded-lg border border-frost bg-surface p-4">
        <div className="h-4 w-32 bg-surface-2 rounded mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-frost/50 bg-surface-2 p-3 space-y-2"
            >
              <div className="h-3 w-24 bg-surface rounded" />
              <div className="h-6 w-12 bg-surface rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-frost bg-surface p-4"
          >
            <div className="h-3 w-28 bg-surface-2 rounded mb-3" />
            <div className="h-16 w-full bg-surface-2 rounded" />
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-lg border border-frost bg-surface p-4">
          <div className="h-4 w-32 bg-surface-2 rounded mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md border border-frost/50 bg-surface-2 p-3"
              >
                <div className="h-3 w-full bg-surface rounded mb-2" />
                <div className="h-2.5 w-3/4 bg-surface rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-frost bg-surface p-4">
          <div className="h-4 w-32 bg-surface-2 rounded mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md border border-frost/50 bg-surface-2 p-3"
              >
                <div className="h-3 w-full bg-surface rounded mb-2" />
                <div className="h-2.5 w-3/4 bg-surface rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
