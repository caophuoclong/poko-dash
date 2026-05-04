import {
  X,
  FileText,
  BarChart3,
  GripHorizontal,
  Route,
  Play,
} from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData } from '../types'
import { CATEGORY_CONFIG } from '../node-registry'
import type { LucideIcon } from 'lucide-react'
import { useNodeEditModal } from '../hooks/use-node-edit-modal'
import { VariableExplorerPanel } from './variable-explorer-panel'
import { OutputPreviewPanel } from './output-preview-panel'
import { PropertiesTab } from './properties-tab'
import { ValidationTab } from './validation-tab'

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

export function NodeEditModal({
  open, nodeId, data, position, nodes, edges,
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="absolute z-10 w-[95vw] max-w-[1400px] h-[88vh] max-h-[900px] rounded-2xl bg-surface border border-frost shadow-2xl flex flex-col overflow-hidden"
        style={{ left: `calc(50% + ${dragOffset.x}px)`, top: `calc(50% + ${dragOffset.y}px)`, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-3.5 border-b border-frost shrink-0 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3">
            <GripHorizontal size={14} className="text-muted-text mr-1" />
            {Icon && (
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', catConfig?.bgColor ?? 'bg-surface-2', catConfig?.color ?? 'text-muted-text')}>
                <Icon size={16} />
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-near-white">{def?.title ?? 'Node Settings'}</h2>
              <p className="text-[11px] text-muted-text">
                {def?.category ? CATEGORY_CONFIG[def.category]?.label : ''}{def?.category && def?.typeId ? ' · ' : ''}{def?.typeId}
              </p>
            </div>
            {errorCount > 0 && <span className="px-2 py-0.5 rounded-full bg-accent-red/10 text-[11px] font-medium text-accent-red">{errorCount} error{errorCount > 1 ? 's' : ''}</span>}
            {!errorCount && warningCount > 0 && <span className="px-2 py-0.5 rounded-full bg-accent-yellow/10 text-[11px] font-medium text-accent-yellow">{warningCount} warning</span>}
          </div>
          <div className="flex items-center gap-1.5">
            {onExecute && (
              <>
                <Button size="xs" color="green-dim" onClick={() => onExecute('to-node')}>
                  <Route size={12} />
                  Run to Here
                </Button>
                <Button size="xs" color="blue-dim" onClick={() => onExecute('full')}>
                  <Play size={12} />
                  Run All
                </Button>
              </>
            )}
            <Button size="xs" color="blue-dim" onClick={handleSave}>Done</Button>
            <Button variant="ghost" size="icon-xs" onClick={onClose} className="text-muted-text hover:text-near-white"><X size={15} /></Button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          <VariableExplorerPanel
            prevNodes={prevNodes}
            variables={availableVars}
            onInsertVar={(ref) => {
              const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null
              if (active && ('selectionStart' in active)) {
                const start = active.selectionStart ?? 0
                const end = active.selectionEnd ?? 0
                const before = active.value.slice(0, start)
                const after = active.value.slice(end)
                const insert = `{{${ref}}}`
                const newVal = before + insert + after
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
                  ?? Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set
                if (nativeInputValueSetter) {
                  nativeInputValueSetter.call(active, newVal)
                  active.dispatchEvent(new Event('input', { bubbles: true }))
                }
                active.setSelectionRange(start + insert.length, start + insert.length)
                active.focus()
              }
            }}
          />

          <div className="flex-1 flex flex-col min-w-0 border-x border-frost overflow-hidden">
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
                  position={position}
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
          </div>

          <OutputPreviewPanel
            nextNodes={nextNodes}
            selectedDef={def}
            localProps={localProps}
            variables={availableVars}
          />
        </div>
      </div>
    </div>
  )
}
