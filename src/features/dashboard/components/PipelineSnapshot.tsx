import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { DashboardPipelineStatus } from '#/dtos/dashboard'
import { Badge } from '@/components/ui/badge'
import { cn } from '#/shared/utils'

interface PipelineSnapshotProps {
  statuses: DashboardPipelineStatus[]
}

export function PipelineSnapshot({ statuses }: PipelineSnapshotProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border border-frost bg-surface p-4">
      <h3 className="text-sm font-semibold text-near-white mb-3">
        Pipeline status
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {statuses.map((status, index) => (
          <button
            key={index}
            onClick={() => {
              if (status.action) {
                navigate({ to: status.action.path as any })
              }
            }}
            disabled={!status.action}
            className={cn(
              'group rounded-md border bg-surface-2 p-3 text-left transition-colors',
              status.action
                ? 'border-frost/50 hover:border-frost hover:bg-surface cursor-pointer'
                : 'border-frost/30 cursor-default',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-muted-text mb-1.5">{status.label}</p>
              {status.action && (
                <ChevronRight
                  size={12}
                  className="text-muted-text/50 group-hover:text-muted-text transition-colors"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-near-white tabular-nums">
                {status.count}
              </p>
              {status.tone && status.tone !== 'neutral' && (
                <Badge tone={status.tone} size="sm">
                  {status.tone}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
