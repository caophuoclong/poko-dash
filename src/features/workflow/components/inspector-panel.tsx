import { Trash2, X, Info } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { WorkflowDetail, WorkflowNodeData } from '../types'
import { getNodeDefinition } from '../node-registry'
import { CATEGORY_CONFIG } from '../node-registry'
import '../node-catalog'
import { PropertyEditor } from './property-editors/property-editor'
import type { ValidationError } from '../node-types'
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import {
  Play,
  Clock as ClockIcon,
  ListPlus,
  Globe,
  Layers,
  Filter,
  Link2,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch as GitBranchIcon,
  Timer,
  Bell,
  type LucideIcon as LI,
} from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'

const ICON_MAP: Record<string, LI> = {
  Play,
  Clock: ClockIcon,
  ListPlus,
  Globe,
  Layers,
  Filter,
  LinkCheck: Link2,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch: GitBranchIcon,
  Timer,
  Bell,
}

interface InspectorPanelProps {
  workflow: WorkflowDetail
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  selectedNode: Node<WorkflowNodeData> | null
  selectedNodeId: string | null
  onNodeDeselect: () => void
  onNodeDataUpdate: (nodeId: string, patch: Partial<WorkflowNodeData>) => void
}

export function InspectorPanel({
  workflow,
  nodes,
  edges,
  selectedNode,
  selectedNodeId,
  onNodeDeselect,
  onNodeDataUpdate,
}: InspectorPanelProps) {
  const nodeData = selectedNode?.data as WorkflowNodeData | undefined

  if (selectedNode && nodeData) {
    return (
      <NodeEditor
        key={selectedNodeId}
        nodeId={selectedNode.id}
        data={nodeData}
        position={selectedNode.position}
        onClose={onNodeDeselect}
        onNodeDataUpdate={onNodeDataUpdate}
      />
    )
  }

  return (
    <WorkflowOverview
      workflow={workflow}
      nodeCount={nodes.length}
      edgeCount={edges.length}
    />
  )
}

function NodeEditor({
  nodeId,
  data,
  position,
  onClose,
  onNodeDataUpdate,
}: {
  nodeId: string
  data: WorkflowNodeData
  position: { x: number; y: number }
  onClose: () => void
  onNodeDataUpdate: (nodeId: string, patch: Partial<WorkflowNodeData>) => void
}) {
  const def = getNodeDefinition(data.nodeTypeId ?? '')

  const [localProps, setLocalProps] = useState<Record<string, unknown>>(() => ({
    ...def?.defaultProps,
    ...(data.config ?? {}),
  }))

  useEffect(() => {
    setLocalProps({ ...def?.defaultProps, ...(data.config ?? {}) })
  }, [data.config, def?.defaultProps])

  const [title, setTitle] = useState(data.title)
  const [subtitle, setSubtitle] = useState(data.subtitle ?? '')

  useEffect(() => {
    setTitle(data.title)
    setSubtitle(data.subtitle ?? '')
  }, [data.title, data.subtitle])

  const errors: ValidationError[] = useMemo(() => {
    if (!def) return []
    return def.validate(localProps as never)
  }, [def, localProps])

  const errorCount = errors.filter((e) => e.severity === 'error').length
  const warningCount = errors.filter((e) => e.severity === 'warning').length

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
    if (title.trim()) {
      onNodeDataUpdate(nodeId, { title: title.trim() })
    }
  }, [nodeId, title, onNodeDataUpdate])

  const handleSubtitleBlur = useCallback(() => {
    onNodeDataUpdate(nodeId, { subtitle })
  }, [nodeId, subtitle, onNodeDataUpdate])

  const catConfig = def ? CATEGORY_CONFIG[def.category] : null
  const Icon: LI | undefined = def ? ICON_MAP[def.icon] : undefined

  return (
    <aside className="w-[300px] shrink-0 border-l border-frost bg-surface flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-frost shrink-0">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center ${catConfig?.bgColor ?? 'bg-surface-2'} ${catConfig?.color ?? 'text-muted-text'}`}
            >
              <Icon size={12} />
            </div>
          )}
          <h2 className="text-[13px] font-semibold text-near-white">
            {def?.title ?? 'Node Settings'}
          </h2>
          {errorCount > 0 && (
            <span className="ml-auto px-1.5 py-0.5 rounded-full bg-accent-red/10 text-[10px] font-medium text-accent-red">
              {errorCount} error{errorCount > 1 ? 's' : ''}
            </span>
          )}
          {!errorCount && warningCount > 0 && (
            <span className="ml-auto px-1.5 py-0.5 rounded-full bg-accent-yellow/10 text-[10px] font-medium text-accent-yellow">
              {warningCount} warn
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <SectionHeader>General</SectionHeader>

        <div className="space-y-1">
          <FieldLabel required>Label</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
          />
        </div>

        <div className="space-y-1">
          <FieldLabel>Description</FieldLabel>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onBlur={handleSubtitleBlur}
            placeholder="Optional node description"
            className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
          />
        </div>

        {def ? (
          <>
            <div className="border-t border-frost" />

            <SectionHeader>Configuration</SectionHeader>

            {def.purpose && (
              <div className="flex gap-2 p-2 rounded-lg bg-surface-2/50 border border-frost">
                <Info size={13} className="text-muted-text shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-text leading-relaxed">
                  {def.purpose}
                </p>
              </div>
            )}

            {def.propertySchema.map((schema) => (
              <PropertyEditor
                key={schema.key}
                schema={schema}
                value={localProps[schema.key] ?? schema.defaultValue}
                onChange={handlePropChange}
                allProps={localProps}
                errors={errors}
              />
            ))}

            {def.inputs.length > 0 && (
              <>
                <div className="border-t border-frost" />
                <SectionHeader>Ports</SectionHeader>
                <PortsList label="Inputs" ports={def.inputs} />
                <PortsList label="Outputs" ports={def.outputs} />
              </>
            )}
          </>
        ) : (
          !def &&
          data.nodeTypeId && (
            <div className="flex gap-2 p-2 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
              <Info size={13} className="text-accent-yellow shrink-0 mt-0.5" />
              <p className="text-[11px] text-accent-yellow leading-relaxed">
                Node type <code className="font-mono">{data.nodeTypeId}</code>{' '}
                is not registered. Properties cannot be edited.
              </p>
            </div>
          )
        )}

        <div className="border-t border-frost" />

        <SectionHeader>Details</SectionHeader>
        <DetailRow label="Node ID" value={nodeId} mono />
        <DetailRow label="Type" value={def?.typeId ?? 'unknown'} />
        <DetailRow
          label="Category"
          value={
            def ? (CATEGORY_CONFIG[def.category]?.label ?? def.category) : '—'
          }
        />
        <DetailRow
          label="Position"
          value={`${position.x.toFixed(0)}, ${position.y.toFixed(0)}`}
        />

        <div className="pt-2">
          <Button
            variant="ghost"
            size="xs"
            className="w-full text-accent-red hover:bg-accent-red/10"
          >
            <Trash2 size={13} />
            Delete Node
          </Button>
        </div>
      </div>
    </aside>
  )
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text pb-0.5">
      {children}
    </h3>
  )
}

function FieldLabel({
  children,
  required,
}: {
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
      {children}
      {required && <span className="text-accent-red ml-0.5">*</span>}
    </label>
  )
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className="text-muted-text">{label}</span>
      <span
        className={`text-near-white ${mono ? 'font-mono text-[11px]' : 'text-[11px]'}`}
      >
        {value}
      </span>
    </div>
  )
}

function PortsList({
  label,
  ports,
}: {
  label: string
  ports: import('../node-types').PortDefinition[]
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-medium text-muted-text">{label}</span>
      <div className="flex flex-wrap gap-1">
        {ports.map((port) => (
          <span
            key={port.id}
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
              port.type === 'data'
                ? 'bg-accent-blue/10 text-accent-blue'
                : port.type === 'signal'
                  ? 'bg-accent-orange/10 text-accent-orange'
                  : 'bg-accent-red/10 text-accent-red'
            }`}
          >
            {port.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function WorkflowOverview({
  workflow,
  nodeCount,
  edgeCount,
}: {
  workflow: WorkflowDetail
  nodeCount: number
  edgeCount: number
}) {
  const summaryBlocks = [
    { label: 'Total Nodes', value: String(nodeCount), icon: Info },
    { label: 'Connections', value: String(edgeCount), icon: GitBranchIcon },
    {
      label: 'Status',
      value: workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1),
      icon: Play,
    },
    {
      label: 'Last Updated',
      value: new Date(workflow.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      icon: ClockIcon,
    },
  ]

  return (
    <aside className="w-[300px] shrink-0 border-l border-frost bg-surface flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-frost">
        <h2 className="text-[13px] font-semibold text-near-white uppercase tracking-wide">
          Workflow Overview
        </h2>
      </div>

      <div className="p-4 space-y-3">
        {summaryBlocks.map((block) => (
          <div
            key={block.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-frost bg-void"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0 text-muted-text">
              <block.icon size={15} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-muted-text leading-tight">
                {block.label}
              </div>
              <div className="text-sm font-semibold text-near-white leading-tight">
                {block.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-frost border-b">
        <span className="text-[12px] font-medium text-near-white">
          Description
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-text leading-relaxed">
          {workflow.description}
        </p>
      </div>

      <div className="px-4 py-3 border-t border-frost mt-auto">
        <div className="text-[11px] text-muted-text">
          Created{' '}
          {new Date(workflow.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </aside>
  )
}
