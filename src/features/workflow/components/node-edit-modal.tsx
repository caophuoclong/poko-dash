import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  X,
  Info,
  ArrowRight,
  ArrowDown,
  Variable,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  GripHorizontal,
  Search,
  Braces,
  ChevronRight,
  ChevronDown,
  Copy,
  Network,
  Eye,
  Table2,
  FileJson,
  Play,
  Route,
} from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'
import type { WorkflowNodeData } from '../types'
import { getNodeDefinition, CATEGORY_CONFIG } from '../node-registry'
import { PropertyEditor } from './property-editors/property-editor'
import type { ValidationError } from '../node-types'
import {
  buildVariableList,
  groupVariables,
  type VariableRef,
} from './variable-system'
import {
  Clock as ClockIcon,
  ListPlus,
  Globe,
  Layers,
  Filter,
  Link2,
  Sparkles,
  ListTodo,
  Send,
  BarChart3 as BarChart3Icon,
  GitBranch as GitBranchIcon,
  Timer,
  Bell,
  type LucideIcon as LI,
} from 'lucide-react'

const ICON_MAP: Record<string, LI> = {
  Play, Clock: ClockIcon, ListPlus, Globe, Layers, Filter,
  LinkCheck: Link2, Sparkles, ListTodo, Send,
  BarChart3: BarChart3Icon, GitBranch: GitBranchIcon, Timer, Bell,
}

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

type TabId = 'properties' | 'validation'
type ExplorerTab = 'schema' | 'table' | 'json'

export function NodeEditModal({
  open, nodeId, data, position, nodes, edges,
  onClose, onNodeDataUpdate, onDeleteNode, onExecute,
}: NodeEditModalProps) {
  const def = getNodeDefinition(data.nodeTypeId ?? '')
  const [activeTab, setActiveTab] = useState<TabId>('properties')

  const [localProps, setLocalProps] = useState<Record<string, unknown>>(() => ({
    ...def?.defaultProps,
    ...(data.config ?? {}),
  }))

  const [title, setTitle] = useState(data.title)
  const [subtitle, setSubtitle] = useState(data.subtitle ?? '')

  const availableVars = useMemo(
    () => buildVariableList(nodes, edges, nodeId),
    [nodes, edges, nodeId],
  )

  const errors: ValidationError[] = useMemo(() => {
    if (!def) return []
    return def.validate(localProps as never)
  }, [def, localProps])

  const errorCount = errors.filter((e) => e.severity === 'error').length
  const warningCount = errors.filter((e) => e.severity === 'warning').length

  const { prevNodes, nextNodes } = useMemo(() => {
    const prev = nodes.filter((n) =>
      edges.some((e) => e.target === nodeId && e.source === n.id),
    )
    const next = nodes.filter((n) =>
      edges.some((e) => e.source === nodeId && e.target === n.id),
    )
    return { prevNodes: prev, nextNodes: next }
  }, [nodes, edges, nodeId])

  const handlePropChange = useCallback(
    (key: string, value: unknown) => {
      setLocalProps((prev) => {
        const next = { ...prev, [key]: value }
        onNodeDataUpdate(nodeId, { config: next })
        return next
      })
    },
    [nodeId, onNodeDataUpdate],
  )

  const handleTitleBlur = useCallback(() => {
    if (title.trim()) onNodeDataUpdate(nodeId, { title: title.trim() })
  }, [nodeId, title, onNodeDataUpdate])

  const handleSubtitleBlur = useCallback(() => {
    onNodeDataUpdate(nodeId, { subtitle })
  }, [nodeId, subtitle, onNodeDataUpdate])

  const handleSave = useCallback(() => {
    onNodeDataUpdate(nodeId, { title, subtitle })
    handleTitleBlur()
    handleSubtitleBlur()
    onClose()
  }, [nodeId, title, subtitle, onNodeDataUpdate, onClose, handleTitleBlur, handleSubtitleBlur])

  const catConfig = def ? CATEGORY_CONFIG[def.category] : null
  const Icon: LI | undefined = def ? ICON_MAP[def.icon] : undefined

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dragState = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragState.current = { startX: e.clientX, startY: e.clientY, offsetX: dragOffset.x, offsetY: dragOffset.y }
  }, [dragOffset])

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      setDragOffset({ x: dragState.current.offsetX + dx, y: dragState.current.offsetY + dy })
    }
    const handleDragEnd = () => { dragState.current = null }
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        ref={modalRef}
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
              ] as { id: TabId; label: string; icon: LI }[]).map((tab) => {
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

function VariableExplorerPanel({
  prevNodes,
  variables,
  onInsertVar,
}: {
  prevNodes: Node<WorkflowNodeData>[]
  variables: VariableRef[]
  onInsertVar: (ref: string) => void
}) {
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>('schema')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const grouped = useMemo(() => groupVariables(variables), [variables])

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return grouped
    const q = search.toLowerCase()
    const result: Record<string, VariableRef[]> = {}
    for (const [key, items] of Object.entries(grouped)) {
      const matched = items.filter(
        (v) => v.id.toLowerCase().includes(q) || v.description.toLowerCase().includes(q),
      )
      if (matched.length > 0) result[key] = matched
    }
    return result
  }, [grouped, search])

  const flatVars = useMemo(() => Object.values(filteredGroups).flat(), [filteredGroups])
  const groupNames = Object.keys(filteredGroups)

  useEffect(() => {
    const initial: Record<string, boolean> = {}
    for (const g of groupNames) initial[g] = true
    setExpanded(initial)
  }, [groupNames.join(',')])

  const toggleGroup = (g: string) => setExpanded((e) => ({ ...e, [g]: !e[g] }))

  const handleDragStart = (e: React.DragEvent, v: VariableRef) => {
    e.dataTransfer.setData('application/variable-ref', v.id)
    e.dataTransfer.setData('text/plain', `{{${v.id}}}`)
    e.dataTransfer.effectAllowed = 'all'
  }

  const handleCopy = (v: VariableRef) => {
    navigator.clipboard.writeText(`{{${v.id}}}`)
    setCopied(v.id)
    setTimeout(() => setCopied(null), 1500)
  }

  const jsonOutput = useMemo(() => {
    const out: Record<string, unknown> = {}
    for (const v of variables) {
      const parts = v.id.split('.')
      let current: Record<string, unknown> = out
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {}
        current = current[parts[i]] as Record<string, unknown>
      }
      current[parts[parts.length - 1]] = v.sampleValue ?? `{{${v.id}}}`
    }
    return JSON.stringify(out, null, 2)
  }, [variables])

  return (
    <div className="w-[300px] shrink-0 flex flex-col overflow-hidden border-r border-frost bg-void/50">
      <div className="px-3 py-2.5 border-b border-frost shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <Braces size={13} className="text-accent-blue" />
          <span className="text-[11px] font-semibold text-near-white uppercase tracking-wide">Variable Explorer</span>
        </div>

        <div className="flex rounded-lg bg-surface-2/50 border border-frost overflow-hidden">
          {([
            { id: 'schema', icon: Network, label: 'Schema' },
            { id: 'table', icon: Table2, label: 'Table' },
            { id: 'json', icon: FileJson, label: 'JSON' },
          ] as { id: ExplorerTab; icon: LI; label: string }[]).map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setExplorerTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors',
                  explorerTab === tab.id
                    ? 'bg-accent-blue-dim text-accent-blue'
                    : 'text-muted-text hover:text-near-white hover:bg-surface-2',
                )}
              >
                <TabIcon size={12} />{tab.label}
              </button>
            )
          })}
        </div>

        {explorerTab === 'schema' || explorerTab === 'table' ? (
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search variables..."
              className="w-full h-7 pl-7 pr-2 rounded-lg border border-frost bg-void text-[11px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20 focus:border-accent-blue/30"
            />
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto">
        {explorerTab === 'schema' && (
          <div className="p-2 space-y-0.5">
            {prevNodes.length === 0 && flatVars.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Network size={24} className="text-muted-text mb-2" />
                <p className="text-[11px] text-muted-text font-medium">No variables available</p>
                <p className="text-[10px] text-muted-text mt-1">Connect upstream nodes to see variables here</p>
              </div>
            )}
            {groupNames.map((group) => {
              const items = filteredGroups[group]
              const isOpen = expanded[group] ?? false
              return (
                <div key={group}>
                  <button
                    onClick={() => toggleGroup(group)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left hover:bg-surface-2/50 transition-colors"
                  >
                    {isOpen ? <ChevronDown size={12} className="text-muted-text shrink-0" /> : <ChevronRight size={12} className="text-muted-text shrink-0" />}
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">{group}</span>
                    <span className="text-[10px] text-muted-text/50 ml-auto">{items.length}</span>
                  </button>
                  {isOpen && (
                    <div className="ml-3 space-y-0.5">
                      {items.map((v) => (
                        <div
                          key={v.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, v)}
                          className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors select-none"
                          onClick={() => onInsertVar(v.id)}
                        >
                          <Variable size={11} className="text-accent-blue shrink-0 mt-px" />
                          <div className="min-w-0 flex-1">
                            <code className="text-[11px] text-accent-blue font-mono block truncate">{v.display}</code>
                            <div className="text-[10px] text-muted-text truncate">{v.description}</div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(v) }}
                            className="opacity-0 group-hover:opacity-100 text-muted-text hover:text-near-white shrink-0 transition-opacity"
                            title="Copy variable"
                          >
                            {copied === v.id ? <CheckCircle2 size={11} className="text-accent-green" /> : <Copy size={11} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {explorerTab === 'table' && (
          <div className="overflow-x-auto">
            {flatVars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Table2 size={24} className="text-muted-text mb-2" />
                <p className="text-[11px] text-muted-text">No variables to display</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface/95 backdrop-blur">
                  <tr className="border-b border-frost">
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider">Variable</th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider">Source</th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider">Value</th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider w-8" />
                  </tr>
                </thead>
                <tbody>
                  {flatVars.map((v) => (
                    <tr
                      key={v.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, v)}
                      onClick={() => onInsertVar(v.id)}
                      className="border-b border-frost/30 hover:bg-surface-2/50 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-1.5">
                        <code className="text-[11px] text-accent-blue font-mono">{v.display}</code>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className="text-[10px] text-muted-text">{v.sourceNodeName ?? v.source}</span>
                      </td>
                      <td className="px-3 py-1.5">
                        <code className="text-[10px] text-accent-green font-mono">{v.sampleValue ?? '—'}</code>
                      </td>
                      <td className="px-3 py-1.5">
                        <Copy size={11} className="text-muted-text hover:text-near-white cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCopy(v) }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {explorerTab === 'json' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Variable Map (JSON)</span>
              <button
                onClick={() => { navigator.clipboard.writeText(jsonOutput); setCopied('json'); setTimeout(() => setCopied(null), 1500) }}
                className="text-[10px] text-accent-blue hover:text-accent-blue/80 flex items-center gap-1"
              >
                {copied === 'json' ? <CheckCircle2 size={11} className="text-accent-green" /> : <Copy size={11} />}
                Copy
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-void border border-frost text-[11px] text-near-white font-mono leading-relaxed whitespace-pre overflow-x-auto">
              {variables.length > 0 ? jsonOutput : '{\n  // No upstream variables available\n}'}
            </pre>
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-t border-frost shrink-0">
        <p className="text-[9px] text-muted-text text-center">
          Drag variables into fields or click to insert at cursor
        </p>
      </div>
    </div>
  )
}

function OutputPreviewPanel({
  nextNodes,
  selectedDef,
  localProps,
  variables,
}: {
  nextNodes: Node<WorkflowNodeData>[]
  selectedDef: ReturnType<typeof getNodeDefinition>
  localProps: Record<string, unknown>
  variables: VariableRef[]
}) {
  const resolvedOutputs = useMemo(() => {
    if (!selectedDef) return {}
    const out: Record<string, string> = {}
    for (const port of selectedDef.outputs) {
      out[port.label] = resolveSampleValue(port.type, port.label, localProps, variables)
    }
    return out
  }, [selectedDef, localProps, variables])

  return (
    <div className="w-[300px] shrink-0 flex flex-col overflow-hidden border-l border-frost bg-void/50">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-frost shrink-0">
        <Eye size={13} className="text-muted-text" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Output Preview</span>
        {nextNodes.length > 0 && (
          <span className="ml-auto text-[10px] text-muted-text">{nextNodes.length} downstream</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {selectedDef && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowRight size={11} className="text-muted-text" />
              <span className="text-[10px] font-medium text-muted-text uppercase tracking-wider">Outputs</span>
            </div>
            <div className="space-y-1.5">
              {selectedDef.outputs.map((port) => (
                <div key={port.id} className="p-2.5 rounded-lg bg-surface border border-frost">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('w-1.5 h-1.5 rounded-full', port.type === 'data' ? 'bg-accent-blue' : port.type === 'signal' ? 'bg-accent-orange' : 'bg-accent-red')} />
                    <span className="text-[12px] font-medium text-near-white">{port.label}</span>
                    <span className="text-[10px] text-muted-text ml-auto">{port.type}</span>
                  </div>
                  {resolvedOutputs[port.label] && (
                    <code className="text-[11px] text-accent-green font-mono">{resolvedOutputs[port.label]}</code>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {nextNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Network size={20} className="text-muted-text mb-2" />
            <p className="text-[11px] text-muted-text leading-relaxed">
              No downstream nodes connected. This node terminates the branch.
            </p>
          </div>
        )}

        {nextNodes.map((next) => {
          const nextData = next.data as WorkflowNodeData
          const nextDef = nextData.nodeTypeId ? getNodeDefinition(nextData.nodeTypeId) : null
          const NextIcon = nextDef ? (ICON_MAP[nextDef.icon] ?? Info) : Info
          const outputMismatch = checkOutputMismatch(selectedDef, nextDef)

          return (
            <div key={next.id} className="space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowDown size={11} className="text-muted-text" />
                <span className="text-[10px] font-medium text-muted-text uppercase tracking-wider">Next Node</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface border border-frost">
                <div className={cn('w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                  nextDef && CATEGORY_CONFIG[nextDef.category] ? `${CATEGORY_CONFIG[nextDef.category].bgColor} ${CATEGORY_CONFIG[nextDef.category].color}` : 'bg-surface-2 text-muted-text')}>
                  <NextIcon size={13} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-near-white truncate">{nextData.title || next.id}</div>
                  <div className="text-[10px] text-muted-text">{(nextData.nodeTypeId && nextDef?.title) || 'Unknown type'}</div>
                </div>
              </div>

              {nextDef && nextDef.inputs.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-muted-text">Expected Inputs</span>
                  {nextDef.inputs.map((port) => (
                    <div key={port.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface/50 border border-frost/50">
                      <span className={cn('w-1.5 h-1.5 rounded-full', port.type === 'data' ? 'bg-accent-blue' : port.type === 'signal' ? 'bg-accent-orange' : 'bg-accent-red')} />
                      <span className="text-[11px] text-near-white">{port.label}</span>
                      <span className="text-[10px] text-muted-text ml-auto">{port.type}</span>
                    </div>
                  ))}
                </div>
              )}

              {outputMismatch && (
                <div className="flex gap-2 p-2 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
                  <AlertTriangle size={13} className="text-accent-yellow shrink-0 mt-0.5" />
                  <p className="text-[10px] text-accent-yellow leading-relaxed">{outputMismatch}</p>
                </div>
              )}
            </div>
          )
        })}

        {selectedDef && selectedDef.outputs.length === 0 && nextNodes.length > 0 && (
          <div className="flex gap-2 p-2 rounded-lg bg-accent-red/5 border border-accent-red/10">
            <AlertTriangle size={13} className="text-accent-red shrink-0 mt-0.5" />
            <p className="text-[10px] text-accent-red">This node declares no outputs but has downstream nodes connected.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function resolveSampleValue(
  _type: string,
  label: string,
  localProps: Record<string, unknown>,
  variables: VariableRef[],
): string {
  for (const v of variables) {
    if (v.source === 'previous' && v.id.includes(label.toLowerCase())) {
      return v.sampleValue ?? `⟨ ${label} resolved from upstream ⟩`
    }
  }
  const key = label.toLowerCase().replace(/\s+/g, '')
  if (key in localProps) return String(localProps[key])
  return ''
}

function checkOutputMismatch(
  selectedDef: ReturnType<typeof getNodeDefinition>,
  nextDef: ReturnType<typeof getNodeDefinition> | null,
): string | null {
  if (!selectedDef || !nextDef) return null
  const selectOutputTypes = new Set(selectedDef.outputs.map((p) => p.type))
  const nextInputTypes = new Set(nextDef.inputs.map((p) => p.type))
  const missing = [...nextInputTypes].filter((t) => !selectOutputTypes.has(t))
  if (missing.length > 0) {
    return `Next node expects ${missing.join('/')} input but selected node does not provide it`
  }
  return null
}

function PropertiesTab({
  def, title, subtitle, localProps, errors, position, nodeId, nodeTypeId,
  onTitleChange, onSubtitleChange, onTitleBlur, onSubtitleBlur, onPropChange, onDelete,
}: {
  def: ReturnType<typeof getNodeDefinition>
  title: string; subtitle: string
  localProps: Record<string, unknown>
  errors: ValidationError[]
  position: { x: number; y: number }
  nodeId: string; nodeTypeId: string
  onTitleChange: (v: string) => void
  onSubtitleChange: (v: string) => void
  onTitleBlur: () => void; onSubtitleBlur: () => void
  onPropChange: (key: string, value: unknown) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-4 max-w-[500px] mx-auto">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">Node Identity</h3>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Label <span className="text-accent-red ml-0.5">*</span></label>
            <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} onBlur={onTitleBlur}
              className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Description</label>
            <input type="text" value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} onBlur={onSubtitleBlur} placeholder="Optional node description"
              className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30" />
          </div>
        </div>
      </div>

      {def ? (
        <>
          <div className="border-t border-frost" />
          {def.purpose && (
            <div className="flex gap-2 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/10">
              <Info size={14} className="text-accent-blue shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-text leading-relaxed">{def.purpose}</p>
            </div>
          )}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">Configuration</h3>
            <div className="space-y-3">
              {def.propertySchema.filter((s) => !s.visibleWhen || s.visibleWhen(localProps)).map((schema) => (
                <PropertyEditor key={schema.key} schema={schema} value={localProps[schema.key] ?? schema.defaultValue} onChange={onPropChange} allProps={localProps} errors={errors} />
              ))}
            </div>
          </div>
          {(def.inputs.length > 0 || def.outputs.length > 0) && (
            <>
              <div className="border-t border-frost" />
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">Ports</h3>
                <div className="space-y-2">
                  {def.inputs.length > 0 && (
                    <div>
                      <span className="text-[10px] font-medium text-muted-text">Inputs</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {def.inputs.map((port) => <span key={port.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent-blue/10 text-accent-blue">{port.label}</span>)}
                      </div>
                    </div>
                  )}
                  {def.outputs.length > 0 && (
                    <div>
                      <span className="text-[10px] font-medium text-muted-text">Outputs</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {def.outputs.map((port) => (
                          <span key={port.id} className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                            port.type === 'data' ? 'bg-accent-blue/10 text-accent-blue' : port.type === 'signal' ? 'bg-accent-orange/10 text-accent-orange' : 'bg-accent-red/10 text-accent-red')}>
                            {port.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        nodeTypeId && (
          <div className="flex gap-2 p-2 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
            <Info size={13} className="text-accent-yellow shrink-0 mt-0.5" />
            <p className="text-[11px] text-accent-yellow leading-relaxed">Unknown node type <code className="font-mono">{nodeTypeId}</code></p>
          </div>
        )
      )}

      <div className="border-t border-frost pt-3">
        <div className="space-y-1 mb-4">
          <DetailRow label="Node ID" value={nodeId} mono />
          <DetailRow label="Type" value={def?.typeId ?? 'unknown'} />
          <DetailRow label="Category" value={def ? (CATEGORY_CONFIG[def.category]?.label ?? def.category) : '—'} />
          <DetailRow label="Position" value={`${position.x.toFixed(0)}, ${position.y.toFixed(0)}`} />
        </div>
        <Button variant="ghost" size="xs" className="w-full text-accent-red hover:bg-accent-red/10" onClick={onDelete}>
          <Trash2 size={13} />Delete Node
        </Button>
      </div>
    </div>
  )
}

function ValidationTab({ errors, def }: { errors: ValidationError[]; def: ReturnType<typeof getNodeDefinition> }) {
  const errorItems = errors.filter((e) => e.severity === 'error')
  const warningItems = errors.filter((e) => e.severity === 'warning')

  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 size={28} className="text-accent-green mb-3" />
        <h3 className="text-sm font-medium text-near-white mb-1">All Valid</h3>
        <p className="text-[12px] text-muted-text max-w-[300px]">This node configuration has no validation errors or warnings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-[500px] mx-auto">
      {errorItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-accent-red" />
            <h3 className="text-[12px] font-semibold text-accent-red">{errorItems.length} Error{errorItems.length > 1 ? 's' : ''}</h3>
          </div>
          <div className="space-y-2">
            {errorItems.map((err, i) => (
              <div key={i} className="flex gap-2.5 px-3 py-2.5 rounded-lg bg-accent-red/5 border border-accent-red/10">
                <AlertTriangle size={14} className="text-accent-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-near-white">{err.message}</p>
                  <p className="text-[10px] text-muted-text font-mono mt-0.5">{err.propertyKey}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {warningItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-accent-yellow" />
            <h3 className="text-[12px] font-semibold text-accent-yellow">{warningItems.length} Warning{warningItems.length > 1 ? 's' : ''}</h3>
          </div>
          <div className="space-y-2">
            {warningItems.map((err, i) => (
              <div key={i} className="flex gap-2.5 px-3 py-2.5 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
                <Info size={14} className="text-accent-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-near-white">{err.message}</p>
                  <p className="text-[10px] text-muted-text font-mono mt-0.5">{err.propertyKey}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {def && (
        <div className="border-t border-frost pt-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-muted-text" />
            <h3 className="text-[12px] font-medium text-near-white">Summary Preview</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {def.summaryFields.map((field) => (
              <div key={field.key} className="flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-frost">
                <span className="text-[12px] font-semibold text-near-white">{getSummaryValue(def.defaultProps?.[field.key as keyof typeof def.defaultProps]) ?? '—'}</span>
                <span className="text-[10px] text-muted-text">{field.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getSummaryValue(val: unknown): string {
  if (val === undefined || val === null) return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.length > 0 ? `${val.length} items` : 'None'
  return String(val)
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className="text-muted-text">{label}</span>
      <span className={cn('text-near-white', mono ? 'font-mono text-[11px]' : 'text-[11px]')}>{value}</span>
    </div>
  )
}
