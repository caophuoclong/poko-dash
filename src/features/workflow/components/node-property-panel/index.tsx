import { useState, useCallback, useEffect } from 'react'
import { X, FileText, Settings, Activity } from 'lucide-react'
import { cn } from '#/shared/utils'
import { ParametersTab } from './node-property-panel/parameters-tab'
import { SettingsTab } from './node-property-panel/settings-tab'
import { OutputTab } from './node-property-panel/output-tab'
import type { WorkflowNodeData, NodeMeta, NodeOutputResult } from '../types'
import { useNodeRegistryStore } from '../stores/node-registry/use-node-registry.store'
import type { NodeDefinition } from '../stores/node-registry/use-node-registry.store'
import { CATEGORY_CONFIG } from '../stores/node-registry/constants'

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

  const def = useNodeRegistryStore().getNodeDefinition(data.nodeTypeId ?? '')
  const catConfig = def ? CATEGORY_CONFIG[def.identity?.category] : null

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
    ...(hasOutput
      ? [{ id: 'output' as TabId, label: 'Output', icon: Activity }]
      : []),
  ]

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[360px] z-50 bg-surface border-l border-frost flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-frost shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {catConfig && (
            <div
              className={cn('w-2 h-2 rounded-full shrink-0', catConfig.bgColor)}
            />
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
              {def.identity?.typeId ?? def.identity.typeId} · v
              {def.identity?.version ?? def.identity.version}
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
          <ParametersTab
            def={def}
            config={config}
            onConfigChange={onConfigChange}
          />
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
