import {
  BaseEdge,
  EdgeLabelRenderer,
  MarkerType,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
} from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'
import { X } from 'lucide-react'
import { cn } from '#/shared/utils'
import type { EdgeType } from '../../node-types.old.abcd'

export type EdgeStyle =
  | 'auto'
  | 'bezier'
  | 'straight'
  | 'polyline'
  | 'step'
  | 'smoothstep'
  | 'quadratic'
  | 'cubic'

const EDGE_STYLES: EdgeStyle[] = [
  'auto',
  'bezier',
  'straight',
  'polyline',
  'step',
  'smoothstep',
  'quadratic',
  'cubic',
]

const EDGE_TYPE_CONFIG: Record<string, { stroke: string; dash?: string }> = {
  main: { stroke: 'var(--t-frost)' },
  reference: { stroke: 'var(--t-accent-blue)', dash: '4 2' },
  error: { stroke: 'var(--t-accent-red)' },
  condition_true: { stroke: 'var(--t-accent-green)' },
  condition_false: { stroke: 'var(--t-accent-red)' },
}

function pickAutoStyle(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): EdgeStyle {
  const dx = tx - sx
  const dy = ty - sy
  const adx = Math.abs(dx)
  const ady = Math.abs(dy)
  if (ady < 12 && dx > 0) return 'straight'
  if (adx < 40) return 'smoothstep'
  if (ady > adx * 2.2) return 'smoothstep'
  if (adx > 360 && ady < 120) return 'cubic'
  return 'bezier'
}

function getEdgePath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  style: EdgeStyle,
  sourcePosition: Position,
  targetPosition: Position,
): [path: string, labelX: number, labelY: number] {
  const resolved =
    style === 'auto' ? pickAutoStyle(sourceX, sourceY, targetX, targetY) : style

  const sp = sourcePosition
  const tp = targetPosition

  switch (resolved) {
    case 'straight': {
      const [d, lx, ly] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      })
      return [d, lx, ly]
    }
    case 'smoothstep': {
      const [d, lx, ly] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition: sp,
        targetX,
        targetY,
        targetPosition: tp,
      })
      return [d, lx, ly]
    }
    case 'step': {
      const midY = (sourceY + targetY) / 2
      const d = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`
      return [d, (sourceX + targetX) / 2, midY]
    }
    case 'polyline': {
      const midX = (sourceX + targetX) / 2
      const midY = (sourceY + targetY) / 2
      const d = `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`
      return [d, midX, midY]
    }
    case 'quadratic':
    case 'cubic':
    case 'bezier':
    default: {
      const curvature =
        resolved === 'cubic' ? 0.7 : resolved === 'quadratic' ? 0.25 : 0.5
      const [d, lx, ly] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition: sp,
        targetX,
        targetY,
        targetPosition: tp,
        curvature,
      })
      return [d, lx, ly]
    }
  }
}

interface WorkflowEdgeData {
  style?: EdgeStyle
  label?: string
  accent?: string
  edgeType?: EdgeType
}

export type WorkflowEdgeProps = EdgeProps & { data?: WorkflowEdgeData }

export function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
  selected,
  markerEnd,
  style: baseStyle,
  data,
}: WorkflowEdgeProps) {
  const resolved = data?.style ?? 'auto'
  const edgeTypeConfig = data?.edgeType ? EDGE_TYPE_CONFIG[data.edgeType] : null
  const edgeTypeLabel =
    data?.edgeType === 'condition_true'
      ? 'true'
      : data?.edgeType === 'condition_false'
        ? 'false'
        : undefined
  const label = edgeTypeLabel ?? data?.label
  const accent = data?.accent

  const [d, labelX, labelY] = getEdgePath(
    sourceX,
    sourceY,
    targetX,
    targetY,
    resolved,
    sourcePosition,
    targetPosition,
  )

  const edgeColor =
    edgeTypeConfig?.stroke ??
    accent ??
    (selected ? 'var(--t-accent-blue)' : 'var(--t-frost)')

  const edgeStyle = edgeTypeConfig?.dash
    ? { strokeDasharray: edgeTypeConfig.dash }
    : undefined

  const hasPath = d && d.length > 0

  return (
    <>
      {hasPath && (
        <path d={d} stroke="transparent" strokeWidth="20" fill="none" />
      )}
      {hasPath && (
        <BaseEdge
          id={id}
          path={d}
          style={{
            ...baseStyle,
            stroke: edgeColor,
            strokeWidth: selected ? 2 : (baseStyle?.strokeWidth ?? 1.5),
            ...edgeStyle,
          }}
          markerEnd={
            (markerEnd ?? {
              type: MarkerType.ArrowClosed,
              color: edgeColor,
              width: 16,
              height: 16,
            }) as string
          }
        />
      )}

      {label && hasPath && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] font-mono text-muted-text bg-surface/80 px-1.5 py-0.5 rounded border border-frost pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}

      {selected && hasPath && (
        <EdgeLabelRenderer>
          <div
            className="absolute nodrag nopan pointer-events-auto z-[1000] flex items-center gap-0.5 bg-surface border border-frost rounded-lg p-0.5 shadow-sm"
            style={{
              transform: `translate(-50%, 0) translate(${labelX}px, ${labelY + 14}px)`,
              pointerEvents: 'all',
            }}
          >
            {EDGE_STYLES.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation()
                  document.dispatchEvent(
                    new CustomEvent('workflow-edge-style-change', {
                      detail: { edgeId: id, style: s },
                    }),
                  )
                }}
                className={cn(
                  'text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded transition-colors',
                  resolved === s
                    ? 'bg-accent-blue-dim text-accent-blue'
                    : 'text-muted-text hover:text-near-white hover:bg-surface-2',
                )}
                title={s}
              >
                {s.slice(0, 4)}
              </button>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation()
                document.dispatchEvent(
                  new CustomEvent('workflow-edge-delete', {
                    detail: { edgeId: id },
                  }),
                )
              }}
              className="ml-1 w-5 h-5 flex items-center justify-center rounded text-muted-text hover:text-accent-red hover:bg-accent-red/10 transition-colors"
              title="Delete edge"
            >
              <X size={10} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
