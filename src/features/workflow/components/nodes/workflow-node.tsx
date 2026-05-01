import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Play,
  Clock,
  ListPlus,
  Globe,
  Layers,
  Filter,
  Link2,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch,
  Timer,
  Bell,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import {
  getNodeDefinition,
  getNodeSummaryData,
  CATEGORY_CONFIG,
} from '../../node-registry'
import '../../node-catalog'
import type { WorkflowNodeData } from '../../types'

const ICON_MAP: Record<string, LucideIcon> = {
  Play,
  Clock,
  ListPlus,
  Globe,
  Layers,
  Filter,
  LinkCheck: Link2,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch,
  Timer,
  Bell,
}

const statusConfig: Record<
  string,
  { dot: string; ring: string; label: string }
> = {
  completed: {
    dot: 'bg-accent-green',
    ring: 'ring-accent-green/20',
    label: 'Completed',
  },
  active: {
    dot: 'bg-accent-blue',
    ring: 'ring-accent-blue/20',
    label: 'Running',
  },
  pending: {
    dot: 'bg-accent-yellow',
    ring: 'ring-accent-yellow/20',
    label: 'Pending',
  },
  error: {
    dot: 'bg-accent-red',
    ring: 'ring-accent-red/20',
    label: 'Error',
  },
  paused: {
    dot: 'bg-muted-text',
    ring: 'ring-muted-text/20',
    label: 'Paused',
  },
}

function WorkflowNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData
  const Icon = nodeData.icon ? ICON_MAP[nodeData.icon] : null
  const status = nodeData.status ? statusConfig[nodeData.status] : null
  const def = nodeData.nodeTypeId
    ? getNodeDefinition(String(nodeData.nodeTypeId))
    : null
  const catConfig = def ? CATEGORY_CONFIG[def.category] : null

  const summaryItems =
    def && nodeData.config
      ? getNodeSummaryData(
          def.typeId,
          nodeData.config as Record<string, unknown>,
        )
      : null

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-frost !border-2 !border-surface !w-2.5 !h-2.5"
      />

      <div
        className={cn(
          'bg-surface border rounded-xl px-4 py-3 shadow-sm min-w-[240px] max-w-[280px]',
          'transition-all duration-150',
          selected
            ? 'border-accent-blue ring-1 ring-accent-blue/20'
            : 'border-frost hover:border-frost-hover',
        )}
      >
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                catConfig
                  ? `${catConfig.bgColor} ${catConfig.color}`
                  : nodeData.status === 'completed' &&
                      'bg-accent-green-dim text-accent-green',
                !catConfig &&
                  nodeData.status === 'active' &&
                  'bg-accent-blue-dim text-accent-blue',
                !catConfig &&
                  nodeData.status === 'pending' &&
                  'bg-accent-yellow/10 text-accent-yellow',
                !catConfig &&
                  nodeData.status === 'error' &&
                  'bg-accent-red/10 text-accent-red',
                !catConfig &&
                  !nodeData.status &&
                  'bg-surface-2 text-muted-text',
              )}
            >
              <Icon size={15} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-near-white truncate leading-tight">
                {nodeData.title}
              </span>
              {status && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none',
                    status.ring,
                    'ring-1',
                    nodeData.status === 'completed' && 'text-accent-green',
                    nodeData.status === 'active' && 'text-accent-blue',
                    nodeData.status === 'pending' && 'text-accent-yellow',
                    nodeData.status === 'error' && 'text-accent-red',
                    (nodeData.status as string) === 'paused' &&
                      'text-muted-text',
                  )}
                >
                  <span
                    className={cn('w-1.5 h-1.5 rounded-full', status.dot)}
                  />
                  {status.label}
                </span>
              )}
            </div>

            {nodeData.subtitle && (
              <p className="text-[11px] text-muted-text mt-0.5 leading-tight truncate">
                {nodeData.subtitle}
              </p>
            )}

            {summaryItems && summaryItems.length > 0 && (
              <div className="flex gap-3 mt-2 pt-2 border-t border-frost">
                {summaryItems.map((item: { label: string; value: string }) => (
                  <div key={item.label} className="flex items-baseline gap-1">
                    <span className="text-[12px] font-semibold text-near-white leading-none">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-muted-text leading-none">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!summaryItems &&
              nodeData.metrics &&
              nodeData.metrics.length > 0 && (
                <div className="flex gap-3 mt-2 pt-2 border-t border-frost">
                  {nodeData.metrics.map((m, i) => (
                    <div key={i} className="flex items-baseline gap-1">
                      <span className="text-[12px] font-semibold text-near-white leading-none">
                        {m.value}
                      </span>
                      <span className="text-[10px] text-muted-text leading-none">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-frost !border-2 !border-surface !w-2.5 !h-2.5"
      />
    </>
  )
}

export default memo(WorkflowNode)
