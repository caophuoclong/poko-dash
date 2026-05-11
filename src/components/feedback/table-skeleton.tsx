import { Skeleton } from './skeleton'

interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 6 }: TableSkeletonProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] overflow-hidden">
      <div className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 flex gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="p-3 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-3">
            <Skeleton className="h-4 col-span-3" />
            <Skeleton className="h-4 col-span-3" />
            <Skeleton className="h-4 col-span-2" />
            <Skeleton className="h-4 col-span-2" />
            <Skeleton className="h-4 col-span-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
