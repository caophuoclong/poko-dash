import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData } from '../../types'
import { UpstreamDataView } from '../draggable-field-tag'
import { useExecutionStore } from '../../stores/execution-store/useExecutionStore'
import {
  getNodeDefinition,
  useNodeRegistryStore,
} from '../../stores/node-registry/use-node-registry.store'
import { ICON_MAP } from '../nodes/workflow-node.constants'
import type { PaneHeaderProps } from './types'
import { useWorkflow } from '../../hooks/use-workflows'

function PaneHeader({
  side,
  idx,
  total,
  title,
  subtitle,
  color,
  icon: Icon,
}: PaneHeaderProps) {
  return (
    <div className="px-4 py-2.5 border-b border-frost shrink-0 bg-surface-2/30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[9px] font-mono text-muted-text shrink-0">
          {idx}/{total}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-6 h-6 rounded flex items-center justify-center shrink-0',
              color ?? 'bg-surface-2 text-muted-text',
            )}
          >
            <Icon size={12} />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[10px] font-mono tracking-wide uppercase text-muted-text/60 leading-none">
            {side}
          </div>
          <div className="text-[12px] font-medium text-near-white truncate leading-tight mt-0.5">
            {title}
          </div>
        </div>
      </div>
      {subtitle && (
        <div className="text-[10px] text-muted-text truncate mt-1 ml-8">
          {subtitle}
        </div>
      )}
    </div>
  )
}

function synthesizeOutput(
  node: Node<WorkflowNodeData>,
): Record<string, unknown> {
  const nodeData = node.data as WorkflowNodeData
  const def = nodeData.nodeTypeId
    ? getNodeDefinition(String(nodeData.nodeTypeId))
    : null
  const config = (nodeData.config ?? {}) as Record<string, unknown>
  const merged: Record<string, unknown> = {
    id: node.id,
    __node_label: nodeData.title ?? node.id,
  }
  for (const schema of def?.config.propertySchema ?? []) {
    const val = config[schema.key] ?? schema.default
    if (val !== undefined && val !== null && val !== '') {
      merged[schema.key] = val
    }
  }
  if (Object.keys(merged).length <= 2) {
    return {
      id: node.id,
      __node_label: nodeData.title ?? node.id,
      ...(config as Record<string, unknown>),
    }
  }
  return merged
}

interface LeftSideProps {
  prevNodes: Node<WorkflowNodeData>[]
  prevIdx: number
  setPrevIdx: React.Dispatch<React.SetStateAction<number>>
  prevNode: Node<WorkflowNodeData> | undefined
  catConfigBgColor?: string
}

export function LeftSide({
  prevNodes,
  prevIdx,
  setPrevIdx,
  prevNode,
  catConfigBgColor,
}: LeftSideProps) {
    const nodeRegistry = useNodeRegistryStore().getNodeDefinition(
      prevNode?.data.nodeTypeId ?? '',
    )
  const executionStore = useExecutionStore()
  const prevExecInfo = executionStore.nodeExecutions.find(
    (ne) => ne.nodeId === prevNode?.id,
  )
  const upstreamData = useMemo(() => {
    if (!prevNode) return null
    // const synthesized = synthesizeOutput(prevNode)
    console.log('🚀 ~ LeftSide ~ prevNode:', prevNode)
    if (
      prevExecInfo &&
      prevExecInfo.status === 'completed' &&
      prevExecInfo.outputSummary
    ) {
      return {
        // ...synthesized,
        // ...prevExecInfo.outputSummary,
        // ...(nodeRegistry || {}).config?.suggestedVariables,
        ...prevExecInfo.outputData,
      }
    }
    // return synthesized
  }, [prevNode, prevExecInfo])

  const upstreamDef = prevNode
    ? getNodeDefinition((prevNode.data as WorkflowNodeData).nodeTypeId ?? '')
    : null
  const upstreamIcon = upstreamDef
    ? ICON_MAP[upstreamDef.identity.icon ?? '']
    : undefined

  return (
    <div className="flex flex-col bg-surface-2/20 overflow-hidden">
      <PaneHeader
        side="INPUT FROM PREVIOUS"
        idx={1}
        total={3}
        title={
          prevNode
            ? ((prevNode.data as WorkflowNodeData).title ??
              upstreamDef?.identity.title ??
              'Unknown')
            : 'No upstream'
        }
        subtitle={
          prevNode ? `Connect an upstream node to see its output` : undefined
        }
        color={upstreamDef ? catConfigBgColor : undefined}
        icon={upstreamIcon}
      />

      {prevNodes.length > 1 && (
        <div className="flex items-center justify-center gap-1 px-4 py-1.5 border-b border-frost bg-surface">
          <button
            onClick={() =>
              setPrevIdx((i) => (i - 1 + prevNodes.length) % prevNodes.length)
            }
            className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[10px] font-mono text-muted-text">
            {prevIdx + 1}/{prevNodes.length}
          </span>
          <button
            onClick={() => setPrevIdx((i) => (i + 1) % prevNodes.length)}
            className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {prevNode ? (
          <UpstreamDataView
            data={upstreamData}
            nodeName={((prevNode.data as WorkflowNodeData).title ?? '').replace(
              /\s+/g,
              '_',
            )}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-6 text-center">
            <div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg border border-dashed border-frost/50 flex items-center justify-center">
                <span className="text-2xl text-muted-text/30">↑</span>
              </div>
              <p className="text-[11px] text-muted-text max-w-[200px]">
                No previous node. This must be a trigger or unconnected.
              </p>
            </div>
          </div>
        )}
      </div>

      {prevNode && (
        <div className="border-t border-frost px-4 py-2 bg-surface flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(upstreamData, null, 2),
              )
            }}
            className="text-[10px] font-mono font-bold text-muted-text hover:text-near-white px-2 py-1 rounded hover:bg-surface-2 transition-colors"
          >
            COPY JSON
          </button>
          <span className="ml-auto text-[10px] font-mono text-muted-text/50">
            {Object.keys(upstreamData ?? {}).length} keys
          </span>
        </div>
      )}
    </div>
  )
}
