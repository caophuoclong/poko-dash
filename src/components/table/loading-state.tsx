import { TableSkeleton } from '@/components/feedback'

interface TableLoadingStateProps {
  message?: string
}

export function TableLoadingState({
  message = 'Đang tải...',
}: TableLoadingStateProps) {
  return (
    <div className="space-y-3">
      <TableSkeleton rows={6} />
      <p className="text-xs text-[var(--color-muted)] text-center">{message}</p>
    </div>
  )
}
