import { useCallback } from 'react'
import {
  PanelLeftClose,
  type LucideIcon,
  Rss,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Calendar,
  Send,
  BarChart3,
  Webhook,
  Mail,
  Replace,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import { NODE_TYPE_CATALOG, type NodeTypeDefinition } from '#/features/workflow/types'

const iconMap: Record<string, LucideIcon> = {
  Rss,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Calendar,
  Send,
  BarChart3,
  Webhook,
  Mail,
  Replace,
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  trigger: { label: 'Triggers', color: 'text-accent-orange' },
  action: { label: 'Actions', color: 'text-accent-blue' },
  condition: { label: 'Conditions', color: 'text-accent-yellow' },
  output: { label: 'Outputs', color: 'text-accent-green' },
}

interface NodePaletteProps {
  collapsed: boolean
  onToggle: () => void
}

export function NodePalette({ collapsed, onToggle }: NodePaletteProps) {
  const grouped = NODE_TYPE_CATALOG.reduce(
    (acc: Record<string, NodeTypeDefinition[]>, node: NodeTypeDefinition) => {
      const cat = node.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(node)
      return acc
    },
    {} as Record<string, NodeTypeDefinition[]>,
  )

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeDef: NodeTypeDefinition) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({ type: nodeDef.type, data: nodeDef.defaultData }),
      )
      event.dataTransfer.effectAllowed = 'move'
    },
    [],
  )

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-frost bg-surface shrink-0 transition-all duration-200',
        collapsed ? 'w-[52px]' : 'w-[220px]',
      )}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-frost shrink-0">
        {!collapsed && (
          <span className="text-[12px] font-semibold text-near-white uppercase tracking-wide">
            Nodes
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'h-6 w-6 flex items-center justify-center rounded-md text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors',
            collapsed && 'mx-auto',
          )}
        >
          <PanelLeftClose size={13} className={cn(collapsed && 'rotate-180')} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-1.5 space-y-3">
        {(['trigger', 'action', 'condition', 'output'] as const).map((cat) => {
          const items = grouped[cat]
          if (!items || items.length === 0) return null

          return (
            <div key={cat}>
              {!collapsed && (
                <div className={cn('px-2 py-1 text-[10px] font-semibold uppercase tracking-wider', categoryConfig[cat].color)}>
                  {categoryConfig[cat].label}
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item: NodeTypeDefinition) => {
                  const Icon = iconMap[item.icon]
                  return (
                    <button
                      key={item.label}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      title={collapsed ? `${item.label}: ${item.description}` : undefined}
                      className={cn(
                        'w-full flex items-center gap-2.5 rounded-lg text-left cursor-grab active:cursor-grabbing hover:bg-surface-2 transition-colors group',
                        collapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-2',
                      )}
                    >
                      {Icon && (
                        <div className="w-7 h-7 rounded-md bg-surface-2 flex items-center justify-center shrink-0 text-muted-text group-hover:text-near-white transition-colors">
                          <Icon size={14} />
                        </div>
                      )}
                      {!collapsed && (
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium text-near-white leading-tight">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-muted-text leading-tight truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
