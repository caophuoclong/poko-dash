import type { IdeaStatus } from '#/features/contents/schemas/content.schema'
import { cn } from '#/shared/utils'

interface StatusConfig {
  label: string
  dot: string
  bg: string
}

interface RowStatusCellProps {
  status?: IdeaStatus
  config: Record<IdeaStatus, StatusConfig>
}

export function RowStatusCell({ status, config }: RowStatusCellProps) {
  const display = status ? config[status] : undefined
  if (!display) return <span className="text-sm text-muted-text">{status}</span>
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md font-medium whitespace-nowrap',
        display.bg,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', display.dot)} />
      {display.label}
    </span>
  )
}
