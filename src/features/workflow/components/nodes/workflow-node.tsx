import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from '@xyflow/react'
import { Loader2, CheckCircle2, XCircle, Copy } from 'lucide-react'
import { cn } from '#/shared/utils'
import {
  useNodeRegistryStore,
  getNodeSummaryData,
  CATEGORY_CONFIG,
} from '../../node-registry'
import type { WorkflowNodeData } from '../../types'
import type { PortDefinition } from '../../node-types'
import { useNodeExecutionStatus } from '../../hooks/use-node-execution-status'
import {
  ICON_MAP,
  statusConfig,
  executionStatusStyles,
  PORT_KIND_COLOR,
} from './workflow-node.constants'

const PORT_SPACING = 22

function PortDot({
  port,
  type,
  position,
  index,
  total,
}: {
  port: PortDefinition
  type: 'target' | 'source'
  position: Position
  index: number
  total: number
}) {
  const color = PORT_KIND_COLOR[port.type] ?? PORT_KIND_COLOR.data
  const isInput = type === 'target'
  const spacing = 100 / (total + 1)
  const top = spacing * (index + 1)

  return (
    <>
      <Handle
        id={port.id}
        type={type}
        position={position}
        style={{ top: `${top}%` }}
        className={cn(
          isInput
            ? '!w-[3px] !h-[14px] !rounded-[1px] !border-0'
            : '!w-[10px] !h-[10px] !rounded-full !border-0',
          'transition-transform hover:!scale-125',
          color,
        )}
        title={port.label || port.id}
      />
      {port.label && (
        <span
          className="absolute text-[9px] font-mono font-bold tracking-wider uppercase text-muted-text select-none pointer-events-none"
          style={{
            top: `calc(${top}% + 4px)`,

            left: isInput ? '0%' : '100%',

            transform: isInput
              ? 'translate(-120%, -50%)'
              : 'translate(20%, -50%)',
          }}
        >
          {port.label}
        </span>
      )}
    </>
  )
}

function WorkflowNode({ data, selected, id }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData
  const Icon = nodeData.icon ? ICON_MAP[nodeData.icon] : null
  const status = nodeData.status ? statusConfig[nodeData.status] : null
  const def = useNodeRegistryStore((s) =>
    nodeData.nodeTypeId ? s.definitions[String(nodeData.nodeTypeId)] : undefined
  )
  const catConfig = def ? CATEGORY_CONFIG[def.category] : null
  const updateNodeInternals = useUpdateNodeInternals()
  const executionStatus = useNodeExecutionStatus(id)

  const inputs = def?.inputs ?? [
    { id: 'target', label: '', type: 'data' as const },
  ]
  const outputs = def?.outputs ?? [
    { id: 'output', label: '', type: 'data' as const },
  ]

  useLayoutEffect(() => {
    updateNodeInternals(id)
  }, [id, inputs.length, outputs.length, updateNodeInternals])

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => updateNodeInternals(id))
    return () => cancelAnimationFrame(raf)
  }, [id, inputs, outputs, updateNodeInternals])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => updateNodeInternals(id))
    const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null
    if (el) resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [id, updateNodeInternals])

  const execStyles =
    executionStatusStyles[executionStatus] ?? executionStatusStyles.idle

  const summaryItems =
    def && nodeData.config
      ? getNodeSummaryData(
          def.typeId,
          nodeData.config as Record<string, unknown>,
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

        {summaryItems && summaryItems.length > 0 && (
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

        {def && def.typeId === 'logic.condition' && (
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
