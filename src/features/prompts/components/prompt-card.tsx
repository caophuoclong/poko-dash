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
import { cn } from '#/shared/utils'
import type { Prompt } from '../types/prompt'

const typeLabels: Record<string, string> = {
  content_generation: 'Content Gen',
  analysis: 'Analysis',
  refinement: 'Refinement',
  custom: 'Custom',
}

const typeColors: Record<string, string> = {
  content_generation:
    'bg-accent-blue-dim text-accent-blue border border-accent-blue/20',
  analysis:
    'bg-accent-green-dim text-accent-green border border-accent-green-border',
  refinement:
    'bg-accent-orange-dim text-accent-orange border border-accent-orange-border',
  custom: 'bg-surface-2 text-muted-text border border-frost',
}

const categoryLabels: Record<string, string> = {
  social_media: 'Social',
  blog: 'Blog',
  video: 'Video',
  email: 'Email',
  general: 'General',
}

const statusColors: Record<string, string> = {
  active:
    'bg-accent-green-dim text-accent-green border border-accent-green-border',
  draft: 'bg-surface-2 text-muted-text border border-frost',
  archived: 'bg-surface-2 text-muted-text border border-frost',
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

  const templatePreview =
    prompt.template.length > 120
      ? prompt.template.slice(0, 120) + '…'
      : prompt.template

  return (
    <div className="bg-surface border border-frost rounded-2xl p-5 flex flex-col gap-3 hover:border-accent-blue/40 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              typeColors[prompt.promptType] || 'bg-surface-2 text-muted-text',
            )}
          >
            {typeLabels[prompt.promptType] || prompt.promptType}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-surface-2 text-muted-text border border-frost">
            {categoryLabels[prompt.category] || prompt.category}
          </span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              prompt.role === 'system'
                ? 'bg-accent-orange-dim text-accent-orange border border-accent-orange-border'
                : 'bg-surface-2 text-muted-text border border-frost',
            )}
          >
            {prompt.role ?? 'user'}
          </span>
          {prompt.status !== 'active' && (
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                statusColors[prompt.status],
              )}
            >
              {prompt.status}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-text shrink-0">
          v{prompt.version}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-near-white text-sm leading-snug mb-1">
          {prompt.name}
        </h3>
        {prompt.description && (
          <p className="text-xs text-muted-text line-clamp-1">
            {prompt.description}
          </p>
        )}
      </div>

      <div className="bg-surface-2 rounded-lg px-3 py-2 border border-frost">
        <p className="text-xs text-muted-text font-mono leading-relaxed line-clamp-3">
          {templatePreview}
        </p>
      </div>

      {prompt.variables && prompt.variables.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {prompt.variables.map((v) => (
            <span
              key={v}
              className="text-xs px-1.5 py-0.5 rounded bg-accent-blue-dim text-accent-blue font-mono border border-accent-blue/20"
            >
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-text">
        {prompt.avgRating !== undefined && (
          <span className="flex items-center gap-1">
            <Star className="size-3 text-accent-yellow fill-accent-yellow" />
            {prompt.avgRating.toFixed(1)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Flame className="size-3 text-accent-orange" />
          {prompt.usageCount} uses
        </span>
        {prompt.tags && prompt.tags.length > 0 && (
          <span className="truncate">
            {prompt.tags.map((t) => `#${t}`).join(' ')}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-frost">
        <Button
          size="sm"
          color="blue-dim"
          onClick={() => onUse(prompt)}
          className="flex-1"
        >
          Use Prompt
        </Button>

        <div className="relative" ref={menuRef}>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-muted-text hover:text-near-white"
          >
            <MoreHorizontal />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 z-20 bg-surface border border-frost rounded-xl shadow-lg py-1 min-w-[160px]">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-near-white hover:bg-surface-2 transition-colors"
                onClick={() => {
                  onEdit(prompt)
                  setMenuOpen(false)
                }}
              >
                <Pencil className="size-3.5" /> Edit
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-near-white hover:bg-surface-2 transition-colors"
                onClick={() => {
                  onRefine(prompt)
                  setMenuOpen(false)
                }}
              >
                <GitBranch className="size-3.5" /> Refine (new version)
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-near-white hover:bg-surface-2 transition-colors"
                onClick={() => {
                  onRate(prompt)
                  setMenuOpen(false)
                }}
              >
                <Star className="size-3.5" /> Rate
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-near-white hover:bg-surface-2 transition-colors"
                onClick={() => {
                  onViewVersions(prompt)
                  setMenuOpen(false)
                }}
              >
                <History className="size-3.5" /> Version History
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent-red hover:bg-surface-2 transition-colors"
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
  )
}
