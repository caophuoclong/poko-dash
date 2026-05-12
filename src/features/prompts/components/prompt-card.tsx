import * as React from 'react'
import {
  Star,
  Flame,
  MoreHorizontal,
  Pencil,
  Trash2,
  History,
  GitBranch,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/shared/utils'
import type { Prompt } from '../types'

import { TYPE_LABELS, CATEGORY_LABELS } from '../types'
import { STATUS_COLORS } from '#/shared/constants'

const typeTones: Record<string, 'blue' | 'green' | 'orange' | 'neutral'> = {
  content_generation: 'blue',
  analysis: 'green',
  refinement: 'orange',
  custom: 'neutral',
}

const categoryTones: Record<string, 'purple' | 'neutral'> = {
  social_media: 'purple',
  blog: 'neutral',
  video: 'neutral',
  email: 'neutral',
  general: 'neutral',
}

interface PromptCardProps {
  prompt: Prompt
  onUse: (prompt: Prompt) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (prompt: Prompt) => void
  onViewVersions: (prompt: Prompt) => void
  onRate: (prompt: Prompt) => void
  onRefine: (prompt: Prompt) => void
}

export default function PromptCard({
  prompt,
  onUse,
  onEdit,
  onDelete,
  onViewVersions,
  onRate,
  onRefine,
}: PromptCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="bg-surface border border-[var(--color-hairline)] rounded-[var(--radius-md)] p-5 flex flex-col gap-3.5 hover:border-accent-orange/40 transition-colors group">
      {/* ── Name + description ─────────────────────────── */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm leading-snug text-[var(--color-ink)]">
          {prompt.name}
        </h3>
        {prompt.description && (
          <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
            {prompt.description}
          </p>
        )}
      </div>

      {/* ── Type + Category badges ─────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge
          tone={typeTones[prompt.promptType] ?? 'neutral'}
          variant="soft"
          size="sm"
        >
          {TYPE_LABELS[prompt.promptType] || prompt.promptType}
        </Badge>
        <Badge
          tone={categoryTones[prompt.category] ?? 'neutral'}
          variant="soft"
          size="sm"
        >
          {CATEGORY_LABELS[prompt.category] || prompt.category}
        </Badge>
      </div>

      {/* ── Tags as chips ──────────────────────────────── */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((t) => (
            <span
              key={t}
              className="text-caption-sm px-2 py-0.5 rounded-full bg-[var(--color-surface-strong)] text-[var(--color-muted)] border border-[var(--color-hairline)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* ── Stats row ───────────────────────────────────── */}
      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] mt-auto">
        {prompt.avgRating !== undefined && (
          <span className="flex items-center gap-1">
            <Star className="size-3 text-accent-yellow fill-accent-yellow" />
            {prompt.avgRating.toFixed(1)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Flame className="size-3 text-accent-orange" />
          {prompt.usageCount}
        </span>
      </div>

      {/* ── Footer: status + use button + menu ─────────── */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--color-hairline)]">
        <span
          className={cn(
            'text-badge px-2 py-0.5 rounded-full',
            STATUS_COLORS[prompt.status],
          )}
        >
          {prompt.status}
        </span>

        <div className="flex items-center gap-1">
          <Button
            size="xs"
            variant="ghost"
            color="orange-dim"
            onClick={() => onUse(prompt)}
          >
            Use Prompt
          </Button>

          <div className="relative" ref={menuRef}>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setMenuOpen((v) => !v)}
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              <MoreHorizontal className="size-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 z-20 bg-surface border border-[var(--color-hairline)] rounded-[var(--radius-sm)] shadow-lg py-1 min-w-[160px]">
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] transition-colors"
                  onClick={() => {
                    onEdit(prompt)
                    setMenuOpen(false)
                  }}
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] transition-colors"
                  onClick={() => {
                    onRefine(prompt)
                    setMenuOpen(false)
                  }}
                >
                  <GitBranch className="size-3.5" /> Refine (new version)
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] transition-colors"
                  onClick={() => {
                    onRate(prompt)
                    setMenuOpen(false)
                  }}
                >
                  <Star className="size-3.5" /> Rate
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] transition-colors"
                  onClick={() => {
                    onViewVersions(prompt)
                    setMenuOpen(false)
                  }}
                >
                  <History className="size-3.5" /> Version History
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent-red hover:bg-[var(--color-surface-strong)] transition-colors"
                  onClick={() => {
                    onDelete(prompt)
                    setMenuOpen(false)
                  }}
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
