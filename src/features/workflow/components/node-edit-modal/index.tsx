import { useState } from 'react'
import { X, GripHorizontal, Route, Play } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData, WorkflowVariable } from '../../types'
import { useNodeEditModal } from '../../hooks/use-node-edit-modal'
import { LeftSide } from './LeftSide'
import { NodeEdit } from './NodeEdit'
import { RightSide } from './RightSide'

interface NodeEditModalProps {
  open: boolean
  nodeId: string
  data: WorkflowNodeData
  position: { x: number; y: number }
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  workflowVariables?: WorkflowVariable[]
  onClose: () => void
  onNodeDataUpdate: (nodeId: string, patch: Partial<WorkflowNodeData>) => void
  onDeleteNode: (nodeId: string) => void
  onExecute?: (mode: 'full' | 'to-node' | 'single-node') => void
}

export function NodeEditModal({
  open,
  nodeId,
  data,
  position,
  nodes,
  edges,
  workflowVariables,
  onClose,
  onNodeDataUpdate,
  onDeleteNode,
  onExecute,
}: NodeEditModalProps) {
  const {
    def,
    activeTab,
    setActiveTab,
    localProps,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    availableVars,
    errors,
    errorCount,
    prevNodes,
    nextNodes,
    handlePropChange,
    handleTitleBlur,
    handleSubtitleBlur,
    handleSave,
    catConfig,
    Icon,
    dragOffset,
    handleDragStart,
  } = useNodeEditModal({
    nodeId,
    data,
    nodes,
    edges,
    workflowVariables,
    onClose,
    onNodeDataUpdate,
  })
  const [prevIdx, setPrevIdx] = useState(0)
  const [nextIdx, setNextIdx] = useState(0)
  const prevNode = prevNodes[prevIdx]
  const nextNode = nextNodes[nextIdx]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />
      <div
        className="absolute z-10 w-[95vw] max-w-[1520px] h-[88vh] max-h-[900px] rounded-2xl bg-surface border border-frost shadow-2xl flex flex-col overflow-hidden"
        style={{
          left: `calc(50% + ${dragOffset.x}px)`,
          top: `calc(50% + ${dragOffset.y}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 border-b border-frost shrink-0 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3 min-w-0">
            <GripHorizontal size={13} className="text-muted-text shrink-0" />
            {Icon && (
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  catConfig?.bgColor ?? 'bg-surface-2',
                  catConfig?.color ?? 'text-muted-text',
                )}
              >
                <Icon size={15} />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[10px] font-mono tracking-wide uppercase text-muted-text">
                EDIT NODE · {def?.identity.category?.toUpperCase()}
              </div>
              <h2 className="text-sm font-semibold text-near-white truncate">
                {def?.identity.title ?? title}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-muted-text/50 ml-2 shrink-0">
              ID · {nodeId}
            </span>
            {errorCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent-red/10 text-[10px] font-medium text-accent-red">
                {errorCount} error{errorCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onExecute && (
              <>
                <Button
                  size="xs"
                  color="green-dim"
                  onClick={() => onExecute('to-node')}
                >
                  <Route size={11} /> Run to Here
                </Button>
                <Button
                  size="xs"
                  color="blue-dim"
                  onClick={() => onExecute('full')}
                >
                  <Play size={11} /> Run All
                </Button>
              </>
            )}
            <Button
              size="xs"
              variant="ghost"
              onClick={onClose}
              className="text-muted-text hover:text-near-white"
            >
              <X size={15} />
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[minmax(240px,1fr)_minmax(380px,1.4fr)_minmax(240px,1fr)] divide-x divide-frost overflow-hidden min-h-0">
          <LeftSide
            prevNodes={prevNodes}
            prevIdx={prevIdx}
            setPrevIdx={setPrevIdx}
            prevNode={prevNode}
            catConfigBgColor={catConfig?.bgColor}
            nodeId={nodeId}
            nodes={nodes}
            edges={edges}
          />

          <NodeEdit
            def={def}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title={title}
            subtitle={subtitle}
            localProps={localProps}
            errors={errors}
            errorCount={errorCount}
            position={position}
            nodeId={nodeId}
            nodeTypeId={data.nodeTypeId ?? ''}
            catConfigBgColor={catConfig?.bgColor}
            Icon={Icon}
            availableVars={availableVars}
            onTitleChange={setTitle}
            onSubtitleChange={setSubtitle}
            onTitleBlur={handleTitleBlur}
            onSubtitleBlur={handleSubtitleBlur}
            onPropChange={handlePropChange}
            onClose={onClose}
            onDelete={() => onDeleteNode(nodeId)}
            onSave={handleSave}
            onExecuteSingle={
              onExecute ? () => onExecute('single-node') : undefined
            }
          />

          <RightSide
            nextNodes={nextNodes}
            nextIdx={nextIdx}
            setNextIdx={setNextIdx}
            nextNode={nextNode}
            catConfigBgColor={catConfig?.bgColor}
            def={def}
            localProps={localProps}
            availableVars={availableVars}
          />
        </div>
      </div>
    </div>
  )
}
