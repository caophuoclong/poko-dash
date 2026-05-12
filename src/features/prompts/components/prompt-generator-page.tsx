import * as React from 'react'
import {
  Search,
  Plus,
  Loader2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { EmptyState } from '#/components/ui/empty-state'
import { usePageHeader } from '#/components/ui/page-header-context'
import { usePrompts, useDeletePrompt } from '../hooks/use-prompts'
import PromptCard from './prompt-card'
import PromptCompileModal from './prompt-compile-modal'
import PromptForm from './prompt-form'
import PromptTrending from './prompt-trending'
import PromptVersionsModal from './prompt-versions-modal'
import PromptRateModal from './prompt-rate-modal'
import PromptRefineModal from './prompt-refine-modal'
import type { Prompt, PromptType, PromptCategory, PromptRole } from '../types'
import mockPrompts from '../data/mock-prompts'
import { cn } from '#/shared/utils'

type Tab = 'library' | 'trending' | 'my-prompts'

const TYPE_OPTIONS: { value: PromptType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'content_generation', label: 'Content Gen' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'refinement', label: 'Refinement' },
  { value: 'custom', label: 'Custom' },
]

const CATEGORY_OPTIONS: { value: PromptCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'blog', label: 'Blog' },
  { value: 'video', label: 'Video' },
  { value: 'email', label: 'Email' },
  { value: 'general', label: 'General' },
]

const ROLE_OPTIONS: { value: PromptRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'system', label: 'System' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const PAGE_SIZE = 12

const TABS: { value: Tab; label: string }[] = [
  { value: 'library', label: 'Library' },
  { value: 'trending', label: 'Trending' },
  { value: 'my-prompts', label: 'My Prompts' },
]

function PromptGeneratorInner() {
  const [tab, setTab] = React.useState<Tab>('library')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterType, setFilterType] = React.useState<PromptType | 'all'>('all')
  const [filterCategory, setFilterCategory] = React.useState<
    PromptCategory | 'all'
  >('all')
  const [filterRole, setFilterRole] = React.useState<PromptRole | 'all'>('all')
  const [filterStatus, setFilterStatus] = React.useState('all')
  const [showFilters, setShowFilters] = React.useState(false)
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const [compileTarget, setCompileTarget] = React.useState<Prompt | null>(null)
  const [editTarget, setEditTarget] = React.useState<Prompt | null>(null)
  const [versionsTarget, setVersionsTarget] = React.useState<Prompt | null>(
    null,
  )
  const [rateTarget, setRateTarget] = React.useState<Prompt | null>(null)
  const [refineTarget, setRefineTarget] = React.useState<Prompt | null>(null)
  const [showCreateForm, setShowCreateForm] = React.useState(false)

  const { data, isLoading } = usePrompts()
  const apiPrompts = (data ?? []) as Prompt[]
  const allPrompts: Prompt[] = apiPrompts.length > 0 ? apiPrompts : mockPrompts
  const deletePrompt = useDeletePrompt()

  const activeFilterCount = [
    filterType,
    filterCategory,
    filterRole,
    filterStatus,
  ].filter((f) => f !== 'all').length

  const filteredPrompts = React.useMemo(() => {
    return allPrompts.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = filterType === 'all' || p.promptType === filterType
      const matchesCategory =
        filterCategory === 'all' || p.category === filterCategory
      const matchesRole =
        filterRole === 'all' || p.role === filterRole
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus
      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesRole &&
        matchesStatus
      )
    })
  }, [
    allPrompts,
    searchTerm,
    filterType,
    filterCategory,
    filterRole,
    filterStatus,
  ])

  const myPrompts = React.useMemo(
    () => filteredPrompts.filter((p) => p.status !== 'archived'),
    [filteredPrompts],
  )

  const displayedPrompts = tab === 'library' ? filteredPrompts : myPrompts
  const visiblePrompts = displayedPrompts.slice(0, visibleCount)
  const hasMore = visibleCount < displayedPrompts.length

  // Infinite scroll via IntersectionObserver
  React.useEffect(() => {
    if (!hasMore || tab === 'trending') return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => c + PAGE_SIZE)
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, tab])

  // Reset visible count when tab/filters change
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [tab, searchTerm, filterType, filterCategory, filterRole, filterStatus])

  async function handleDelete(prompt: Prompt) {
    if (!confirm(`Delete "${prompt.name}"? This cannot be undone.`)) return
    await deletePrompt.mutateAsync(prompt.promptId)
  }

  function handleCreateClick() {
    setShowCreateForm(true)
  }

  const selectClass =
    'bg-surface-2 border border-frost rounded-lg px-3 py-1.5 text-sm text-near-white focus:outline-none focus:ring-1 focus:ring-accent-orange'

  usePageHeader(
    showCreateForm || editTarget
      ? null
      : {
          title: 'Prompt Library',
          description:
            'Browse, create, and manage AI prompts for your affiliate content.',
          actions: (
            <Button size="sm" onClick={handleCreateClick}>
              <Plus className="size-4" />
              Create Prompt
            </Button>
          ),
        },
  )

  if (showCreateForm || editTarget) {
    return (
      <div className="-mx-6 -mt-6">
        <PromptForm
          prompt={editTarget ?? undefined}
          onSuccess={() => {
            setShowCreateForm(false)
            setEditTarget(null)
          }}
          onCancel={() => {
            setShowCreateForm(false)
            setEditTarget(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-full">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-text pointer-events-none" />
          <Input
            type="search"
            placeholder="Search prompts…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-surface-2 border-frost text-near-white placeholder:text-muted-text"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'border-frost text-muted-text gap-1.5',
              showFilters && 'border-accent-orange text-accent-orange',
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge tone="orange" size="sm" variant="soft">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* ── Filter panel ────────────────────────────────── */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-3 mt-3 shrink-0 bg-surface border border-frost rounded-[var(--radius-md)]">
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as PromptType | 'all')
            }
            className={selectClass}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value as PromptCategory | 'all')
            }
            className={selectClass}
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(e.target.value as PromptRole | 'all')
            }
            className={selectClass}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={selectClass}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setFilterType('all')
                setFilterCategory('all')
                setFilterRole('all')
                setFilterStatus('all')
              }}
              className="text-xs text-accent-orange hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="flex border-b border-[var(--color-hairline)] mt-4 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t.value
                ? 'text-accent-orange'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]',
            )}
          >
            {t.label}
            {tab === t.value && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent-orange rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Scrollable content ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-4">
        {tab === 'trending' ? (
          <PromptTrending onUse={setCompileTarget} />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-accent-orange" />
          </div>
        ) : displayedPrompts.length === 0 ? (
          <EmptyState
            variant="card"
            icon={<Sparkles />}
            title="No prompts found"
            description={
              searchTerm || activeFilterCount > 0
                ? 'Try a different keyword or clear your filters.'
                : 'Create your first prompt to start generating affiliate content.'
            }
            primaryAction={
              <Button size="sm" onClick={handleCreateClick}>
                <Plus className="size-4" />
                Create Prompt
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visiblePrompts.map((prompt) => (
                <PromptCard
                  key={prompt.promptId}
                  prompt={prompt}
                  onUse={setCompileTarget}
                  onEdit={setEditTarget}
                  onDelete={handleDelete}
                  onViewVersions={setVersionsTarget}
                  onRate={setRateTarget}
                  onRefine={setRefineTarget}
                />
              ))}
            </div>
            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-1" />}
            {hasMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="size-5 animate-spin text-[var(--color-muted)]" />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────── */}
      <PromptCompileModal
        prompt={compileTarget}
        open={!!compileTarget}
        onClose={() => setCompileTarget(null)}
      />
      <PromptVersionsModal
        prompt={versionsTarget}
        open={!!versionsTarget}
        onClose={() => setVersionsTarget(null)}
        onUseVersion={setCompileTarget}
      />
      <PromptRateModal
        prompt={rateTarget}
        open={!!rateTarget}
        onClose={() => setRateTarget(null)}
      />
      <PromptRefineModal
        prompt={refineTarget}
        open={!!refineTarget}
        onClose={() => setRefineTarget(null)}
      />
    </div>
  )
}

export default function PromptGeneratorPage() {
  return <PromptGeneratorInner />
}
