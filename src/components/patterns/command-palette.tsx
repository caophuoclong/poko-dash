import { useEffect, useMemo, useState } from 'react'
import { Search, CornerDownLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { NAV_SECTIONS, SYSTEM_ITEMS } from '@/shared/constants/nav'

const OPEN_COMMAND_PALETTE_EVENT = 'open-command-palette'

interface CommandItem {
  id: string
  label: string
  to: string
  section: string
}

function flattenCommands(): CommandItem[] {
  const fromSections = NAV_SECTIONS.flatMap((section) =>
    section.items.flatMap((item) => {
      if (item.disabled) return []
      if (item.children?.length) {
        return item.children
          .filter((child) => !child.disabled)
          .map((child) => ({
            id: child.id,
            label: `${item.label} / ${child.label}`,
            to: child.to,
            section: section.label || 'Workspace',
          }))
      }
      if (!item.to) return []
      return [{ id: item.id, label: item.label, to: item.to, section: section.label || 'Workspace' }]
    }),
  )

  const fromSystem = SYSTEM_ITEMS.filter((item) => item.to && !item.disabled).map((item) => ({
    id: item.id,
    label: item.label,
    to: item.to!,
    section: 'System',
  }))

  return [...fromSections, ...fromSystem]
}

export function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const commands = useMemo(() => flattenCommands(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q),
    )
  }, [commands, query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }

    const onOpen = () => setOpen(true)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
      return
    }
    setTimeout(() => {
      const input = document.getElementById('command-palette-input') as HTMLInputElement | null
      input?.focus()
    }, 0)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const onSelect = (to: string) => {
    setOpen(false)
    void navigate({ to })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-hairline)] px-3 py-2.5">
          <Search size={15} className="text-[var(--color-muted)]" />
          <input
            id="command-palette-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActiveIndex((prev) => Math.max(prev - 1, 0))
              }
              if (e.key === 'Enter' && filtered[activeIndex]) {
                e.preventDefault()
                onSelect(filtered[activeIndex].to)
              }
            }}
            placeholder="Search routes..."
            className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none"
          />
          <span className="text-[10px] text-[var(--color-muted-soft)] border border-[var(--color-hairline)] rounded-[var(--radius-xs)] px-1.5 py-0.5">
            ESC
          </span>
        </div>

        <div className="max-h-[340px] overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-[var(--color-muted)]">No matching routes</div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.to)}
                className={`w-full flex items-center justify-between gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-left transition-colors ${
                  index === activeIndex
                    ? 'bg-[var(--color-surface-soft)] text-[var(--color-ink)]'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm truncate">{item.label}</div>
                  <div className="text-[11px] text-[var(--color-muted-soft)] truncate">{item.section} · {item.to}</div>
                </div>
                {index === activeIndex ? <CornerDownLeft size={13} className="shrink-0" /> : null}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))
}
