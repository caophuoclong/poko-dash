import * as React from 'react'
import { Search, Plus, Loader2, SlidersHorizontal } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { usePrompts, useDeletePrompt } from '../hooks/use-prompts'
import PromptCard from './prompt-card'
import PromptCompileModal from './prompt-compile-modal'
import PromptForm from './prompt-form'
import PromptTrending from './prompt-trending'
import PromptVersionsModal from './prompt-versions-modal'
import PromptRateModal from './prompt-rate-modal'
import PromptRefineModal from './prompt-refine-modal'
import type {
  Prompt,
  PromptType,
  PromptCategory,
  PromptRole,
} from '../types/prompt'
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

  const [compileTarget, setCompileTarget] = React.useState<Prompt | null>(null)
  const [editTarget, setEditTarget] = React.useState<Prompt | null>(null)
  const [versionsTarget, setVersionsTarget] = React.useState<Prompt | null>(
    null,
  )
  const [rateTarget, setRateTarget] = React.useState<Prompt | null>(null)
  const [refineTarget, setRefineTarget] = React.useState<Prompt | null>(null)
  const [showCreateForm, setShowCreateForm] = React.useState(false)

  const { data: allPrompts = [], isLoading } = usePrompts()
  const deletePrompt = useDeletePrompt()

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
        filterRole === 'all' || (p.role ?? 'user') === filterRole
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

  async function handleDelete(prompt: Prompt) {
    if (!confirm(`Delete "${prompt.name}"? This cannot be undone.`)) return
    await deletePrompt.mutateAsync(prompt.promptId)
  }

  const selectClass =
    'bg-surface-2 border border-frost rounded-lg px-3 py-1.5 text-sm text-near-white focus:outline-none focus:ring-1 focus:ring-accent-blue'

  const tabClass = (active: boolean) =>
    cn(
      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
      active
        ? 'bg-accent-blue text-white'
        : 'text-muted-text hover:text-near-white hover:bg-surface-2',
    )

  if (showCreateForm || editTarget) {
    return (
      <div className="max-w-2xl">
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
    <div className="max-w-full">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-near-white tracking-tight mb-1">
            Prompt Generator
          </h1>
          <p className="text-sm text-muted-text">
            Browse, create, and compile AI prompts for your content
          </p>
        </div>
        <Button color="blue" onClick={() => setShowCreateForm(true)}>
          <Plus className="size-4" /> New Prompt
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-text pointer-events-none" />
          <Input
            type="search"
            placeholder="Search prompts…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-surface-2 border-frost text-near-white placeholder:text-muted-text"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            'border-frost text-muted-text gap-1.5',
            showFilters && 'border-accent-blue text-accent-blue',
          )}
        >
          <SlidersHorizontal className="size-3.5" /> Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-4 p-4 bg-surface border border-frost rounded-xl">
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
          {(filterType !== 'all' ||
            filterCategory !== 'all' ||
            filterRole !== 'all' ||
            filterStatus !== 'all') && (
            <button
              onClick={() => {
                setFilterType('all')
                setFilterCategory('all')
                setFilterRole('all')
                setFilterStatus('all')
              }}
              className="text-xs text-accent-blue hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-surface-2 border border-frost rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('library')}
          className={tabClass(tab === 'library')}
        >
          Library
        </button>
        <button
          onClick={() => setTab('trending')}
          className={tabClass(tab === 'trending')}
        >
          Trending
        </button>
        <button
          onClick={() => setTab('my-prompts')}
          className={tabClass(tab === 'my-prompts')}
        >
          My Prompts
        </button>
      </div>

      {tab === 'trending' ? (
        <PromptTrending onUse={setCompileTarget} />
      ) : (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-accent-blue" />
            </div>
          ) : (tab === 'library' ? filteredPrompts : myPrompts).length === 0 ? (
            <div className="bg-surface border border-frost rounded-2xl p-12 text-center">
              <p className="text-muted-text mb-4">No prompts found</p>
              <Button
                color="blue"
                size="sm"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="size-3.5" /> Create your first prompt
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(tab === 'library' ? filteredPrompts : myPrompts).map(
                (prompt) => (
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
                ),
              )}
            </div>
          )}
        </>
      )}

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
