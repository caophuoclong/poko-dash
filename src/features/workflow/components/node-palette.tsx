import { useState, useCallback, useMemo } from 'react'
import {
  PanelLeftClose,
  Search,
  type LucideIcon,
  Play,
  Clock,
  ListPlus,
  Globe,
  Layers,
  Filter,
  Link2 as LinkCheck,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch,
  Timer,
  Bell,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  useAllNodeDefinitions,
} from '../node-registry'
import '../node-catalog'
import type { WorkflowNodeDefinition } from '../node-types'

const ICON_MAP: Record<string, LucideIcon> = {
  Play,
  Clock,
  ListPlus,
  Globe,
  Layers,
  Filter,
  LinkCheck,
  Sparkles,
  ListTodo,
  Send,
  BarChart3,
  GitBranch,
  Timer,
  Bell,
}

interface NodePaletteProps {
  collapsed: boolean
  onToggle: () => void
}
export function NodePalette({ collapsed, onToggle }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const allDefs = useAllNodeDefinitions()

  const grouped = useMemo(() => {
    const g: Record<string, WorkflowNodeDefinition[]> = {}
    for (const cat of CATEGORY_ORDER) {
      const nodes = allDefs.filter((d) => d.category === cat)
      if (nodes.length > 0) g[cat] = nodes
    }
    return g
  }, [allDefs])

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase().trim()
    return allDefs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.purpose.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q),
    )
  }, [searchQuery, allDefs])

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeDef: WorkflowNodeDefinition) => {
      console.log('🚀 ~ NodePalette ~ nodeDef:', nodeDef)
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({
          type: 'workflow-node',
          data: {
            title: nodeDef.title,
            subtitle: nodeDef.description,
            icon: nodeDef.icon,
            nodeTypeId: nodeDef.typeId,
            status: 'pending' as const,
            config: nodeDef.defaultProps,
          },
        }),
      )
      event.dataTransfer.effectAllowed = 'move'
    },
    [],
  )

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-frost bg-surface shrink-0 transition-all duration-200',
        collapsed ? 'w-[52px]' : 'w-[240px]',
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

      {!collapsed && (
        <div className="px-2 py-2 border-b border-frost">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-text"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nodes..."
              className="w-full h-7 pl-7 pr-2 rounded-md border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20 focus:border-accent-blue/30"
            />
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1 p-1.5 space-y-3">
        {filteredNodes ? (
          <div className="space-y-0.5">
            {filteredNodes.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-muted-text text-center">
                No nodes match "{searchQuery}"
              </p>
            ) : (
              filteredNodes.map((item) => (
                <PaletteItem
                  key={item.typeId}
                  item={item}
                  collapsed={false}
                  onDragStart={handleDragStart}
                />
              ))
            )}
          </div>
        ) : (
          CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat]
            if (!items || items.length === 0) return null
            const config = CATEGORY_CONFIG[cat]

            return (
              <div key={cat}>
                {!collapsed && (
                  <div
                    className={cn(
                      'px-2 py-1 text-[10px] font-semibold uppercase tracking-wider',
                      config.color,
                    )}
                  >
                    {config.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <PaletteItem
                      key={item.typeId}
                      item={item}
                      collapsed={collapsed}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}

function PaletteItem({
  item,
  collapsed,
  onDragStart,
}: {
  item: WorkflowNodeDefinition
  collapsed: boolean
  onDragStart: (e: React.DragEvent, def: WorkflowNodeDefinition) => void
}) {
  const Icon = ICON_MAP[item.icon]
  const catConfig = CATEGORY_CONFIG[item.category]

  return (
    <button
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      title={
        collapsed ? `${item.title}: ${item.description}` : item.description
      }
      className={cn(
        'w-full flex items-center gap-2.5 rounded-lg text-left cursor-grab active:cursor-grabbing hover:bg-surface-2 transition-colors group',
        collapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-2',
      )}
    >
      {Icon && (
        <div
          className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors',
            catConfig?.bgColor ?? 'bg-surface-2',
            'text-muted-text group-hover:text-near-white',
          )}
        >
          <Icon size={14} />
        </div>
      )}
      {!collapsed && (
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-near-white leading-tight">
            {item.title}
          </div>
          <div className="text-[10px] text-muted-text leading-tight truncate">
            {item.description}
          </div>
        </div>
      )}
    </button>
  )
}
