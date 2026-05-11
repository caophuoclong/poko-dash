import { useState, useCallback, useMemo } from 'react'
import {
  PanelLeftClose,
  Search,
  
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
  Bell
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';
import { cn } from '#/shared/utils'
import {
  useNodeRegistryStore
  
} from '../stores/node-registry/use-node-registry.store'
import type {NodeDefinition} from '../stores/node-registry/use-node-registry.store';
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER
  
} from '../stores/node-registry/constants'
import type {WorkflowNodeCategory} from '../stores/node-registry/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  play: Play,
  clock: Clock,
  'list-plus': ListPlus,
  globe: Globe,
  layers: Layers,
  filter: Filter,
  link: LinkCheck,
  sparkles: Sparkles,
  'list-todo': ListTodo,
  send: Send,
  'bar-chart-3': BarChart3,
  'git-branch': GitBranch,
  timer: Timer,
  bell: Bell,
}

interface NodePaletteProps {
  collapsed: boolean
  onToggle: () => void
  onAddNode?: (def: NodeDefinition) => void
}

export function NodePalette({
  collapsed,
  onToggle,
  onAddNode,
}: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const allDefs = useNodeRegistryStore().allNodeDefinitions

  const grouped = useMemo(() => {
    const g: Record<WorkflowNodeCategory, NodeDefinition[]> = {}
    for (const cat of CATEGORY_ORDER) {
      const nodes = allDefs.filter((d) => d.identity.category === cat)
      g[cat] = nodes
    }
    return g
  }, [allDefs])

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return grouped
    const q = searchQuery.toLowerCase().trim()
    const result: Record<WorkflowNodeCategory, NodeDefinition[]> = {}
    for (const cat of CATEGORY_ORDER) {
      const nodes = (grouped[cat] ?? []).filter(
        (d) =>
          d.identity.title.toLowerCase().includes(q) ||
          d.identity.description.toLowerCase().includes(q),
      )
      if (nodes.length > 0) result[cat] = nodes
    }
    return result
  }, [searchQuery, grouped])

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeDef: NodeDefinition) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({
          type: 'workflow-node',
          data: {
            title: nodeDef.identity.title,
            subtitle: nodeDef.identity.description,
            icon: nodeDef.identity.icon,
            nodeTypeId: nodeDef.identity.typeId,
            status: 'pending' as const,
            config: nodeDef.config.defaultProps,
          },
        }),
      )
      event.dataTransfer.effectAllowed = 'move'
    },
    [],
  )

  const handleClickAdd = useCallback(
    (def: NodeDefinition) => {
      onAddNode?.(def)
    },
    [onAddNode],
  )

  const hasResults = Object.values(filteredGroups).some((v) => v.length > 0)

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-frost bg-surface shrink-0 transition-all duration-200',
        collapsed ? 'w-[52px]' : 'w-[260px]',
      )}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-frost shrink-0">
        {!collapsed && (
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-near-white">
            Nodes
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'h-6 w-6 flex items-center justify-center rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors',
            collapsed && 'mx-auto',
          )}
        >
          <PanelLeftClose size={13} className={cn(collapsed && 'rotate-180')} />
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="px-3 py-2 border-b border-frost">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="w-full h-7 pl-7 pr-2 rounded border border-frost bg-void text-[11px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20 focus:border-accent-blue/30"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 py-2">
            {!hasResults && (
              <p className="px-3 py-4 text-[11px] text-muted-text text-center">
                No nodes match &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            {CATEGORY_ORDER.map((cat) => {
              const items = filteredGroups[cat]
              if (!items || items.length === 0) return null
              const config = CATEGORY_CONFIG[cat]

              return (
                <div key={cat} className="mb-2">
                  <div className={cn('flex items-center gap-2 px-3 py-1.5')}>
                    <div
                      className={cn(
                        'w-2 h-2 rounded-sm shrink-0',
                        config?.bgColor,
                      )}
                    />
                    <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-muted-text">
                      {config?.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-text/40 ml-auto">
                      {items.length}
                    </span>
                  </div>

                  <div className="px-1">
                    {items.map((item) => {
                      const Icon = ICON_MAP[item.identity.icon ?? '']
                      return (
                        <div
                          key={item.identity.typeId}
                          className="flex items-center group"
                        >
                          <button
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onClick={() => handleClickAdd(item)}
                            className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded text-left cursor-grab active:cursor-grabbing hover:bg-surface-2 transition-colors min-w-0"
                            title={item.identity.description}
                          >
                            {Icon && (
                              <div
                                className={cn(
                                  'w-5 h-5 rounded flex items-center justify-center shrink-0',
                                  config?.bgColor,
                                  config?.color,
                                )}
                              >
                                <Icon size={11} strokeWidth={2.5} />
                              </div>
                            )}
                            <span className="text-[11px] font-medium text-near-white truncate leading-tight">
                              {item.identity.title}
                            </span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </aside>
  )
}
