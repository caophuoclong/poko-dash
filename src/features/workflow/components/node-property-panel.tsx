import { useState, useCallback, useEffect } from 'react'
import { X, FileText, Settings, Activity } from 'lucide-react'
import { cn } from '#/shared/utils'
import { useNodeRegistryStore, CATEGORY_CONFIG } from '../node-registry'
import { PropertyEditor } from './property-editors/property-editor'
import type { WorkflowNodeData, NodeMeta, NodeOutputResult } from '../types'
import type { PropertySchema, NodeDefinition, ValidationError } from '../node-types'
import { FieldLabel } from './property-editors/field-label'

type TabId = 'parameters' | 'settings' | 'output'

interface NodePropertyPanelProps {
  nodeId: string
  data: WorkflowNodeData
  onClose: () => void
  onConfigChange: (key: string, value: unknown) => void
  onMetaChange: (patch: Partial<NodeMeta>) => void
  onTitleChange: (title: string) => void
  executionResult?: NodeOutputResult
}

export function NodePropertyPanel({
  data,
  onClose,
  onConfigChange,
  onMetaChange,
  onTitleChange,
  executionResult,
}: NodePropertyPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('parameters')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(data.title)

  const def = useNodeRegistryStore((s) =>
    data.nodeTypeId ? s.definitions[String(data.nodeTypeId)] : undefined,
  )
  const catConfig = def ? CATEGORY_CONFIG[def.category] : null

  const config = (data.config ?? {}) as Record<string, unknown>
  const meta: NodeMeta = {
    disabled: data.disabled,
    notes: data.notes,
    continueOnFail: data.continueOnFail,
    retryOnFail: data.retryOnFail,
    retryCount: data.retryCount,
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleTitleSubmit = useCallback(() => {
    setEditingTitle(false)
    if (titleValue.trim() && titleValue !== data.title) {
      onTitleChange(titleValue.trim())
    }
  }, [titleValue, data.title, onTitleChange])

  const hasOutput = !!executionResult

  const tabs: { id: TabId; label: string; icon: typeof FileText }[] = [
    { id: 'parameters', label: 'Parameters', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    ...(hasOutput ? [{ id: 'output' as TabId, label: 'Output', icon: Activity }] : []),
  ]

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[360px] z-50 bg-surface border-l border-frost flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-frost shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {catConfig && (
            <div className={cn('w-2 h-2 rounded-full shrink-0', catConfig.bgColor)} />
          )}
          {editingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit()
                if (e.key === 'Escape') {
                  setTitleValue(data.title)
                  setEditingTitle(false)
                }
              }}
              autoFocus
              className="flex-1 h-6 px-1 text-[13px] font-semibold text-near-white bg-void border border-frost rounded focus:outline-none focus:ring-1 focus:ring-accent-blue/20"
            />
          ) : (
            <span
              onClick={() => setEditingTitle(true)}
              className="text-[13px] font-semibold text-near-white truncate cursor-text hover:text-accent-blue transition-colors"
              title="Click to edit"
            >
              {data.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {def && (
            <span className="text-[10px] font-mono text-muted-text">
              {def.typeId} · v{def.version}
            </span>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-frost shrink-0">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-accent-blue-dim text-accent-blue'
                  : 'text-muted-text hover:text-near-white hover:bg-surface-2',
              )}
            >
              <TabIcon size={13} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'parameters' && def && (
          <ParametersTab def={def} config={config} onConfigChange={onConfigChange} />
        )}
        {activeTab === 'parameters' && !def && (
          <div className="flex items-center justify-center h-32 text-[11px] text-muted-text">
            No definition loaded for this node
          </div>
        )}
        {activeTab === 'settings' && (
          <SettingsTab meta={meta} onMetaChange={onMetaChange} />
        )}
        {activeTab === 'output' && executionResult && (
          <OutputTab result={executionResult} />
        )}
      </div>
    </div>
  )
}

function ParametersTab({
  def,
  config,
  onConfigChange,
}: {
  def: NodeDefinition
  config: Record<string, unknown>
  onConfigChange: (key: string, value: unknown) => void
}) {
  const errors: ValidationError[] = def.validate ? def.validate(config) : []

  return (
    <div className="space-y-4">
      {def.purpose && (
        <div className="flex gap-2 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/10">
          <span className="text-[12px] text-muted-text leading-relaxed">{def.purpose}</span>
        </div>
      )}

      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-3">
          Configuration
        </h3>
        <div className="space-y-3">
          {def.propertySchema
            .filter((s: PropertySchema) => !s.visibleWhen || s.visibleWhen(config))
            .map((schema: PropertySchema) => (
              <PropertyEditor
                key={schema.key}
                schema={schema}
                value={config[schema.key] ?? schema.defaultValue}
                onChange={onConfigChange}
                allProps={config}
                errors={errors.filter((e) => e.propertyKey === schema.key)}
              />
            ))}
        </div>
      </div>

      {(def.inputs.length > 0 || def.outputs.length > 0) && (
        <>
          <div className="border-t border-frost" />
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-2">
              Ports
            </h3>
            <div className="space-y-2">
              {def.inputs.length > 0 && (
                <div>
                  <span className="text-[10px] font-medium text-muted-text">Inputs</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {def.inputs.map((port) => (
                      <span
                        key={port.id}
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                          port.type === 'data'
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : port.type === 'signal'
                              ? 'bg-accent-orange/10 text-accent-orange'
                              : 'bg-accent-red/10 text-accent-red',
                        )}
                      >
                        {port.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {def.outputs.length > 0 && (
                <div>
                  <span className="text-[10px] font-medium text-muted-text">Outputs</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {def.outputs.map((port) => (
                      <span
                        key={port.id}
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium',
                          port.type === 'data'
                            ? 'bg-accent-blue/10 text-accent-blue'
                            : port.type === 'signal'
                              ? 'bg-accent-orange/10 text-accent-orange'
                              : 'bg-accent-red/10 text-accent-red',
                        )}
                      >
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
    </div>
  )
}

function SettingsTab({
  meta,
  onMetaChange,
}: {
  meta: NodeMeta
  onMetaChange: (patch: Partial<NodeMeta>) => void
}) {
  return (
    <div className="space-y-4">
      <ToggleRow
        label="Disabled"
        description="When on, this node is skipped during execution"
        checked={Boolean(meta.disabled)}
        onChange={(v) => onMetaChange({ disabled: v })}
      />

      <div className="space-y-1">
        <FieldLabel>Notes</FieldLabel>
        <textarea
          value={meta.notes ?? ''}
          onChange={(e) => onMetaChange({ notes: e.target.value })}
          placeholder="Optional note visible on the canvas node"
          rows={3}
          className="w-full px-2.5 py-2 rounded-lg border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 resize-none"
        />
      </div>

      <div className="border-t border-frost" />

      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
        Error handling
      </h3>

      <ToggleRow
        label="Continue on fail"
        description="On error, route to error output instead of stopping"
        checked={Boolean(meta.continueOnFail)}
        onChange={(v) => onMetaChange({ continueOnFail: v })}
      />

      <ToggleRow
        label="Retry on fail"
        description="Retry this node if it fails"
        checked={Boolean(meta.retryOnFail)}
        onChange={(v) => onMetaChange({ retryOnFail: v })}
      />

      {meta.retryOnFail && (
        <div className="space-y-1 pl-2">
          <FieldLabel>Retry count</FieldLabel>
          <input
            type="number"
            min={1}
            max={5}
            value={meta.retryCount ?? 1}
            onChange={(e) => onMetaChange({ retryCount: Number(e.target.value) })}
            className="w-24 h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
          />
        </div>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <FieldLabel>{label}</FieldLabel>
        <p className="text-[10px] text-muted-text/70 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors mt-1',
          checked ? 'bg-accent-blue' : 'bg-frost',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  )
}

function OutputTab({ result }: { result: NodeOutputResult }) {
  const [showStack, setShowStack] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {result.status === 'success' && (
          <span className="flex items-center gap-1.5 text-accent-green">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            Success
          </span>
        )}
        {result.status === 'error' && (
          <span className="flex items-center gap-1.5 text-accent-red">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            Error
          </span>
        )}
        {result.status === 'skipped' && (
          <span className="flex items-center gap-1.5 text-muted-text">
            <span className="w-2 h-2 rounded-full bg-muted-text" />
            Skipped
          </span>
        )}
        <span className="text-[11px] text-muted-text">· {result.durationMs}ms</span>
      </div>

      <div className="space-y-1 text-[11px]">
        <div className="flex gap-2">
          <span className="text-muted-text shrink-0">Started</span>
          <span className="text-near-white">{new Date(result.startedAt).toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-text shrink-0">Finished</span>
          <span className="text-near-white">{new Date(result.finishedAt).toLocaleString()}</span>
        </div>
      </div>

      {result.inputData != null && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-1.5">
            Input
          </h4>
          <pre className="p-3 rounded-lg bg-void border border-frost text-[11px] text-near-white overflow-auto max-h-[300px] font-mono">
            {typeof result.inputData === 'string'
              ? result.inputData
              : JSON.stringify(result.inputData, null, 2)}
          </pre>
        </div>
      )}

      {result.outputData != null && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-text mb-1.5">
            Output
          </h4>
          <pre className="p-3 rounded-lg bg-void border border-frost text-[11px] text-near-white overflow-auto max-h-[300px] font-mono">
            {typeof result.outputData === 'string'
              ? result.outputData
              : JSON.stringify(result.outputData, null, 2)}
          </pre>
        </div>
      )}

      {result.status === 'error' && result.error && (
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-accent-red mb-1.5">
            Error
          </h4>
          <div className="p-3 rounded-lg bg-accent-red/5 border border-accent-red/20">
            <p className="text-[12px] text-accent-red">{result.error.message}</p>
            {result.error.stack && (
              <>
                <button
                  onClick={() => setShowStack((v) => !v)}
                  className="text-[10px] text-accent-red/70 hover:text-accent-red mt-2 underline"
                >
                  {showStack ? 'Hide' : 'Show'} stack trace
                </button>
                {showStack && (
                  <pre className="mt-2 text-[10px] text-accent-red/60 overflow-auto max-h-[200px] font-mono whitespace-pre-wrap">
                    {result.error.stack}
                  </pre>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
