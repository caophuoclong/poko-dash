import { Skeleton } from './skeleton'

export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}
