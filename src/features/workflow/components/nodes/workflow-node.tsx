import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import {
  getNodeDefinition,
  getNodeSummaryData,
  CATEGORY_CONFIG,
} from '../../node-registry'
import type { WorkflowNodeData } from '../../types'
import { useNodeExecutionStatus } from '../../hooks/use-node-execution-status'
import { ICON_MAP, statusConfig, executionStatusStyles } from './workflow-node.constants'

function WorkflowNode({ data, selected, id }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData
  const Icon = nodeData.icon ? ICON_MAP[nodeData.icon] : null
  const status = nodeData.status ? statusConfig[nodeData.status] : null
  const def = nodeData.nodeTypeId ? getNodeDefinition(String(nodeData.nodeTypeId)) : null
  const catConfig = def ? CATEGORY_CONFIG[def.category] : null

  const executionStatus = useNodeExecutionStatus(id)

  const execStyles = executionStatusStyles[executionStatus] ?? executionStatusStyles.idle

  const summaryItems = def && nodeData.config
    ? getNodeSummaryData(def.typeId, nodeData.config as Record<string, unknown>)
    : null

  const hasMultiOutput = def && def.outputs.length > 1

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        className="!bg-frost !border-2 !border-surface !w-2.5 !h-2.5"
      />

      <div
        className={cn(
          'bg-surface border rounded-xl px-3.5 py-3 shadow-sm min-w-[220px] max-w-[260px]',
          'transition-all duration-150 relative',
          selected
            ? 'border-accent-blue ring-1 ring-accent-blue/20 shadow-md shadow-accent-blue/5'
            : 'border-frost hover:border-frost-hover hover:shadow-sm',
          execStyles.border,
          execStyles.bg,
          execStyles.overlay,
        )}
      >
        {executionStatus === 'running' && (
          <div className="absolute -top-1 -right-1">
            <Loader2
              size={16}
              className="text-accent-blue animate-spin"
            />
          </div>
        )}

        {executionStatus === 'success' && (
          <div className="absolute -top-1 -right-1">
            <CheckCircle2 size={14} className="text-accent-green" />
          </div>
        )}

        {executionStatus === 'error' && (
          <div className="absolute -top-1 -right-1">
            <XCircle size={14} className="text-accent-red" />
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                catConfig
                  ? `${catConfig.bgColor} ${catConfig.color}`
                  : 'bg-surface-2 text-muted-text',
              )}
            >
              <Icon size={14} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-near-white truncate leading-tight">
                {nodeData.title}
              </span>
              {status && executionStatus === 'idle' && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 px-1 py-px rounded-full text-[9px] font-medium leading-none shrink-0',
                    status.ring, 'ring-1',
                    nodeData.status === 'completed' && 'text-accent-green',
                    nodeData.status === 'active' && 'text-accent-blue',
                    nodeData.status === 'pending' && 'text-accent-yellow',
                    nodeData.status === 'error' && 'text-accent-red',
                    (nodeData.status as string) === 'paused' && 'text-muted-text',
                  )}
                >
                  <span className={cn('w-1 h-1 rounded-full', status.dot)} />
                  {status.label}
                </span>
              )}
            </div>

            {nodeData.subtitle && (
              <p className="text-[10px] text-muted-text mt-0.5 leading-tight truncate">
                {nodeData.subtitle}
              </p>
            )}
          </div>
        </div>

        {(summaryItems && summaryItems.length > 0) && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 pt-2 border-t border-frost">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-baseline gap-1">
                <span className="text-[11px] font-semibold text-near-white leading-none">
                  {item.value}
                </span>
                <span className="text-[9px] text-muted-text leading-none">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {!summaryItems && nodeData.metrics && nodeData.metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 pt-2 border-t border-frost">
            {nodeData.metrics.map((m, i) => (
              <div key={i} className="flex items-baseline gap-1">
                <span className="text-[11px] font-semibold text-near-white leading-none">{m.value}</span>
                <span className="text-[9px] text-muted-text leading-none">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {def && def.typeId === 'logic.condition' && (
          <div className="mt-1.5 pt-1.5 border-t border-frost">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono rounded px-1.5 py-0.5 bg-accent-yellow/10 text-accent-yellow">
                {((nodeData.config as Record<string, unknown>)?.logic as string) === 'any' ? 'ANY' : 'ALL'}
              </span>
              <span className="text-[10px] text-muted-text">
                {Array.isArray((nodeData.config as Record<string, unknown>)?.rules)
                  ? `${((nodeData.config as Record<string, unknown>).rules as unknown[]).length} rule(s)`
                  : '0 rules'}
              </span>
            </div>
          </div>
        )}
      </div>

      {hasMultiOutput && def ? (
        <div className="flex items-end justify-between px-4 gap-1">
          {def.outputs.map((port) => (
            <div key={port.id} className={cn('flex flex-col items-center')}>
              <Handle
                id={port.id}
                type="source"
                position={Position.Bottom}
                className={cn(
                  '!static !transform-none !w-2.5 !h-2.5 !border-2 !border-surface',
                  port.type === 'data' ? '!bg-accent-blue' : port.type === 'signal' ? '!bg-accent-orange' : '!bg-accent-red',
                )}
              />
              <span className="text-[9px] font-medium text-muted-text mt-0.5">
                {port.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <Handle
          type="source"
          id="output"
          position={Position.Bottom}
          className="!bg-frost !border-2 !border-surface !w-2.5 !h-2.5"
        />
      )}
    </>
  )
}

export default memo(WorkflowNode)
