import { Skeleton } from './skeleton'

export function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton className="size-4 rounded-[var(--radius-xs)] shrink-0" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}
