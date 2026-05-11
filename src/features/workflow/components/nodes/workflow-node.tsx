import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  Handle,
  Position,
  useUpdateNodeInternals
  
} from '@xyflow/react'
import type {NodeProps} from '@xyflow/react';
import { Loader2, CheckCircle2, XCircle, Copy } from 'lucide-react'
import { cn } from '#/shared/utils'
import type { NodeExecutionData, WorkflowNodeData } from '../../types'
import {
  ICON_MAP,
  statusConfig,
  executionStatusStyles,
  NODE_COLOR_MAP,
} from './workflow-node.constants'
import { useNodeRegistryStore } from '../../stores/node-registry/use-node-registry.store'
import { CATEGORY_CONFIG } from '../../stores/node-registry/constants'
import { useExecutionStore } from '../../stores/execution-store/useExecutionStore'
import { PortDot } from './PortDot'

function WorkflowNode({ data, selected, id }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData
  const Icon = nodeData.icon ? ICON_MAP[nodeData.icon] : null
  const status = nodeData.status ? statusConfig[nodeData.status] : null
  const definitionStore = useNodeRegistryStore()

  const def = definitionStore.getNodeDefinition(nodeData.nodeTypeId || '')
  const catConfig = def ? CATEGORY_CONFIG[def.identity.category] : null
  const nodeColor = def ? def.ui.color : undefined
  const colorStyles = nodeColor ? NODE_COLOR_MAP[nodeColor] : null
  const updateNodeInternals = useUpdateNodeInternals()
  const executionsStore = useExecutionStore()
  const executionStatus =
    executionsStore.nodeExecutions?.find((n) => n.nodeId === id)?.status ??
    'idle'
  const execInfo =
    executionsStore.nodeExecutions?.find((n) => n.nodeId === id) ??
    ({} as NodeExecutionData)

  const inputs = def ? def.io.inputs : []
  const outputs = def ? def.io.outputs : []

  useLayoutEffect(() => {
    updateNodeInternals(id)
  }, [id, inputs.length, outputs.length, updateNodeInternals])

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => updateNodeInternals(id))
    return () => cancelAnimationFrame(raf)
  }, [id, inputs, outputs, updateNodeInternals])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => updateNodeInternals(id))
    const el = document.querySelector(`[data-id="${id}"]`)
    if (el) resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [id, updateNodeInternals])

  const execStyles =
    executionStatusStyles[executionStatus] ?? executionStatusStyles.idle

  const summaryItems =
    def && nodeData.config
      ? definitionStore.getNodeSummaryData(
          def.identity.typeId,
          nodeData.config,
        )
      : null
  const hasMultiPort = inputs.length > 1 || outputs.length > 1

  const handleDuplicate = useCallback(() => {
    const event = new CustomEvent('workflow-node-duplicate', {
      detail: { nodeId: id },
      bubbles: true,
    })
    document.dispatchEvent(event)
  }, [id])

  return (
    <div className={cn('relative', hasMultiPort && 'min-h-[80px]')}>
      <div
        className={cn(
          'bg-surface border rounded-xl px-3.5 py-3 shadow-sm min-w-[220px] max-w-[260px]',
          'transition-all duration-150 relative',
          selected
            ? 'border-accent-blue ring-1 ring-accent-blue/20 shadow-md shadow-accent-blue/5'
            : colorStyles
              ? cn(colorStyles.border, 'hover:border-opacity-50')
              : 'border-frost hover:border-frost-hover hover:shadow-sm',
          execStyles.border,
          execStyles.bg,
          execStyles.overlay,
        )}
      >
        {executionStatus === 'running' && (
          <div className="absolute -top-1 -right-1">
            <Loader2 size={16} className="text-accent-blue animate-spin" />
          </div>
        )}

        {executionStatus === 'completed' && (
          <div className="absolute -top-1 -right-1">
            <CheckCircle2 size={14} className="text-accent-green" />
          </div>
        )}

        {executionStatus === 'failed' && (
          <div className="absolute -top-1 -right-1">
            <XCircle size={14} className="text-accent-red" />
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                colorStyles
                  ? cn(colorStyles.bg, colorStyles.text)
                  : catConfig
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

          <button
            onClick={handleDuplicate}
            className={cn(
              'w-5 h-5 flex items-center justify-center rounded text-muted-text hover:text-accent-blue hover:bg-accent-blue-dim transition-colors shrink-0 invisible',
              selected && 'text-accent-blue',
              selected && 'visible',
            )}
            title="Duplicate node"
          >
            <Copy size={11} />
          </button>
        </div>

        {execInfo.outputSummary && executionStatus === 'completed' && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 pt-2 border-t border-accent-green/20">
            {Object.entries(execInfo.outputSummary).map(([key, val]) => {
              if (key === 'items' || val === undefined || val === null)
                return null
              return (
                <div key={key} className="flex items-baseline gap-1">
                  <span className="text-[11px] font-semibold text-near-white leading-none">
                    {typeof val === 'object'
                      ? JSON.stringify(val)
                      : String(val)}
                  </span>
                  <span className="text-[9px] text-muted-text leading-none">
                    {key}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {!summaryItems && nodeData.metrics && nodeData.metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 pt-2 border-t border-frost">
            {nodeData.metrics.map((m, i) => (
              <div key={i} className="flex items-baseline gap-1">
                <span className="text-[11px] font-semibold text-near-white leading-none">
                  {m.value}
                </span>
                <span className="text-[9px] text-muted-text leading-none">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {def && def.identity.typeId === 'logic.condition' && (
          <div className="mt-1.5 pt-1.5 border-t border-frost">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono rounded px-1.5 py-0.5 bg-accent-yellow/10 text-accent-yellow">
                {((nodeData.config as Record<string, unknown>)
                  ?.logic as string) === 'any'
                  ? 'ANY'
                  : 'ALL'}
              </span>
              <span className="text-[10px] text-muted-text">
                {Array.isArray(
                  (nodeData.config as Record<string, unknown>)?.rules,
                )
                  ? `${((nodeData.config as Record<string, unknown>).rules as unknown[]).length} rule(s)`
                  : '0 rules'}
              </span>
            </div>
          </div>
        )}

        {/* Ports rendered inside card for width-relative centering */}
        {inputs.map((port, i) => (
          <PortDot
            key={`in-${port.id}`}
            port={port}
            type="target"
            position={Position.Left}
            index={i}
            total={inputs.length}
          />
        ))}

        {outputs.map((port, i) => {
          return (
            <PortDot
              key={`out-${port.id}`}
              port={port}
              type="source"
              position={Position.Right}
              index={i}
              total={outputs.length}
            />
          )
        })}
      </div>
    </div>
  )
}

export default memo(WorkflowNode)
