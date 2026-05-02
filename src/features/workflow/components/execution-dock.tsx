import { useMemo } from 'react'
import {
  Play,
  Square,
  ChevronUp,
  Route,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/shared/utils'
import { useWorkflowsControllerRun } from '#/api/client'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import { useExecutionStore } from '../stores/execution-store'
import { canExecuteSingleNode } from '../utils/execution-engine'
import type { ExecutionMode } from '../utils/execution-engine'

interface ExecutionDockProps {
  selectedNodeId: string | null
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onToggleDrawer: () => void
  drawerOpen: boolean
  workflowId: string
  onStartSSE: () => void
}

export function ExecutionDock({
  selectedNodeId,
  nodes,
  edges,
  onToggleDrawer,
  drawerOpen,
  workflowId,
  onStartSSE,
}: ExecutionDockProps) {
  const running = useExecutionStore((s) => s.running)
  const executionPath = useExecutionStore((s) => s.executionPath)
  const executionId = useExecutionStore((s) => s.executionId)
  const currentNodeId = useExecutionStore((s) => s.currentNodeId)
  const validationResult = useExecutionStore((s) => s.validationResult)
  const validateAndStart = useExecutionStore((s) => s.validateAndStart)
  const resetExecution = useExecutionStore((s) => s.resetExecution)
  const failExecution = useExecutionStore((s) => s.failExecution)

  const runMutation = useWorkflowsControllerRun()

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  const selectedNodeTitle = selectedNode?.data.title ?? 'Selected Node'

  const singleNodeCheck = useMemo(() => {
    if (!selectedNodeId) return { allowed: false, reason: 'No node selected' }
    return canExecuteSingleNode(selectedNodeId, nodes, edges)
  }, [selectedNodeId, nodes, edges])

  const progressInfo = useMemo(() => {
    if (!running || executionPath.length === 0) return null
    const currentIdx = currentNodeId ? executionPath.indexOf(currentNodeId) : -1
    const completedCount = Math.max(0, currentIdx)
    const total = executionPath.length
    return { completedCount, total }
  }, [running, executionPath, currentNodeId])

  const hasValidationErrors = validationResult && validationResult.length > 0

  const handleStart = (mode: ExecutionMode) => {
    const validationErrors = validateAndStart(
      mode,
      nodes,
      edges,
      mode !== 'full' ? selectedNodeId : null,
    )

    if (validationErrors && validationErrors.length > 0) {
      return
    }

    onStartSSE()

    runMutation.mutate(
      { id: workflowId },
      {
        onError: (error) => {
          failExecution(
            error instanceof Error
              ? error.message
              : 'Failed to start execution',
          )
        },
      },
    )
  }

  const handleStop = () => {
    resetExecution()
  }

  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 z-30',
        'flex items-center gap-2',
        'bg-surface/95 backdrop-blur-sm border border-frost rounded-xl px-3 py-2 shadow-lg',
        'transition-all duration-200',
      )}
    >
      {running ? (
        <>
          <div className="flex items-center gap-2 mr-2">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border-2 border-accent-blue/30" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-blue animate-spin" />
            </div>
            {progressInfo && (
              <span className="text-[11px] text-muted-text tabular-nums">
                {progressInfo.completedCount}/{progressInfo.total}
              </span>
            )}
            {executionId && (
              <span className="text-[10px] text-muted-text truncate max-w-[100px]">
                {executionId.slice(0, 8)}
              </span>
            )}
          </div>

          <Button
            size="xs"
            color="red"
            onClick={handleStop}
            disabled={runMutation.isPending}
          >
            <Square size={12} />
            Stop
          </Button>
        </>
      ) : (
        <>
          <Button
            size="xs"
            color="blue"
            onClick={() => handleStart('full')}
            disabled={runMutation.isPending}
          >
            <Play size={12} />
            Run Workflow
          </Button>

          {selectedNodeId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="xs" variant="ghost" className="text-muted-text">
                  <ChevronUp size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="top"
                className="min-w-[220px]"
              >
                <DropdownMenuItem onClick={() => handleStart('to-node')}>
                  <Route size={14} />
                  <span className="flex-1">
                    Run to &ldquo;{selectedNodeTitle}&rdquo;
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => handleStart('single-node')}
                      disabled={!singleNodeCheck.allowed}
                    >
                      <Play size={14} />
                      <span className="flex-1">Execute Node Only</span>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  {!singleNodeCheck.allowed && (
                    <TooltipContent side="left" className="max-w-[200px]">
                      {singleNodeCheck.reason}
                    </TooltipContent>
                  )}
                </Tooltip>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {hasValidationErrors && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-red/10 text-accent-red">
                  <AlertTriangle size={12} />
                  <span className="text-[11px] font-medium">
                    {validationResult.length} issue(s)
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[280px]">
                <div className="space-y-1">
                  {validationResult.map((block) => (
                    <div key={block.nodeId}>
                      <div className="font-semibold">{block.nodeTitle}</div>
                      {block.errors.map((e, i) => (
                        <div key={i} className="text-[11px] opacity-80">
                          {e.message}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          <div className="w-px h-5 bg-frost mx-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleDrawer}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors',
                  drawerOpen
                    ? 'text-accent-blue bg-accent-blue-dim'
                    : 'text-muted-text hover:text-near-white hover:bg-surface-2',
                )}
              >
                <CheckCircle2 size={12} />
                Console
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {drawerOpen ? 'Hide Console' : 'Show Console'}
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}
