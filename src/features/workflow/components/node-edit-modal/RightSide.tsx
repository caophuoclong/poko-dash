import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData } from '../../types'
import { OutputPreviewPanel } from '../output-preview-panel'
import { getNodeDefinition } from '../../stores/node-registry/use-node-registry.store'
import type { NodeDefinition } from '../../stores/node-registry/use-node-registry.store'
import { ICON_MAP } from '../nodes/workflow-node.constants'
import type { PaneHeaderProps } from './types'
import type { VariableRef } from '../variable-system'

function PaneHeader({
  side, idx, total, title, subtitle, color, icon: Icon,
}: PaneHeaderProps) {
  return (
    <div className="px-4 py-2.5 border-b border-frost shrink-0 bg-surface-2/30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[9px] font-mono text-muted-text shrink-0">{idx}/{total}</span>
        {Icon && (
          <div className={cn('w-6 h-6 rounded flex items-center justify-center shrink-0', color ?? 'bg-surface-2 text-muted-text')}>
            <Icon size={12} />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[10px] font-mono tracking-wide uppercase text-muted-text/60 leading-none">{side}</div>
          <div className="text-[12px] font-medium text-near-white truncate leading-tight mt-0.5">{title}</div>
        </div>
      </div>
      {subtitle && <div className="text-[10px] text-muted-text truncate mt-1 ml-8">{subtitle}</div>}
    </div>
  )
}

interface RightSideProps {
  nextNodes: Node<WorkflowNodeData>[]
  nextIdx: number
  setNextIdx: React.Dispatch<React.SetStateAction<number>>
  nextNode: Node<WorkflowNodeData> | undefined
  catConfigBgColor?: string
  def: NodeDefinition | undefined
  localProps: Record<string, unknown>
  availableVars: VariableRef[]
}

export function RightSide({
  nextNodes,
  nextIdx,
  setNextIdx,
  nextNode,
  catConfigBgColor,
  def,
  localProps,
  availableVars,
}: RightSideProps) {
  const nextDef = nextNode
    ? getNodeDefinition((nextNode.data as WorkflowNodeData).nodeTypeId ?? '')
    : null
  const nextIcon = nextDef ? ICON_MAP[nextDef.identity.icon ?? ''] : undefined

  return (
    <div className="flex flex-col bg-surface-2/20 overflow-hidden">
      <PaneHeader
        side="OUTPUT TO NEXT"
        idx={3}
        total={3}
        title={
          nextNode
            ? ((nextNode.data as WorkflowNodeData).title ??
              nextDef?.identity.title ??
              'Unknown')
            : 'No downstream'
        }
        subtitle={
          nextNode
            ? nextDef?.identity.description
            : 'Connect to a downstream node'
        }
        color={nextDef ? catConfigBgColor : undefined}
        icon={nextIcon}
      />

      {nextNodes.length > 1 && (
        <div className="flex items-center justify-center gap-1 px-4 py-1.5 border-b border-frost bg-surface">
          <button
            onClick={() =>
              setNextIdx(
                (i) => (i - 1 + nextNodes.length) % nextNodes.length,
              )
            }
            className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[10px] font-mono text-muted-text">
            {nextIdx + 1}/{nextNodes.length}
          </span>
          <button
            onClick={() => setNextIdx((i) => (i + 1) % nextNodes.length)}
            className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <OutputPreviewPanel
          nextNodes={
            [nextNode].filter(Boolean) as Node<WorkflowNodeData>[]
          }
          selectedDef={def}
          localProps={localProps}
          variables={availableVars}
        />
      </div>
    </div>
  )
}
