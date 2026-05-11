import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Repeat } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData } from '../../types'
import { UpstreamDataView, SyntheticVariableTag } from '../draggable-field-tag'
import { useExecutionStore } from '../../stores/execution-store/useExecutionStore'
import { getNodeDefinition } from '../../stores/node-registry/use-node-registry.store'
import { ICON_MAP } from '../nodes/workflow-node.constants'
import type { PaneHeaderProps } from './types'
import { findLoopScope } from '../../utils/loop-scope-utils'
import { resolveLoopItem } from '../../utils/loop-output-utils'

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

interface LeftSideProps {
  prevNodes: Node<WorkflowNodeData>[]
  prevIdx: number
  setPrevIdx: React.Dispatch<React.SetStateAction<number>>
  prevNode: Node<WorkflowNodeData> | undefined
  catConfigBgColor?: string
  nodeId: string
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
}

export function LeftSide({
  prevNodes,
  prevIdx,
  setPrevIdx,
  prevNode,
  catConfigBgColor,
  nodeId,
  nodes,
  edges,
}: LeftSideProps) {
  const executionStore = useExecutionStore()
  const prevExecInfo = executionStore.nodeExecutions.find(
    (ne) => ne.nodeId === prevNode?.id,
  )

  const loopScope = useMemo(
    () => findLoopScope(nodeId, nodes, edges),
    [nodeId, nodes, edges],
  )

  const loopContextVariables = useMemo(() => {
    if (!loopScope.inLoopScope) return []
    return [
      {
        id: 'loop.item',
        label: 'item',
        description: 'Current array element at this iteration',
      },
      {
        id: 'loop.index',
        label: 'index',
        description: 'Current iteration index (0-based)',
      },
      {
        id: 'loop.items',
        label: 'items',
        description: 'Full input array being iterated',
      },
      {
        id: 'loop.length',
        label: 'length',
        description: 'Total number of items in the loop',
      },
      {
        id: 'loop.isFirst',
        label: 'isFirst',
        description: 'True when index is 0',
      },
      {
        id: 'loop.isLast',
        label: 'isLast',
        description: 'True for final iteration',
      },
    ]
  }, [loopScope.inLoopScope])

  /** Sample data for loop.item — resolved from loop node execution output via canonical shape first, fallback to heuristic */
  const loopItemSample = useMemo(() => {
    if (!loopScope.inLoopScope || !loopScope.loopNodeId) return null
    const loopExec = executionStore.nodeExecutions.find(
      (ne) => ne.nodeId === loopScope.loopNodeId,
    )
    return resolveLoopItem(loopExec?.outputData)
  }, [loopScope, executionStore.nodeExecutions])

  const loopScopeTitle = loopScope.loopNodeName
    ? `Loop context from ${loopScope.loopNodeName}`
    : 'Loop context variables'
  const upstreamData = useMemo(() => {
    if (!prevNode) return null
    // const synthesized = synthesizeOutput(prevNode)
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
    ? getNodeDefinition((prevNode.data).nodeTypeId ?? '')
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
            ? ((prevNode.data).title ??
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

      {loopScope.inLoopScope && loopContextVariables.length > 0 && (
        <div className="border-b border-frost bg-surface-2/50">
          <div className="px-3 py-2 flex items-center gap-2 border-b border-frost/30">
            <Repeat size={11} className="text-accent-green" />
            <span className="text-[10px] font-mono tracking-wide uppercase text-accent-green">
              LOOP CONTEXT
            </span>
          </div>
          <div className="p-3 space-y-1">
            {loopContextVariables.map((v) => (
              <SyntheticVariableTag
                key={v.id}
                varId={v.id}
                label={v.label}
                description={v.description}
                typeHint="variable"
              />
            ))}
          </div>
          {loopItemSample && (
            <div className="px-3 pb-3">
              <div className="text-[9px] font-mono tracking-wide uppercase text-muted-text/70 mb-1.5">
                loop.item preview
              </div>
              <UpstreamDataView
                data={loopItemSample}
                nodeName="loop_item"
                baseRef="loop.item"
              />
            </div>
          )}
          <div className="px-3 py-1.5 border-t border-frost/30 bg-surface">
            <p className="text-[9px] text-muted-text/70">{loopScopeTitle}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {prevNode ? (
          <UpstreamDataView
            data={upstreamData}
            nodeName={((prevNode.data).title ?? '').replace(
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
