import { Link } from '@tanstack/react-router'
import {
  GitBranch,
  Plus,
  Search,
  Play,
  Pause,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'
import { mockWorkflows } from '../data/mock-workflows'
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

function formatRelative(dateString?: string): string {
  if (!dateString) return 'Never'
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function WorkflowIndexPage() {
  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-near-white">Workflows</h1>
          <p className="text-sm text-muted-text mt-1">
            Manage your content automation pipelines
          </p>
        </div>
        <Button size="sm">
          <Plus size={15} />
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
          className="w-full h-9 pl-9 pr-4 rounded-lg border border-frost bg-surface text-sm text-near-white placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 transition-colors"
        />
      </div>

      <div className="space-y-2">
        {mockWorkflows.map((wf) => {
          const status = statusConfig[wf.status]
          return (
            <Link
              key={wf.id}
              to="/workflow/$workflowId"
              params={{ workflowId: wf.id }}
              className={cn(
                'block bg-surface border border-frost rounded-xl px-5 py-4 transition-colors',
                'hover:border-frost-hover hover:bg-surface-2',
                'no-underline',
              )}
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
                    onClick={(e) => e.preventDefault()}
                  >
                    {wf.status === 'active' ? (
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-md text-muted-text hover:text-accent-yellow hover:bg-accent-yellow/10 transition-colors"
                        title="Pause"
                      >
                        <Pause size={15} />
                      </button>
                    ) : wf.status === 'paused' ? (
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-md text-muted-text hover:text-accent-green hover:bg-accent-green-dim transition-colors"
                        title="Resume"
                      >
                        <Play size={15} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {mockWorkflows.length === 0 && (
        <div className="bg-surface border border-frost rounded-xl p-12 text-center">
          <GitBranch size={32} className="mx-auto text-muted-text mb-3" />
          <p className="text-sm text-muted-text">No workflows yet</p>
          <Button size="sm" className="mt-4">
            <Plus size={15} />
            Create your first workflow
          </Button>
        </div>
      )}
    </div>
  )
}
