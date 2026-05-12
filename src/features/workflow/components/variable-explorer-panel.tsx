import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Braces,
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  Network,
  Table2,
  FileJson,
  Variable,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import type { Node } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import { groupVariables } from '../utils/variable-system-utils'
import type { VariableRef } from '../utils/variable-system-utils'

type ExplorerTab = 'schema' | 'table' | 'json'

interface VariableExplorerPanelProps {
  prevNodes: Node<WorkflowNodeData>[]
  variables: VariableRef[]
  onInsertVar: (ref: string) => void
}

export function VariableExplorerPanel({
  prevNodes,
  variables,
  onInsertVar,
}: VariableExplorerPanelProps) {
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
        (v) =>
          v.id.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q),
      )
      if (matched.length > 0) result[key] = matched
    }
    return result
  }, [grouped, search])

  const flatVars = useMemo(
    () => Object.values(filteredGroups).flat(),
    [filteredGroups],
  )
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
          <span className="text-[11px] font-semibold text-near-white uppercase tracking-wide">
            Variable Explorer
          </span>
        </div>

        <div className="flex rounded-lg bg-surface-2/50 border border-frost overflow-hidden">
          {(
            [
              { id: 'schema', icon: Network, label: 'Schema' },
              { id: 'table', icon: Table2, label: 'Table' },
              { id: 'json', icon: FileJson, label: 'JSON' },
            ] as { id: ExplorerTab; icon: typeof Network; label: string }[]
          ).map((tab) => {
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
                <TabIcon size={12} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {explorerTab === 'schema' || explorerTab === 'table' ? (
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-text"
            />
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
                <p className="text-[11px] text-muted-text font-medium">
                  No variables available
                </p>
                <p className="text-[10px] text-muted-text mt-1">
                  Connect upstream nodes to see variables here
                </p>
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
                    {isOpen ? (
                      <ChevronDown
                        size={12}
                        className="text-muted-text shrink-0"
                      />
                    ) : (
                      <ChevronRight
                        size={12}
                        className="text-muted-text shrink-0"
                      />
                    )}
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
                      {group}
                    </span>
                    <span className="text-[10px] text-muted-text/50 ml-auto">
                      {items.length}
                    </span>
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
                          <Variable
                            size={11}
                            className="text-accent-blue shrink-0 mt-px"
                          />
                          <div className="min-w-0 flex-1">
                            <code className="text-[11px] text-accent-blue font-mono block truncate">
                              {v.display}
                            </code>
                            <div className="text-[10px] text-muted-text truncate">
                              {v.description}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(v)
                            }}
                            className="opacity-0 group-hover:opacity-100 text-muted-text hover:text-near-white shrink-0 transition-opacity"
                            title="Copy variable"
                          >
                            {copied === v.id ? (
                              <CheckCircle2
                                size={11}
                                className="text-accent-green"
                              />
                            ) : (
                              <Copy size={11} />
                            )}
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
                <p className="text-[11px] text-muted-text">
                  No variables to display
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface/95 backdrop-blur">
                  <tr className="border-b border-frost">
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider">
                      Variable
                    </th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-muted-text uppercase tracking-wider">
                      Value
                    </th>
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
                        <code className="text-[11px] text-accent-blue font-mono">
                          {v.display}
                        </code>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className="text-[10px] text-muted-text">
                          {v.sourceNodeName ?? v.source}
                        </span>
                      </td>
                      <td className="px-3 py-1.5">
                        <code className="text-[10px] text-accent-green font-mono">
                          {v.sampleValue ?? '—'}
                        </code>
                      </td>
                      <td className="px-3 py-1.5">
                        <Copy
                          size={11}
                          className="text-muted-text hover:text-near-white cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(v)
                          }}
                        />
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
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
                Variable Map (JSON)
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonOutput)
                  setCopied('json')
                  setTimeout(() => setCopied(null), 1500)
                }}
                className="text-[10px] text-accent-blue hover:text-accent-blue/80 flex items-center gap-1"
              >
                {copied === 'json' ? (
                  <CheckCircle2 size={11} className="text-accent-green" />
                ) : (
                  <Copy size={11} />
                )}
                Copy
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-void border border-frost text-[11px] text-near-white font-mono leading-relaxed whitespace-pre overflow-x-auto">
              {variables.length > 0
                ? jsonOutput
                : '{\n  // No upstream variables available\n}'}
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
