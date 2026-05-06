import { FileText, BarChart3, Play } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'
import { PropertiesTab } from '../properties-tab'
import { ValidationTab } from '../validation-tab'
import type { ValidationError, NodeDefinition } from '../../stores/node-registry/use-node-registry.store'
import type { TabId, PaneHeaderProps } from './types'

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

interface NodeEditProps {
  def: NodeDefinition | undefined
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  title: string
  subtitle: string | undefined
  localProps: Record<string, unknown>
  errors: ValidationError[]
  errorCount: number
  position: { x: number; y: number }
  nodeId: string
  nodeTypeId: string
  catConfigBgColor?: string
  Icon?: LucideIcon
  onTitleChange: (value: string) => void
  onSubtitleChange: (value: string) => void
  onTitleBlur: () => void
  onSubtitleBlur: () => void
  onPropChange: (propertyKey: string, value: unknown) => void
  onClose: () => void
  onDelete: () => void
  onSave: () => void
  onExecuteSingle?: () => void
}

export function NodeEdit({
  def,
  activeTab,
  setActiveTab,
  title,
  subtitle,
  localProps,
  errors,
  errorCount,
  position,
  nodeId,
  nodeTypeId,
  catConfigBgColor,
  Icon,
  onTitleChange,
  onSubtitleChange,
  onTitleBlur,
  onSubtitleBlur,
  onPropChange,
  onClose,
  onDelete,
  onSave,
  onExecuteSingle,
}: NodeEditProps) {
  return (
    <div className="flex flex-col overflow-hidden">
      <PaneHeader
        side="EDIT THIS NODE"
        idx={2}
        total={3}
        title={def?.identity.title ?? title}
        subtitle={def?.identity.description ?? subtitle}
        color={catConfigBgColor}
        icon={Icon}
      />

      <div className="flex items-center gap-1 px-4 py-2 border-b border-frost shrink-0 bg-surface-2/30">
        {(
          [
            { id: 'properties', label: 'Properties', icon: FileText },
            { id: 'validation', label: 'Validation', icon: BarChart3 },
          ] as { id: TabId; label: string; icon: LucideIcon }[]
        ).map((tab) => {
          const isActive = activeTab === tab.id
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors',
                isActive
                  ? 'bg-accent-blue-dim text-accent-blue'
                  : 'text-muted-text hover:text-near-white hover:bg-surface-2',
              )}
            >
              <TabIcon size={13} />
              {tab.label}
              {tab.id === 'validation' && errorCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-accent-red text-[9px] font-bold text-white">
                  {errorCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'properties' && (
          <PropertiesTab
            def={def}
            title={def?.identity.title ?? title}
            subtitle={def?.identity.description ?? subtitle}
            localProps={localProps}
            errors={errors}
            position={position}
            nodeId={nodeId}
            nodeTypeId={nodeTypeId}
            onTitleChange={onTitleChange}
            onSubtitleChange={onSubtitleChange}
            onTitleBlur={onTitleBlur}
            onSubtitleBlur={onSubtitleBlur}
            onPropChange={onPropChange}
            onDelete={onDelete}
          />
        )}
        {activeTab === 'validation' && (
          <ValidationTab errors={errors} def={def} />
        )}
      </div>

      <div className="border-t border-frost px-4 py-2 bg-accent-blue/5 shrink-0">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="font-mono tracking-wide uppercase text-accent-blue font-bold">
            EXPRESSIONS
          </span>
          <span className="text-muted-text">
            Drag a tag from the left pane into any input. Use{' '}
            <code className="px-1 bg-accent-blue/10 rounded text-accent-blue text-[9px]">
              &#123;&#123; $node.NAME.field &#125;&#125;
            </code>{' '}
            references.
          </span>
        </div>
      </div>

      <div className="border-t border-frost px-4 py-2.5 flex items-center gap-2 bg-surface shrink-0">
        <Button size="xs" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex-1" />
        {onExecuteSingle && (
          <Button
            size="xs"
            color="green-dim"
            onClick={onExecuteSingle}
          >
            <Play size={11} /> Test Run
          </Button>
        )}
        <Button size="xs" color="blue" onClick={onSave}>
          Save Node
        </Button>
      </div>
    </div>
  )
}
