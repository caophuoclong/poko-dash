import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, XCircle, ChevronRight } from 'lucide-react'
import type { DashboardAttentionItem } from '#/dtos/dashboard'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'

interface AttentionListProps {
  items: DashboardAttentionItem[]
}

export function AttentionList({ items }: AttentionListProps) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-frost bg-surface p-4">
        <h3 className="text-sm font-semibold text-near-white mb-3">
          Attention needed
        </h3>
        <EmptyState
          variant="inline"
          icon="check"
          title="All clear"
          description="No issues requiring attention"
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-frost bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-near-white">
          Attention needed
        </h3>
        <Badge tone="red" size="sm">
          {items.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate({ to: item.action.path as any })}
            className="group w-full rounded-md border border-frost/50 bg-surface-2 p-3 text-left transition-colors hover:border-frost hover:bg-surface"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {item.severity === 'error' ? (
                  <XCircle size={16} className="text-accent-red" />
                ) : (
                  <AlertTriangle size={16} className="text-accent-yellow" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-near-white mb-0.5">
                  {item.title}
                </p>
                <p className="text-xs text-muted-text">{item.description}</p>
              </div>
              <ChevronRight
                size={16}
                className="shrink-0 text-muted-text/50 group-hover:text-muted-text transition-colors"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
