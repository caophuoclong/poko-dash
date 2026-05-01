import { useMemo, useRef, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
} from 'lucide-react'
import { cn } from '#/shared/utils'
import { useExecutionStore } from '../stores/execution-store'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import type { ExecutionLog } from '../utils/execution-engine'

interface ExecutionDrawerProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  open: boolean
  onClose: () => void
}

const LOG_ICONS = {
  info: Info,
  warn: AlertTriangle,
  error: XCircle,
  success: CheckCircle2,
}

const LOG_COLORS = {
  info: 'text-accent-blue',
  warn: 'text-accent-yellow',
  error: 'text-accent-red',
  success: 'text-accent-green',
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function ExecutionDrawer({
  nodes,
  open,
  onClose,
}: ExecutionDrawerProps) {
  const logs = useExecutionStore((s) => s.logs)
  const running = useExecutionStore((s) => s.running)
  const startedAt = useExecutionStore((s) => s.startedAt)
  const completedAt = useExecutionStore((s) => s.completedAt)
  const executionPath = useExecutionStore((s) => s.executionPath)
  const nodeStates = useExecutionStore((s) => s.nodeStates)
  const scrollRef = useRef<HTMLDivElement>(null)

  const nodeMap = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  )

  const enrichedLogs = useMemo(() => {
    return logs.map((log) => ({
      ...log,
      nodeTitle:
        log.nodeTitle || nodeMap.get(log.nodeId)?.data.title || log.nodeId,
    }))
  }, [logs, nodeMap])

  const totalDuration = useMemo(() => {
    if (!startedAt) return null
    const end = completedAt ?? Date.now()
    return end - startedAt
  }, [startedAt, completedAt])

  const progressStats = useMemo(() => {
    const states = Object.values(nodeStates)
    return {
      total: executionPath.length,
      success: states.filter((s) => s.status === 'success').length,
      error: states.filter((s) => s.status === 'error').length,
      running: states.filter((s) => s.status === 'running').length,
      pending: states.filter((s) => s.status === 'pending').length,
    }
  }, [nodeStates, executionPath])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [enrichedLogs.length])

  if (!open) return null

  return (
    <div
      className={cn(
        'absolute bottom-16 left-0 right-0 z-20',
        'bg-surface border-t border-frost',
        'transition-all duration-200',
        'flex flex-col',
      )}
      style={{ height: '280px' }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-frost shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-semibold text-near-white">
            Execution Console
          </h3>

          {running && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
              <span className="text-[10px] text-accent-blue">Running</span>
            </div>
          )}

          {!running && completedAt && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-accent-green">Completed</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {progressStats.total > 0 && (
            <div className="flex items-center gap-2 text-[10px] text-muted-text">
              <span className="text-accent-green">
                {progressStats.success} done
              </span>
              {progressStats.error > 0 && (
                <span className="text-accent-red">
                  {progressStats.error} failed
                </span>
              )}
              {progressStats.running > 0 && (
                <span className="text-accent-blue">
                  {progressStats.running} running
                </span>
              )}
              {progressStats.pending > 0 && (
                <span>{progressStats.pending} pending</span>
              )}
            </div>
          )}

          {totalDuration !== null && (
            <span className="text-[10px] text-muted-text tabular-nums">
              {formatDuration(totalDuration)}
            </span>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5"
      >
        {enrichedLogs.length === 0 && (
          <div className="flex items-center justify-center h-full text-xs text-muted-text">
            No execution logs yet. Click Run to start.
          </div>
        )}
        {enrichedLogs.map((log: ExecutionLog & { nodeTitle: string }, i) => {
          const Icon = LOG_ICONS[log.level]
          return (
            <div
              key={i}
              className="flex items-start gap-2 py-1 text-[11px] font-mono"
            >
              <span className="text-muted-text tabular-nums shrink-0 w-16">
                {formatTimestamp(log.timestamp)}
              </span>
              <Icon
                size={12}
                className={cn('shrink-0 mt-0.5', LOG_COLORS[log.level])}
              />
              {log.nodeId && (
                <span className="text-near-white font-medium shrink-0 max-w-[140px] truncate">
                  {log.nodeTitle}
                </span>
              )}
              <span className="text-muted-text flex-1">{log.message}</span>
              {log.duration != null && (
                <span className="text-muted-text tabular-nums shrink-0">
                  {formatDuration(log.duration)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
