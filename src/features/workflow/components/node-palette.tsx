import { useState, useCallback, useMemo } from 'react'
import {
  PanelLeftClose,
  Search,
  ChevronLeft,
  ArrowRight,
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
  Zap,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  useAllNodeDefinitions,
} from '../node-registry'
import type { NodeDefinition, WorkflowNodeCategory } from '../node-types'

const ICON_MAP: Record<string, LucideIcon> = {
  Play, Clock, ListPlus, Globe, Layers, Filter,
  LinkCheck, Sparkles, ListTodo, Send, BarChart3, GitBranch, Timer, Bell,
}

const CATEGORY_DESCRIPTIONS: Record<WorkflowNodeCategory, string> = {
  trigger: 'Start your workflow automatically or manually',
  source: 'Connect to external data sources',
  crawl: 'Fetch and ingest data from the web',
  product: 'Process, normalize and filter product data',
  affiliate: 'Validate and manage affiliate links',
  content: 'Generate, queue and manage content',
  publish: 'Publish and distribute content',
  metric: 'Track performance and sync metrics',
  logic: 'Branch, loop, delay, and control flow',
  utility: 'Notifications, logging, and helpers',
}

interface NodePaletteProps {
  collapsed: boolean
  onToggle: () => void
  onAddNode?: (def: NodeDefinition) => void
}

type PaletteView = 'categories' | 'category-detail' | 'search-results'

export function NodePalette({ collapsed, onToggle, onAddNode }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<PaletteView>('categories')
  const [activeCategory, setActiveCategory] = useState<WorkflowNodeCategory | null>(null)
  const allDefs = useAllNodeDefinitions()

  const grouped = useMemo(() => {
    const g: Record<WorkflowNodeCategory, NodeDefinition[]> = {} as Record<WorkflowNodeCategory, NodeDefinition[]>
    for (const cat of CATEGORY_ORDER) {
      const nodes = allDefs.filter((d) => d.category === cat)
      g[cat] = nodes
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
        d.purpose.toLowerCase().includes(q),
    )
  }, [searchQuery, allDefs])

  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val)
    if (val.trim()) {
      setView('search-results')
    } else if (activeCategory) {
      setView('category-detail')
    } else {
      setView('categories')
    }
  }, [activeCategory])

  const handleCategoryClick = useCallback((cat: WorkflowNodeCategory) => {
    setActiveCategory(cat)
    setView('category-detail')
    setSearchQuery('')
  }, [])

  const handleBack = useCallback(() => {
    if (view === 'category-detail') {
      setActiveCategory(null)
      setView('categories')
    } else if (view === 'search-results') {
      setSearchQuery('')
      setView('categories')
    }
  }, [view])

  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeDef: NodeDefinition) => {
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

  const handleClickAdd = useCallback((def: NodeDefinition) => {
    onAddNode?.(def)
  }, [onAddNode])

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-frost bg-surface shrink-0 transition-all duration-200',
        collapsed ? 'w-[52px]' : 'w-[280px]',
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
        <>
          <div className="px-3 py-2.5 border-b border-frost space-y-2">
            {view === 'categories' ? (
              <div>
                <h3 className="text-[11px] font-medium text-near-white">
                  What happens next?
                </h3>
                <p className="text-[10px] text-muted-text mt-0.5">
                  Choose a node to add to your workflow
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  className="w-5 h-5 flex items-center justify-center rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <h3 className="text-[12px] font-medium text-near-white truncate">
                  {view === 'category-detail' && activeCategory
                    ? CATEGORY_CONFIG[activeCategory]?.label
                    : view === 'search-results'
                      ? 'Search Results'
                      : 'Nodes'}
                </h3>
              </div>
            )}

            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search nodes..."
                className="w-full h-8 pl-7 pr-2 rounded-lg border border-frost bg-void text-[12px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/20 focus:border-accent-blue/30"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {view === 'categories' && (
              <CategoriesView
                grouped={grouped}
                onCategoryClick={handleCategoryClick}
              />
            )}

            {view === 'category-detail' && activeCategory && (
              <CategoryDetailView
                nodes={grouped[activeCategory] ?? []}
                onDragStart={handleDragStart}
                onClickAdd={handleClickAdd}
              />
            )}

            {view === 'search-results' && (
              <SearchResultsView
                nodes={filteredNodes ?? []}
                query={searchQuery}
                onDragStart={handleDragStart}
                onClickAdd={handleClickAdd}
              />
            )}
          </div>
        </>
      )}
    </aside>
  )
}

function CategoriesView({
  grouped,
  onCategoryClick,
}: {
  grouped: Record<WorkflowNodeCategory, NodeDefinition[]>
  onCategoryClick: (cat: WorkflowNodeCategory) => void
}) {
  return (
    <div className="space-y-1.5">
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped[cat]
        if (!items || items.length === 0) return null
        const config = CATEGORY_CONFIG[cat]
        const description = CATEGORY_DESCRIPTIONS[cat]

        return (
          <button
            key={cat}
            onClick={() => onCategoryClick(cat)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-frost bg-void hover:bg-surface-2/50 hover:border-frost-hover transition-all text-left group"
          >
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                config.bgColor,
                config.color,
              )}
            >
              <Zap size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-near-white leading-tight">
                {config.label}
              </div>
              <div className="text-[10px] text-muted-text leading-tight mt-0.5">
                {description}
              </div>
              <div className="text-[10px] text-muted-text/50 mt-1">
                {items.length} node{items.length !== 1 ? 's' : ''}
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-muted-text group-hover:text-near-white transition-colors shrink-0"
            />
          </button>
        )
      })}
    </div>
  )
}

function CategoryDetailView({
  nodes,
  onDragStart,
  onClickAdd,
}: {
  nodes: NodeDefinition[]
  onDragStart: (e: React.DragEvent, def: NodeDefinition) => void
  onClickAdd?: (def: NodeDefinition) => void
}) {
  if (nodes.length === 0) {
    return (
      <p className="px-2 py-4 text-[11px] text-muted-text text-center">
        No nodes in this category
      </p>
    )
  }

  return (
    <div className="space-y-0.5">
      {nodes.map((item) => (
        <PaletteNodeItem
          key={item.typeId}
          item={item}
          collapsed={false}
          onDragStart={onDragStart}
          onClickAdd={onClickAdd}
        />
      ))}
    </div>
  )
}

function SearchResultsView({
  nodes,
  query,
  onDragStart,
  onClickAdd,
}: {
  nodes: NodeDefinition[]
  query: string
  onDragStart: (e: React.DragEvent, def: NodeDefinition) => void
  onClickAdd?: (def: NodeDefinition) => void
}) {
  if (nodes.length === 0) {
    return (
      <p className="px-2 py-4 text-[11px] text-muted-text text-center">
        No nodes match "{query}"
      </p>
    )
  }

  return (
    <div className="space-y-0.5">
      {nodes.map((item) => (
        <PaletteNodeItem
          key={item.typeId}
          item={item}
          collapsed={false}
          onDragStart={onDragStart}
          onClickAdd={onClickAdd}
        />
      ))}
    </div>
  )
}

function PaletteNodeItem({
  item,
  collapsed,
  onDragStart,
  onClickAdd,
}: {
  item: NodeDefinition
  collapsed: boolean
  onDragStart: (e: React.DragEvent, def: NodeDefinition) => void
  onClickAdd?: (def: NodeDefinition) => void
}) {
  const Icon = ICON_MAP[item.icon]
  const catConfig = CATEGORY_CONFIG[item.category]

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg text-left transition-colors group',
        collapsed ? 'justify-center py-2' : 'px-2.5 py-2 hover:bg-surface-2',
      )}
    >
      <button
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onClick={() => onClickAdd?.(item)}
        title={collapsed ? `${item.title}: ${item.description}` : item.description}
        className="flex-1 flex items-center gap-2.5 min-w-0 cursor-grab active:cursor-grabbing text-left"
      >
        {Icon && (
          <div
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
              catConfig?.bgColor ?? 'bg-surface-2',
              catConfig?.color ?? 'text-muted-text',
            )}
          >
            <Icon size={14} />
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-near-white leading-tight">
              {item.title}
            </div>
            <div className="text-[10px] text-muted-text leading-tight line-clamp-2">
              {item.description}
            </div>
          </div>
        )}
      </button>
      {!collapsed && onClickAdd && (
        <button
          onClick={() => onClickAdd(item)}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-text hover:text-accent-blue hover:bg-accent-blue-dim transition-all opacity-0 group-hover:opacity-100 shrink-0"
          title="Add node to canvas"
        >
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  )
}
