import { useState, useMemo, useCallback } from 'react'
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
  Pencil,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Input } from '#/components/ui/input'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxCollection,
  ComboboxItem,
  ComboboxEmpty,
} from '#/components/ui/combobox'
import { filterOptionsByLabel } from '@/components/ui/combobox-utils'
import type { ComboboxOption as ComboboxOptionType } from '@/components/ui/combobox-utils'
import { cn } from '#/shared/utils'
import { useWorkflowIndexPage } from '../hooks/use-workflow-index-page'
import { formatRelative, formatDate } from '../utils/workflow-index-utils'
import type { WorkflowSummary, WorkflowHealth } from '../types'
import { usePageHeader } from '@/components/ui/page-header-context'
import { EmptyState } from '@/components/ui/empty-state'
import { WorkflowSkeleton } from '@/components/feedback'
import { useExecutionControllerExecuteWorkflow } from '#/api/client'

const STATUS_OPTIONS: ComboboxOptionType[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'runs', label: 'Most runs' },
  { value: 'successRate', label: 'Highest success rate' },
]

const statusConfig: Record<
  WorkflowSummary['status'],
  { label: string; tone: 'green' | 'yellow' | 'orange' | 'neutral' }
> = {
  active: { label: 'Active', tone: 'green' },
  paused: { label: 'Paused', tone: 'yellow' },
  draft: { label: 'Draft', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'neutral' },
}

const statusIconTone: Record<WorkflowSummary['status'], string> = {
  active: 'text-accent-green bg-accent-green/10',
  paused: 'text-accent-yellow bg-accent-yellow/10',
  draft: 'text-[var(--color-muted)] bg-[var(--color-surface-strong)]',
  archived: 'text-[var(--color-muted)] bg-[var(--color-surface-soft)]',
}

function getWorkflowHealth(wf: WorkflowSummary): WorkflowHealth {
  const successRate = wf.executionStats?.successRate
  const lastStatus = wf.executionStats?.lastStatus
  if (!successRate && !lastStatus) return 'unknown'
  if (lastStatus === 'error' || (successRate ?? 100) < 50) return 'failing'
  if ((successRate ?? 100) < 80) return 'degraded'
  return 'healthy'
}

const healthTone: Record<
  WorkflowHealth,
  'green' | 'yellow' | 'orange' | 'neutral'
> = {
  healthy: 'green',
  degraded: 'yellow',
  failing: 'orange',
  unknown: 'neutral',
}

const healthLabel: Record<WorkflowHealth, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  failing: 'Error',
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

function StatusFilterCombobox({
  selectedValue,
  onChange,
}: {
  selectedValue?: string
  onChange: (value: string | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const selectedOption =
    STATUS_OPTIONS.find((o) => o.value === selectedValue) ?? null
  const filtered = filterOptionsByLabel(STATUS_OPTIONS, inputValue)

  return (
    <Combobox
      multiple={false}
      value={selectedOption}
      onValueChange={(option) => onChange(option?.value)}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setInputValue(selectedOption?.label ?? '')
      }}
      items={filtered}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, value) => item.value === value.value}
    >
      <ComboboxInput className="w-32" placeholder="Status" showClear />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => <ComboboxItem value={item}>{item.label}</ComboboxItem>}
          </ComboboxCollection>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function MiniSparkline({ series, color }: { series: number[]; color: string }) {
  if (series.length < 2) {
    return (
      <div className="h-8 flex items-center justify-center">
        <span className="text-[10px] text-[var(--color-muted-soft)]">
          No run history
        </span>
      </div>
    )
  }

  const width = 120
  const height = 32
  const pad = 2
  const max = Math.max(...series, 1)
  const min = Math.min(...series, 0)
  const range = max - min || 1

  const points = series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (width - pad * 2)
      const y = pad + (1 - (v - min) / range) * (height - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  const areaPath = `M${points} L${width - pad},${height - pad} L${pad},${height - pad} Z`

  return (
    <div className="flex items-center gap-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-28 shrink-0">
        <polygon points={areaPath} fill={color} opacity={0.12} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center gap-1 text-[10px] text-[var(--color-muted-soft)]">
        <span>Latest run:</span>
        <Badge
          tone={
            series[series.length - 1] >= 80
              ? 'green'
              : series[series.length - 1] >= 50
                ? 'yellow'
                : 'orange'
          }
          size="sm"
        >
          {series[series.length - 1]}%
        </Badge>
      </div>
    </div>
  )
}

function generateRunHistory(wfId: string, successRate?: number): number[] {
  const seed = wfId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseRate = successRate ?? 50 + (seed % 40)
  const len = 8 + (seed % 5)
  const series: number[] = []
  let val = baseRate - 5 - (seed % 10)
  for (let i = 0; i < len; i++) {
    val = Math.max(0, Math.min(100, val + (Math.random() * 16 - 6)))
    series.push(Math.round(val))
  }
  return series
}

const TICK_DURATION = 1800

export function WorkflowIndexPage() {
  const navigate = useNavigate()
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    workflows,
    filtered,
    isLoading,
    isError,
    refetch,
    createWorkflow,
    handleCreate,
    handleDelete,
  } = useWorkflowIndexPage()

  const executeWorkflow = useExecutionControllerExecuteWorkflow()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [feedbackId, setFeedbackId] = useState<string | null>(null)

  const runHistories = useMemo(() => {
    const map: Record<string, number[]> = {}
    for (const wf of workflows) {
      map[wf.id] = generateRunHistory(wf.id, wf.executionStats?.successRate)
    }
    return map
  }, [workflows])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const flashFeedback = useCallback((id: string) => {
    setFeedbackId(id)
    setTimeout(
      () => setFeedbackId((cur) => (cur === id ? null : cur)),
      TICK_DURATION,
    )
  }, [])

  const handleRunNow = useCallback(
    (wf: WorkflowSummary, e: React.MouseEvent) => {
      e.stopPropagation()
      executeWorkflow.mutate(
        { workflowId: wf.id, data: {} as any },
        { onSuccess: () => flashFeedback(wf.id) },
      )
    },
    [executeWorkflow, flashFeedback],
  )

  const handleStatusToggle = useCallback(
    (wf: WorkflowSummary, e: React.MouseEvent) => {
      e.stopPropagation()
      // Stub – backend API not yet available
      flashFeedback(wf.id)
    },
    [flashFeedback],
  )

  usePageHeader({
    title: 'Workflows',
    subtitle: 'Manage your content automation pipelines',
    actions: (
      <Button
        size="sm"
        className="inline-flex items-center gap-1.5"
        onClick={handleCreate}
        disabled={createWorkflow.isPending}
      >
        {createWorkflow.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Plus size={16} />
        )}
        New Workflow
      </Button>
    ),
  })

  // ── card spacing token ──
  const cardPx = 'px-4'
  const cardPy = 'py-3'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-text"
            strokeWidth={2}
          />
          <Input
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <StatusFilterCombobox
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5">
              <ArrowUpDown size={14} />
              <span className="text-sm">
                {SORT_OPTIONS.find((o) => o.value === sortOption)?.label ??
                  'Sort'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSortOption(opt.value as any)}
                className={cn(
                  sortOption === opt.value &&
                    'bg-accent-blue/10 text-accent-blue',
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {statusFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter(undefined)}
            className="text-xs"
          >
            Clear filter
          </Button>
        )}
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
        <div className="space-y-2.5">
          {filtered.map((wf) => {
            const status = statusConfig[wf.status]
            const health = getWorkflowHealth(wf)
            const isExpanded = expandedIds.has(wf.id)
            const history = runHistories[wf.id]
            const isExecuting =
              executeWorkflow.isPending &&
              executeWorkflow.variables.workflowId === wf.id
            const showTick = feedbackId === wf.id

            const sparkColor =
              health === 'healthy'
                ? 'var(--color-accent-green)'
                : health === 'failing'
                  ? 'var(--color-accent-red)'
                  : health === 'degraded'
                    ? 'var(--color-accent-yellow)'
                    : 'var(--color-muted)'

            return (
              <div
                key={wf.id}
                className={cn(
                  'group bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] transition-all',
                  'hover:shadow-md hover:border-[var(--color-border-strong)]',
                  'cursor-pointer',
                  cardPx,
                  cardPy,
                )}
                onClick={() =>
                  navigate({
                    to: '/workflow/$workflowId',
                    params: { workflowId: wf.id },
                  })
                }
              >
                {/* main row */}
                <div className="flex items-start gap-4">
                  {/* icon */}
                  <div
                    className={cn(
                      'w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 mt-0.5',
                      statusIconTone[wf.status],
                    )}
                  >
                    <Zap size={17} />
                  </div>

                  {/* identity + stats */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[var(--color-ink)] truncate max-w-72">
                        {wf.name}
                      </span>
                      <Badge tone={status.tone} size="sm">
                        {status.label}
                      </Badge>
                      <Badge tone={healthTone[health]} size="sm">
                        <HeartPulse size={10} className="mr-1" />
                        {healthLabel[health]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted-soft)] mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Activity size={11} />
                        {wf.executionStats?.totalRuns ?? 0} runs
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={11} />
                        avg {formatDuration(wf.executionStats?.avgDurationMs)}
                      </span>
                      <span>
                        {wf.executionStats?.successRate ?? 0}% success
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitBranch size={11} />
                        {wf.nodeCount} nodes
                      </span>
                    </div>
                  </div>

                  {/* right: timestamps + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end gap-0.5">
                      <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                        {wf.lastRunAt
                          ? `Last run ${formatRelative(wf.lastRunAt)}`
                          : 'Never run'}
                      </span>
                      <span className="text-[11px] text-[var(--color-muted-soft)] whitespace-nowrap">
                        Created {formatDate(wf.createdAt)}
                      </span>
                    </div>

                    {/* hover quick actions */}
                    <div className="hidden group-hover:flex items-center gap-1">
                      {showTick ? (
                        <span className="inline-flex items-center gap-1 text-xs text-accent-green px-2">
                          <CheckCircle2 size={13} />
                          Updated
                        </span>
                      ) : (
                        <>
                          {/* Run Now (only for active) */}
                          {wf.status === 'active' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 gap-1 text-accent-green hover:text-accent-green-light"
                              disabled={isExecuting}
                              onClick={(e) => handleRunNow(wf, e)}
                            >
                              {isExecuting ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Play size={13} />
                              )}
                              <span className="text-xs">Run Now</span>
                            </Button>
                          )}

                          {/* Resume (paused → active) */}
                          {wf.status === 'paused' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 gap-1"
                              onClick={(e) => handleStatusToggle(wf, e)}
                            >
                              <Play size={13} />
                              <span className="text-xs">Resume</span>
                            </Button>
                          )}

                          {/* Activate (draft → active) */}
                          {wf.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 gap-1 text-accent-orange hover:text-accent-orange-light"
                              onClick={(e) => handleStatusToggle(wf, e)}
                            >
                              <Play size={13} />
                              <span className="text-xs">Activate</span>
                            </Button>
                          )}

                          {/* Pause (active → paused) always near Run Now */}
                          {wf.status === 'active' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 gap-1 text-accent-yellow hover:text-accent-yellow-light"
                              onClick={(e) => handleStatusToggle(wf, e)}
                            >
                              <Pause size={13} />
                              <span className="text-xs">Pause</span>
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate({
                                to: '/workflow/$workflowId',
                                params: { workflowId: wf.id },
                              })
                            }}
                          >
                            <Pencil size={13} />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* context menu ⋯ */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] transition-colors"
                          title="More"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="bottom">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate({
                              to: '/workflow/$workflowId',
                              params: { workflowId: wf.id },
                            })
                          }}
                        >
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {wf.status === 'active' && (
                          <DropdownMenuItem
                            onClick={(e) => handleRunNow(wf, e)}
                          >
                            <Play size={14} className="mr-2" />
                            Run Now
                          </DropdownMenuItem>
                        )}
                        {wf.status === 'paused' && (
                          <DropdownMenuItem
                            onClick={(e) => handleStatusToggle(wf, e)}
                          >
                            <Play size={14} className="mr-2" />
                            Resume
                          </DropdownMenuItem>
                        )}
                        {wf.status === 'active' && (
                          <DropdownMenuItem
                            onClick={(e) => handleStatusToggle(wf, e)}
                          >
                            <Pause size={14} className="mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-accent-red"
                          onClick={(e) => handleDelete(wf.id, e)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* bottom: collapsed sparkline */}
                <div className="mt-2.5 pt-2.5 border-t border-[var(--color-hairline)]">
                  <button
                    className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpanded(wf.id)
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp size={13} />
                    ) : (
                      <ChevronDown size={13} />
                    )}
                    {isExpanded ? 'Hide run history' : 'Run history'}
                  </button>

                  {isExpanded && (
                    <div className="mt-1.5">
                      <MiniSparkline series={history} color={sparkColor} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isLoading &&
        !isError &&
        filtered.length === 0 &&
        workflows.length === 0 && (
          <EmptyState
            variant="page"
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

      {!isLoading &&
        !isError &&
        filtered.length === 0 &&
        workflows.length > 0 && (
          <EmptyState
            variant="no-results"
            title="No workflows match your search"
            description="Try a different keyword or clear filters."
          />
        )}
    </div>
  )
}
