import { useState, useMemo } from 'react'
import {
  X,
  FileText,
  BarChart3,
  GripHorizontal,
  Route,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData } from '../types'
import { getNodeDefinition } from '../node-registry'
import type { LucideIcon } from 'lucide-react'
import { useNodeEditModal } from '../hooks/use-node-edit-modal'
import { VariableExplorerPanel } from './variable-explorer-panel'
import { OutputPreviewPanel } from './output-preview-panel'
import { PropertiesTab } from './properties-tab'
import { ValidationTab } from './validation-tab'
import { ICON_MAP } from './nodes/workflow-node.constants'
import { UpstreamDataView } from './draggable-field-tag'

type TabId = 'properties' | 'validation'

interface NodeEditModalProps {
  open: boolean
  nodeId: string
  data: WorkflowNodeData
  position: { x: number; y: number }
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onClose: () => void
  onNodeDataUpdate: (nodeId: string, patch: Partial<WorkflowNodeData>) => void
  onDeleteNode: (nodeId: string) => void
  onExecute?: (mode: 'full' | 'to-node' | 'single-node') => void
}

/** Synthesize sample output data from upstream node config + definition defaults */
function synthesizeOutput(node: Node<WorkflowNodeData>): Record<string, unknown> {
  const nodeData = node.data as WorkflowNodeData
  const def = nodeData.nodeTypeId ? getNodeDefinition(String(nodeData.nodeTypeId)) : null

  const config = (nodeData.config ?? {}) as Record<string, unknown>
  const defaults = def?.defaultProps ?? {}

  const merged: Record<string, unknown> = { id: node.id, __node_label: nodeData.title ?? node.id }

  for (const schema of def?.propertySchema ?? []) {
    const val = config[schema.key] ?? schema.defaultValue
    if (val !== undefined && val !== null && val !== '') {
      merged[schema.key] = val
    }
  }

  if (Object.keys(merged).length <= 2) {
    return { id: node.id, __node_label: nodeData.title ?? node.id, ...(config as Record<string, unknown>) }
  }

  return merged
}

function PaneHeader({
  side, idx, total, title, subtitle, color, icon: Icon,
}: {
  side: string
  idx: number
  total: number
  title: string
  subtitle?: string
  color?: string
  icon?: LucideIcon
}) {
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

export function NodeEditModal({
  open, nodeId, data, position: _position, nodes, edges,
  onClose, onNodeDataUpdate, onDeleteNode, onExecute,
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
    warningCount,
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
    onClose,
    onNodeDataUpdate,
  })

  const [prevIdx, setPrevIdx] = useState(0)
  const [nextIdx, setNextIdx] = useState(0)
  const prevNode = prevNodes[prevIdx]
  const nextNode = nextNodes[nextIdx]

  const upstreamData = useMemo(() => {
    if (!prevNode) return null
    return synthesizeOutput(prevNode as Node<WorkflowNodeData>)
  }, [prevNode])

  const upstreamDef = prevNode
    ? getNodeDefinition((prevNode.data as WorkflowNodeData).nodeTypeId ?? '')
    : null
  const upstreamIcon = upstreamDef ? ICON_MAP[upstreamDef.icon] : undefined

  const nextDef = nextNode
    ? getNodeDefinition((nextNode.data as WorkflowNodeData).nodeTypeId ?? '')
    : null
  const nextIcon = nextDef ? ICON_MAP[nextDef.icon] : undefined

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div
        className="absolute z-10 w-[95vw] max-w-[1520px] h-[88vh] max-h-[900px] rounded-2xl bg-surface border border-frost shadow-2xl flex flex-col overflow-hidden"
        style={{
          left: `calc(50% + ${dragOffset.x}px)`,
          top: `calc(50% + ${dragOffset.y}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b border-frost shrink-0 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3 min-w-0">
            <GripHorizontal size={13} className="text-muted-text shrink-0" />
            {Icon && (
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', catConfig?.bgColor ?? 'bg-surface-2', catConfig?.color ?? 'text-muted-text')}>
                <Icon size={15} />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[10px] font-mono tracking-wide uppercase text-muted-text">
                EDIT NODE · {def?.category?.toUpperCase()}
              </div>
              <h2 className="text-sm font-semibold text-near-white truncate">{def?.title ?? title}</h2>
            </div>
            <span className="text-[10px] font-mono text-muted-text/50 ml-2 shrink-0">ID · {nodeId}</span>
            {errorCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent-red/10 text-[10px] font-medium text-accent-red">{errorCount} error{errorCount > 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onExecute && (
              <>
                <Button size="xs" color="green-dim" onClick={() => onExecute('to-node')}>
                  <Route size={11} /> Run to Here
                </Button>
                <Button size="xs" color="blue-dim" onClick={() => onExecute('full')}>
                  <Play size={11} /> Run All
                </Button>
              </>
            )}
            <Button size="xs" variant="ghost" onClick={onClose} className="text-muted-text hover:text-near-white">
              <X size={15} />
            </Button>
          </div>
        </div>

        {/* 3-pane body */}
        <div className="flex-1 grid grid-cols-[minmax(240px,1fr)_minmax(380px,1.4fr)_minmax(240px,1fr)] divide-x divide-frost overflow-hidden min-h-0">

          {/* LEFT: upstream output as draggable tags */}
          <div className="flex flex-col bg-surface-2/20 overflow-hidden">
            <PaneHeader
              side="INPUT FROM PREVIOUS"
              idx={1} total={3}
              title={prevNode ? ((prevNode.data as WorkflowNodeData).title ?? upstreamDef?.title ?? 'Unknown') : 'No upstream'}
              subtitle={prevNode ? `Connect an upstream node to see its output` : undefined}
              color={upstreamDef ? catConfig?.bgColor : undefined}
              icon={upstreamIcon}
            />

            {prevNodes.length > 1 && (
              <div className="flex items-center justify-center gap-1 px-4 py-1.5 border-b border-frost bg-surface">
                <button onClick={() => setPrevIdx((i) => (i - 1 + prevNodes.length) % prevNodes.length)} className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white">
                  <ChevronLeft size={12} />
                </button>
                <span className="text-[10px] font-mono text-muted-text">{prevIdx + 1}/{prevNodes.length}</span>
                <button onClick={() => setPrevIdx((i) => (i + 1) % prevNodes.length)} className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white">
                  <ChevronRight size={12} />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {prevNode ? (
                <UpstreamDataView
                  data={upstreamData}
                  nodeName={((prevNode.data as WorkflowNodeData).title ?? '').replace(/\s+/g, '_')}
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
                    navigator.clipboard.writeText(JSON.stringify(upstreamData, null, 2))
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

          {/* CENTER: edit form with drop zones */}
          <div className="flex flex-col overflow-hidden">
            <PaneHeader
              side="EDIT THIS NODE"
              idx={2} total={3}
              title={def?.title ?? title}
              subtitle={def?.description}
              color={catConfig?.bgColor}
              icon={Icon}
            />

            <div className="flex items-center gap-1 px-4 py-2 border-b border-frost shrink-0 bg-surface-2/30">
              {([
                { id: 'properties', label: 'Properties', icon: FileText },
                { id: 'validation', label: 'Validation', icon: BarChart3 },
              ] as { id: TabId; label: string; icon: LucideIcon }[]).map((tab) => {
                const isActive = activeTab === tab.id
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors',
                      isActive ? 'bg-accent-blue-dim text-accent-blue' : 'text-muted-text hover:text-near-white hover:bg-surface-2',
                    )}
                  >
                    <TabIcon size={13} />{tab.label}
                    {tab.id === 'validation' && errorCount > 0 && (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-accent-red text-[9px] font-bold text-white">{errorCount}</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === 'properties' && (
                <PropertiesTab
                  def={def}
                  title={title} subtitle={subtitle}
                  localProps={localProps}
                  errors={errors}
                  position={_position}
                  nodeId={nodeId}
                  nodeTypeId={data.nodeTypeId ?? ''}
                  onTitleChange={setTitle}
                  onSubtitleChange={setSubtitle}
                  onTitleBlur={handleTitleBlur}
                  onSubtitleBlur={handleSubtitleBlur}
                  onPropChange={handlePropChange}
                  onDelete={() => onDeleteNode(nodeId)}
                />
              )}
              {activeTab === 'validation' && (
                <ValidationTab errors={errors} def={def} />
              )}
            </div>

            {/* Expression hint */}
            <div className="border-t border-frost px-4 py-2 bg-accent-blue/5 shrink-0">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="font-mono tracking-wide uppercase text-accent-blue font-bold">EXPRESSIONS</span>
                <span className="text-muted-text">
                  Drag a tag from the left pane into any input. Use <code className="px-1 bg-accent-blue/10 rounded text-accent-blue text-[9px]">&#123;&#123; $node.NAME.field &#125;&#125;</code> references.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-frost px-4 py-2.5 flex items-center gap-2 bg-surface shrink-0">
              <Button size="xs" variant="ghost" onClick={onClose}>Cancel</Button>
              <div className="flex-1" />
              {onExecute && (
                <Button size="xs" color="green-dim" onClick={() => onExecute('single-node')}>
                  <Play size={11} /> Test Run
                </Button>
              )}
              <Button size="xs" color="blue" onClick={handleSave}>Save Node</Button>
            </div>
          </div>

          {/* RIGHT: downstream preview */}
          <div className="flex flex-col bg-surface-2/20 overflow-hidden">
            <PaneHeader
              side="OUTPUT TO NEXT"
              idx={3} total={3}
              title={nextNode ? ((nextNode.data as WorkflowNodeData).title ?? nextDef?.title ?? 'Unknown') : 'No downstream'}
              subtitle={nextNode ? nextDef?.description : 'Connect to a downstream node'}
              color={nextDef ? catConfig?.bgColor : undefined}
              icon={nextIcon}
            />

            {nextNodes.length > 1 && (
              <div className="flex items-center justify-center gap-1 px-4 py-1.5 border-b border-frost bg-surface">
                <button onClick={() => setNextIdx((i) => (i - 1 + nextNodes.length) % nextNodes.length)} className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white">
                  <ChevronLeft size={12} />
                </button>
                <span className="text-[10px] font-mono text-muted-text">{nextIdx + 1}/{nextNodes.length}</span>
                <button onClick={() => setNextIdx((i) => (i + 1) % nextNodes.length)} className="p-0.5 rounded hover:bg-surface-2 text-muted-text hover:text-near-white">
                  <ChevronRight size={12} />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <OutputPreviewPanel
                nextNodes={[nextNode].filter(Boolean) as Node<WorkflowNodeData>[]}
                selectedDef={def}
                localProps={localProps}
                variables={availableVars}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
