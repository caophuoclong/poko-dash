import { useNavigate } from '@tanstack/react-router'
import {
  GitBranch,
  Plus,
  Search,
  Play,
  Pause,
  Trash2,
  Loader2,
  MoreHorizontal,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/shared/utils'
import { useWorkflowIndexPage } from '../hooks/use-workflow-index-page'
import { formatRelative, formatDate } from '../utils/workflow-index-utils'
import type { WorkflowSummary } from '../types'

const statusConfig: Record<
  WorkflowSummary['status'],
  { label: string; tone: 'green' | 'yellow' | 'orange' | 'neutral' }
> = {
  active: { label: 'Active', tone: 'green' },
  paused: { label: 'Paused', tone: 'yellow' },
  draft: { label: 'Draft', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'neutral' },
}

export function WorkflowIndexPage() {
  const navigate = useNavigate()
  const {
    search,
    setSearch,
    workflows,
    filtered,
    isLoading,
    isError,
    refetch,
    createWorkflow,
    handleCreate,
    handleDelete,
  } = useWorkflowIndexPage()

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-near-white">Workflows</h1>
          <p className="text-sm text-muted-text mt-1">
            Manage your content automation pipelines
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleCreate}
          disabled={createWorkflow.isPending}
        >
          {createWorkflow.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Plus size={15} />
          )}
          New Workflow
        </Button>
      </div>

      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text"
        />
        <input
          type="text"
          placeholder="Search workflows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg border border-frost bg-surface text-sm text-near-white placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 transition-colors"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-muted-text" />
        </div>
      )}

      {isError && (
        <div className="bg-surface border border-frost rounded-xl p-12 text-center">
          <p className="text-sm text-accent-red mb-3">Failed to load workflows</p>
          <Button size="sm" variant="ghost" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {filtered.map((wf) => {
            const status = statusConfig[wf.status]
            return (
              <div
                key={wf.id}
                className={cn(
                  'block bg-surface border border-frost rounded-xl px-5 py-4 transition-colors',
                  'hover:border-frost-hover hover:bg-surface-2',
                  'cursor-pointer',
                )}
                onClick={() =>
                  navigate({
                    to: '/workflow/$workflowId',
                    params: { workflowId: wf.id },
                  })
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-accent-blue-dim flex items-center justify-center shrink-0">
                      <GitBranch size={17} className="text-accent-blue" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-near-white truncate">
                          {wf.name}
                        </span>
                        <Badge tone={status.tone} size="sm">
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-text mt-0.5 truncate">
                        {wf.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-text">
                      <GitBranch size={13} />
                      <span>{wf.nodeCount} nodes</span>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-0.5">
                      <span className="text-xs text-muted-text">
                        {wf.lastRunAt
                          ? `Last run ${formatRelative(wf.lastRunAt)}`
                          : 'Never run'}
                      </span>
                      <span className="text-[11px] text-muted-text/60">
                        Created {formatDate(wf.createdAt)}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {wf.status === 'active' && (
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-text hover:text-accent-yellow hover:bg-accent-yellow/10 transition-colors"
                          title="Pause"
                        >
                          <Pause size={15} />
                        </button>
                      )}
                      {wf.status === 'paused' && (
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-text hover:text-accent-green hover:bg-accent-green-dim transition-colors"
                          title="Resume"
                        >
                          <Play size={15} />
                        </button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
                            title="More"
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom">
                          <DropdownMenuItem
                            className="text-accent-red"
                            onClick={(e) => handleDelete(wf.id, e as any)}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && workflows.length === 0 && (
        <div className="bg-surface border border-frost rounded-xl p-12 text-center">
          <GitBranch size={32} className="mx-auto text-muted-text mb-3" />
          <p className="text-sm text-muted-text">No workflows yet</p>
          <Button size="sm" className="mt-4" onClick={handleCreate}>
            <Plus size={15} />
            Create your first workflow
          </Button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && workflows.length > 0 && (
        <div className="bg-surface border border-frost rounded-xl p-12 text-center">
          <p className="text-sm text-muted-text">
            No workflows match your search.
          </p>
        </div>
      )}
    </div>
  )
}
