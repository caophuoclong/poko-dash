import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  RotateCcw,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import { Button } from '#/components/ui/button'
import { useExecutionControllerListExecutions } from '#/api/client'
import type { NodeOutputResult } from '../types'

interface ExecutionsViewProps {
  workflowId: string
  onRerun?: (executionId: string) => void
  onSelectNode?: (nodeId: string, result: NodeOutputResult) => void
}

interface ExecutionSummary {
  id: string
  status: string
  startedAt: string
  completedAt: string
  durationMs: number
  nodeCount: number
  errorCount: number
}

export function ExecutionsView({
  workflowId,
  onRerun,
  onSelectNode,
}: ExecutionsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const pageSize = 20

  const { data, isLoading } = useExecutionControllerListExecutions(workflowId, {
    params: { page, limit: pageSize },
    query: {
      enabled: !!workflowId,
      select: (res: any) => {
        const rawData = res?.data ?? res
        const items = Array.isArray(rawData?.data)
          ? rawData.data
          : Array.isArray(rawData)
            ? rawData
            : []
        return items.map((e: any) => ({
          id: e.id,
          status: e.status,
          startedAt: e.started_at ?? e.startedAt,
          completedAt: e.completed_at ?? e.completedAt,
          durationMs: e.duration_ms ?? e.durationMs ?? 0,
          nodeCount: e.nodes?.length ?? e.node_count ?? 0,
          errorCount:
            e.nodes?.filter?.((n: any) => n.status === 'failed').length ?? 0,
          nodes: e.nodes ?? [],
        }))
      },
    },
  } as any)

  const executions: ExecutionSummary[] = data ?? []
  const selected = selectedId
    ? executions.find((e) => e.id === selectedId)
    : null

  return (
    <div className="flex h-full">
      {/* Left: execution list */}
      <div className="w-[280px] border-r border-frost flex flex-col shrink-0">
        <div className="px-3 py-2.5 border-b border-frost shrink-0">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-text">
            Execution History
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={16} className="animate-spin text-muted-text" />
            </div>
          )}
          {!isLoading && executions.length === 0 && (
            <div className="flex items-center justify-center h-32 text-[11px] text-muted-text">
              No executions yet
            </div>
          )}
          {executions.map((exec) => (
            <button
              key={exec.id}
              onClick={() => setSelectedId(exec.id)}
              className={cn(
                'w-full flex items-start gap-2.5 px-3 py-2.5 text-left border-b border-frost/50 transition-colors',
                selectedId === exec.id
                  ? 'bg-surface-2'
                  : 'hover:bg-surface-2/50',
              )}
            >
              {exec.status === 'completed' && (
                <CheckCircle2
                  size={14}
                  className="text-accent-green shrink-0 mt-0.5"
                />
              )}
              {exec.status === 'failed' && (
                <XCircle
                  size={14}
                  className="text-accent-red shrink-0 mt-0.5"
                />
              )}
              {(exec.status === 'running' || exec.status === 'pending') && (
                <Loader2
                  size={14}
                  className="text-accent-blue animate-spin shrink-0 mt-0.5"
                />
              )}
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-near-white truncate">
                  {exec.id.slice(0, 8)}
                </div>
                <div className="text-[10px] text-muted-text">
                  {exec.startedAt
                    ? new Date(exec.startedAt).toLocaleString()
                    : '—'}
                </div>
                <div className="text-[10px] text-muted-text/60">
                  {exec.nodeCount} nodes ·{' '}
                  {exec.durationMs
                    ? `${(exec.durationMs / 1000).toFixed(1)}s`
                    : '—'}
                </div>
              </div>
            </button>
          ))}
          {executions.length >= pageSize && (
            <div className="flex items-center justify-center gap-2 py-2">
              <Button
                size="xs"
                variant="ghost"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <span className="text-[10px] text-muted-text">
                Page {page + 1}
              </span>
              <Button
                size="xs"
                variant="ghost"
                disabled={executions.length < pageSize}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right: execution detail */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <ExecutionDetail
            execution={selected}
            onRerun={onRerun}
            onSelectNode={onSelectNode}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[11px] text-muted-text">
            Select an execution to view details
          </div>
        )}
      </div>
    </div>
  )
}

function ExecutionDetail({
  execution,
  onRerun,
  onSelectNode,
}: {
  execution: ExecutionSummary & { nodes: any[] }
  onRerun?: (executionId: string) => void
  onSelectNode?: (nodeId: string, result: NodeOutputResult) => void
}) {
  const [expandedNode, setExpandedNode] = useState<string | null>(null)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        {execution.status === 'completed' && (
          <span className="flex items-center gap-1.5 text-accent-green text-[12px] font-medium">
            <CheckCircle2 size={14} />
            Success
          </span>
        )}
        {execution.status === 'failed' && (
          <span className="flex items-center gap-1.5 text-accent-red text-[12px] font-medium">
            <XCircle size={14} />
            Error
          </span>
        )}
        {(execution.status === 'running' || execution.status === 'pending') && (
          <span className="flex items-center gap-1.5 text-accent-blue text-[12px] font-medium">
            <Loader2 size={14} className="animate-spin" />
            Running
          </span>
        )}
        {execution.durationMs > 0 && (
          <span className="text-[11px] text-muted-text">
            · {(execution.durationMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      <div className="text-[11px] space-y-1">
        <div className="flex gap-2">
          <span className="text-muted-text shrink-0">Started</span>
          <span className="text-near-white">
            {execution.startedAt
              ? new Date(execution.startedAt).toLocaleString()
              : '—'}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-text shrink-0">Finished</span>
          <span className="text-near-white">
            {execution.completedAt
              ? new Date(execution.completedAt).toLocaleString()
              : '—'}
          </span>
        </div>
      </div>

      <div className="border-t border-frost" />

      <div className="space-y-1">
        {execution.nodes.map((node: any) => {
          const nodeId = node.nodeId ?? node.node_id ?? ''
          const title = node.nodeTitle ?? node.node_title ?? nodeId
          const status = node.status ?? ''
          const durationMs = node.durationMs ?? node.duration_ms ?? 0
          const isExpanded = expandedNode === nodeId
          const outputSummary = node.outputSummary ?? node.output_summary
          const error = node.error

          return (
            <div
              key={nodeId}
              className="border border-frost rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedNode(isExpanded ? null : nodeId)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-2/50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={12} className="text-muted-text shrink-0" />
                ) : (
                  <ChevronRight
                    size={12}
                    className="text-muted-text shrink-0"
                  />
                )}
                <span className="font-mono text-[10px] text-muted-text shrink-0">
                  {title}
                </span>
                <span className="ml-auto flex items-center gap-2">
                  {status === 'completed' && (
                    <CheckCircle2 size={12} className="text-accent-green" />
                  )}
                  {status === 'failed' && (
                    <XCircle size={12} className="text-accent-red" />
                  )}
                  {status === 'running' && (
                    <Loader2
                      size={12}
                      className="text-accent-blue animate-spin"
                    />
                  )}
                  {durationMs > 0 && (
                    <span className="text-[10px] text-muted-text">
                      {durationMs}ms
                    </span>
                  )}
                </span>
              </button>
              {isExpanded && (
                <div className="px-3 py-2 border-t border-frost bg-void/50 space-y-2">
                  {outputSummary && (
                    <pre className="text-[10px] font-mono text-near-white overflow-auto max-h-[200px]">
                      {typeof outputSummary === 'string'
                        ? outputSummary
                        : JSON.stringify(outputSummary, null, 2)}
                    </pre>
                  )}
                  {error && (
                    <p className="text-[11px] text-accent-red">{error}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 pt-2">
        {onRerun && (
          <Button
            size="xs"
            color="blue-dim"
            onClick={() => onRerun(execution.id)}
          >
            <RotateCcw size={11} />
            Re-run
          </Button>
        )}
      </div>
    </div>
  )
}
