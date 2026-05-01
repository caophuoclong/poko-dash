import { create } from 'zustand'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import {
  type ExecutionMode,
  type ExecutionLog,
  type ValidationBlock,
  createInitialExecutionState,
  computeExecutionPath,
  validateExecutionPath,
  canExecuteSingleNode,
} from '../utils/execution-engine'
import { getNodeDefinition } from '../node-registry'

interface ExecutionStore {
  executionId: string | null
  mode: ExecutionMode
  running: boolean
  currentNodeId: string | null
  logs: ExecutionLog[]
  startedAt: number | null
  completedAt: number | null
  targetNodeId: string | null
  executionPath: string[]
  validationResult: ValidationBlock[] | null

  validateAndStart: (
    mode: ExecutionMode,
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[],
    targetNodeId?: string | null,
  ) => ValidationBlock[] | null

  setExecutionId: (id: string | null) => void
  setRunning: (running: boolean) => void
  addLog: (log: Omit<ExecutionLog, 'timestamp'>) => void
  completeExecution: () => void
  failExecution: (error: string) => void
  resetExecution: () => void
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  ...createInitialExecutionState(),
  executionId: null,

  validateAndStart: (mode, nodes, edges, targetNodeId = null) => {
    if (mode === 'single-node' && targetNodeId) {
      const check = canExecuteSingleNode(targetNodeId, nodes, edges)
      if (!check.allowed) return null
    }

    const executionPath = computeExecutionPath(mode, nodes, edges, targetNodeId)
    if (executionPath.length === 0) return null

    const validationBlocks = validateExecutionPath(executionPath, nodes)
    const hasErrors = validationBlocks.some((b) =>
      b.errors.some((e) => e.severity === 'error'),
    )
    if (hasErrors) {
      set({
        mode,
        targetNodeId,
        validationResult: validationBlocks,
      })
      return validationBlocks
    }

    const firstNodeId = executionPath[0]
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    const firstNode = nodeMap.get(firstNodeId)
    const firstDef = firstNode?.data?.nodeTypeId
      ? getNodeDefinition(firstNode.data.nodeTypeId as string)
      : null

    const now = Date.now()

    set({
      mode,
      running: true,
      currentNodeId: firstNodeId,
      startedAt: now,
      completedAt: null,
      targetNodeId,
      executionPath,
      validationResult: null,
      logs: [
        {
          timestamp: now,
          nodeId: '',
          nodeTitle: '',
          level: 'info',
          message:
            mode === 'full'
              ? 'Starting full workflow execution'
              : mode === 'to-node'
                ? `Running to "${firstDef?.title ?? firstNode?.data?.title ?? targetNodeId}"`
                : `Executing single node`,
        },
      ],
    })

    return null
  },

  setExecutionId: (id) => {
    set({ executionId: id })
  },

  setRunning: (running) => {
    set({ running })
  },

  addLog: (log) => {
    set((state) => ({
      logs: [...state.logs, { ...log, timestamp: Date.now() }],
    }))
  },

  completeExecution: () => {
    const now = Date.now()
    set((state) => ({
      running: false,
      completedAt: now,
      currentNodeId: null,
      logs: [
        ...state.logs,
        {
          timestamp: now,
          nodeId: '',
          nodeTitle: '',
          level: 'success',
          message: 'Execution completed',
        },
      ],
    }))
  },

  failExecution: (error) => {
    const now = Date.now()
    set((state) => ({
      running: false,
      completedAt: now,
      currentNodeId: null,
      logs: [
        ...state.logs,
        {
          timestamp: now,
          nodeId: '',
          nodeTitle: '',
          level: 'error',
          message: error,
        },
      ],
    }))
  },

  resetExecution: () => {
    set({
      ...createInitialExecutionState(),
      executionId: null,
    })
  },
}))
