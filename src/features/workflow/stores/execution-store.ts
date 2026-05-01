import { create } from 'zustand'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import {
  type ExecutionMode,
  type ExecutionState,
  type ExecutionLog,
  type NodeExecutionStatus,
  type ValidationBlock,
  createInitialExecutionState,
  computeExecutionPath,
  getEdgesForPath,
  validateExecutionPath,
  canExecuteSingleNode,
} from '../utils/execution-engine'
import { getNodeDefinition } from '../node-registry'

interface ExecutionStore extends ExecutionState {
  startExecution: (
    mode: ExecutionMode,
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[],
    targetNodeId?: string | null,
  ) => ValidationBlock[] | null

  advanceToNode: (nodeId: string) => void
  completeNode: (nodeId: string, error?: string) => void
  stopExecution: () => void
  resetExecution: () => void
  addLog: (log: Omit<ExecutionLog, 'timestamp'>) => void
  getNodeStatus: (nodeId: string) => NodeExecutionStatus
  getEdgeActive: (edgeId: string) => boolean
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  ...createInitialExecutionState(),

  startExecution: (mode, nodes, edges, targetNodeId = null) => {
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
        ...createInitialExecutionState(),
        mode,
        targetNodeId,
        validationResult: validationBlocks,
      })
      return validationBlocks
    }

    const activeEdgeIds = getEdgesForPath(executionPath, edges)
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))

    const nodeStates: ExecutionState['nodeStates'] = {}
    const edgeStates: ExecutionState['edgeStates'] = {}

    for (const node of nodes) {
      const inPath = executionPath.includes(node.id)
      nodeStates[node.id] = {
        nodeId: node.id,
        status: inPath ? 'pending' : 'out-of-scope',
      }
    }

    for (const edge of edges) {
      const isActive = activeEdgeIds.includes(edge.id)
      edgeStates[edge.id] = {
        edgeId: edge.id,
        active: isActive,
        status: isActive ? 'idle' : 'idle',
      }
    }

    const firstNodeId = executionPath[0]
    const firstNode = nodeMap.get(firstNodeId)
    const firstDef = firstNode?.data?.nodeTypeId
      ? getNodeDefinition(firstNode.data.nodeTypeId as string)
      : null

    set({
      mode,
      running: true,
      currentNodeId: firstNodeId,
      nodeStates,
      edgeStates,
      logs: [
        {
          timestamp: Date.now(),
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
      startedAt: Date.now(),
      completedAt: null,
      targetNodeId,
      executionPath,
      validationResult: null,
    })

    return null
  },

  advanceToNode: (nodeId) => {
    set((state) => ({
      currentNodeId: nodeId,
      nodeStates: {
        ...state.nodeStates,
        [nodeId]: {
          ...state.nodeStates[nodeId],
          nodeId,
          status: 'running',
          startedAt: Date.now(),
        },
      },
    }))
  },

  completeNode: (nodeId, error) => {
    const state = get()
    const now = Date.now()
    const prevNodeState = state.nodeStates[nodeId]
    const duration = prevNodeState?.startedAt
      ? now - prevNodeState.startedAt
      : undefined

    const newLogs = [...state.logs]
    if (error) {
      newLogs.push({
        timestamp: now,
        nodeId,
        nodeTitle: '',
        level: 'error',
        message: error,
        duration,
      })
    } else {
      newLogs.push({
        timestamp: now,
        nodeId,
        nodeTitle: '',
        level: 'success',
        message: 'Completed',
        duration,
      })
    }

    const newEdgeStates = { ...state.edgeStates }
    for (const [eid, es] of Object.entries(newEdgeStates)) {
      if (es.active) {
        const isEdgeFromCurrent = Object.entries(es).length >= 0
        void isEdgeFromCurrent
      }
      if (es.active) {
        newEdgeStates[eid] = {
          ...es,
          status: error ? 'error' : 'completed',
        }
      }
    }

    const isLast =
      state.executionPath[state.executionPath.length - 1] === nodeId

    if (isLast || error) {
      set({
        running: false,
        currentNodeId: null,
        completedAt: now,
        nodeStates: {
          ...state.nodeStates,
          [nodeId]: {
            ...state.nodeStates[nodeId],
            status: error ? 'error' : 'success',
            error,
            completedAt: now,
            duration,
          },
        },
        edgeStates: newEdgeStates,
        logs: [
          ...newLogs,
          {
            timestamp: now,
            nodeId: '',
            nodeTitle: '',
            level: error ? 'error' : 'info',
            message: error
              ? 'Execution stopped due to error'
              : 'Execution completed',
          },
        ],
      })
    } else {
      const currentIndex = state.executionPath.indexOf(nodeId)
      const nextNodeId = state.executionPath[currentIndex + 1] ?? null

      set({
        currentNodeId: nextNodeId,
        nodeStates: {
          ...state.nodeStates,
          [nodeId]: {
            ...state.nodeStates[nodeId],
            status: error ? 'error' : 'success',
            error,
            completedAt: now,
            duration,
          },
        },
        edgeStates: newEdgeStates,
        logs: newLogs,
      })
    }
  },

  stopExecution: () => {
    const state = get()
    const now = Date.now()
    const currentNode = state.currentNodeId

    set({
      running: false,
      completedAt: now,
      currentNodeId: null,
      nodeStates: Object.fromEntries(
        Object.entries(state.nodeStates).map(([id, ns]) => [
          id,
          {
            ...ns,
            status:
              ns.status === 'running'
                ? 'error'
                : ns.status === 'pending'
                  ? 'skipped'
                  : ns.status,
          },
        ]),
      ),
      logs: [
        ...state.logs,
        {
          timestamp: now,
          nodeId: currentNode ?? '',
          nodeTitle: '',
          level: 'warn',
          message: 'Execution stopped by user',
        },
      ],
    })
  },

  resetExecution: () => {
    set(createInitialExecutionState())
  },

  addLog: (log) => {
    set((state) => ({
      logs: [...state.logs, { ...log, timestamp: Date.now() }],
    }))
  },

  getNodeStatus: (nodeId) => {
    return get().nodeStates[nodeId]?.status ?? 'idle'
  },

  getEdgeActive: (edgeId) => {
    return get().edgeStates[edgeId]?.active ?? false
  },
}))
