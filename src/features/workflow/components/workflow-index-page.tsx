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
  HeartPulse,
  Clock3,
  Activity,
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
import type { WorkflowSummary, WorkflowHealth } from '../types'
import { usePageHeader } from '@/components/ui/page-header-context'
import { EmptyState } from '@/components/ui/empty-state'
import { WorkflowSkeleton } from '@/components/feedback'

const statusConfig: Record<
  WorkflowSummary['status'],
  { label: string; tone: 'green' | 'yellow' | 'orange' | 'neutral' }
> = {
  active: { label: 'Active', tone: 'green' },
  paused: { label: 'Paused', tone: 'yellow' },
  draft: { label: 'Draft', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'neutral' },
}

function getWorkflowHealth(wf: WorkflowSummary): WorkflowHealth {
  const successRate = wf.executionStats?.successRate
  const lastStatus = wf.executionStats?.lastStatus

  if (!successRate && !lastStatus) return 'unknown'
  if (lastStatus === 'error' || (successRate ?? 100) < 50) return 'failing'
  if ((successRate ?? 100) < 80) return 'degraded'
  return 'healthy'
}

const healthTone: Record<WorkflowHealth, 'green' | 'yellow' | 'orange' | 'neutral'> = {
  healthy: 'green',
  degraded: 'yellow',
  failing: 'orange',
  unknown: 'neutral',
}

const healthLabel: Record<WorkflowHealth, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  failing: 'Failing',
  unknown: 'Unknown',
}

function formatDuration(ms?: number) {
  if (!ms) return '—'
  const sec = Math.round(ms / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  const rem = sec % 60
  return `${min}m ${rem}s`
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

  usePageHeader({
    title: 'Workflows',
    description: 'Manage your content automation pipelines',
    primaryAction: (
      <Button
        size="xs"
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
    ),
  })

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <input
          type="text"
          placeholder="Search workflows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus-visible:border-[var(--color-ink)] focus-visible:border-2 transition-colors"
        />
      </div>

      {isLoading && <WorkflowSkeleton />}

      {isError && (
        <EmptyState
          variant="card"
          icon={<GitBranch />}
          title="Failed to load workflows"
          description="Please try again to continue managing your automation pipelines."
          primaryAction={
            <Button size="sm" variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {filtered.map((wf) => {
            const status = statusConfig[wf.status]
            const health = getWorkflowHealth(wf)

            return (
              <div
                key={wf.id}
                className={cn(
                  'block bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] px-5 py-4 transition-colors',
                  'hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)]',
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
                    <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-accent-blue-dim flex items-center justify-center shrink-0">
                      <GitBranch size={17} className="text-accent-blue" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-medium text-[var(--color-ink)] truncate">
                          {wf.name}
                        </span>
                        <Badge tone={status.tone} size="sm">
                          {status.label}
                        </Badge>
                        <Badge tone={healthTone[health]} size="sm">
                          <HeartPulse size={11} className="mr-1" />
                          {healthLabel[health]}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] truncate">
                        {wf.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted-soft)]">
                        <span className="inline-flex items-center gap-1">
                          <Activity size={12} />
                          {wf.executionStats?.totalRuns ?? 0} runs
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={12} />
                          avg {formatDuration(wf.executionStats?.avgDurationMs)}
                        </span>
                        <span>
                          success {wf.executionStats?.successRate ?? 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--color-muted)]">
                      <GitBranch size={13} />
                      <span>{wf.nodeCount} nodes</span>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-0.5">
                      <span className="text-xs text-[var(--color-muted)]">
                        {wf.lastRunAt
                          ? `Last run ${formatRelative(wf.lastRunAt)}`
                          : 'Never run'}
                      </span>
                      <span className="text-[11px] text-[var(--color-muted-soft)]">
                        Created {formatDate(wf.createdAt)}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {wf.status === 'active' && (
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-muted)] hover:text-accent-yellow hover:bg-accent-yellow/10 transition-colors"
                          title="Pause"
                        >
                          <Pause size={15} />
                        </button>
                      )}
                      {wf.status === 'paused' && (
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-muted)] hover:text-accent-green hover:bg-accent-green-dim transition-colors"
                          title="Resume"
                        >
                          <Play size={15} />
                        </button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] transition-colors"
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
        <EmptyState
          variant="card"
          icon={<GitBranch />}
          title="No workflows yet"
          description="Create your first workflow to start automating content operations."
          primaryAction={
            <Button size="sm" onClick={handleCreate}>
              <Plus size={15} />
              Create your first workflow
            </Button>
          }
        />
      )}

      {!isLoading && !isError && filtered.length === 0 && workflows.length > 0 && (
        <EmptyState
          variant="no-results"
          title="No workflows match your search"
          description="Try a different keyword."
        />
      )}
    </div>
  )
}
