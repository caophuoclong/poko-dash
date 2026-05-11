import { Skeleton } from './skeleton'

export function WorkflowSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-16 rounded-[var(--radius-full)]" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 py-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="size-12 rounded-[var(--radius-sm)] mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={`line-${i}`} className="h-0.5 w-16" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}
