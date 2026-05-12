import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Variable } from 'lucide-react'
import { cn } from '#/shared/utils'
import { groupVariables } from '../utils/variable-system-utils'
import type { VariableRef } from '../utils/variable-system-utils'

interface VariablePickerProps {
  variables: VariableRef[]
  onInsert: (varRef: string) => void
  onClose: () => void
  anchorRect?: { top: number; left: number }
}

export function VariablePicker({
  variables,
  onInsert,
  onClose,
  anchorRect,
}: VariablePickerProps) {
  const [search, setSearch] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const grouped = useMemo(() => groupVariables(variables), [variables])
  const groupNames = Object.keys(grouped)

  const filtered = useMemo(() => {
    if (!search) return grouped
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

  const allFiltered = useMemo(() => Object.values(filtered).flat(), [filtered])

  useEffect(() => {
    setSelectedIdx(0)
  }, [search])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx((i) => Math.min(i + 1, allFiltered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (allFiltered[selectedIdx]) {
          onInsert(allFiltered[selectedIdx].id)
          onClose()
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [allFiltered, selectedIdx, onInsert, onClose],
  )

  let flatIdx = -1

  return (
    <div
      className="fixed z-[100] w-[320px] rounded-xl border border-frost bg-surface shadow-2xl overflow-hidden"
      style={
        anchorRect ? { top: anchorRect.top, left: anchorRect.left } : undefined
      }
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-frost">
        <Variable size={13} className="text-muted-text shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search variables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[12px] text-near-white placeholder:text-muted-text/50 outline-none"
        />
        <button
          onClick={onClose}
          className="text-muted-text hover:text-near-white shrink-0"
        >
          Esc
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto p-1">
        {groupNames.map((group) => {
          const items = filtered[group]
          if (!items || items.length === 0) return null
          return (
            <div key={group} className="mb-1">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-text">
                {group}
              </div>
              {items.map((v) => {
                flatIdx++
                const isSelected = flatIdx === selectedIdx
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      onInsert(v.id)
                      onClose()
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition-colors',
                      isSelected ? 'bg-accent-blue/10' : 'hover:bg-surface-2',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-mono text-near-white truncate">
                        {v.display}
                      </div>
                      <div className="text-[10px] text-muted-text mt-0.5">
                        {v.description}
                      </div>
                      {v.sampleValue && (
                        <div className="text-[10px] text-accent-green mt-0.5 font-mono">
                          → {v.sampleValue}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
        {allFiltered.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-6 text-muted-text">
            <Variable size={20} />
            <span className="text-[11px]">No variables found</span>
          </div>
        )}
      </div>
    </div>
  )
}
