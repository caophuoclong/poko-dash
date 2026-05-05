import type { ValidationError } from '../../node-registry/use-node-registry.store'

export type ExecutionMode = 'full' | 'to-node' | 'single-node'

export type NodeExecutionStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'

export interface ExecutionNodeState {
  nodeId: string
  status: NodeExecutionStatus
  duration?: number
  error?: string
  startedAt?: number
  completedAt?: number
}

export interface ExecutionEdgeState {
  edgeId: string
  active: boolean
  status: 'idle' | 'active' | 'completed' | 'error'
}

export interface ValidationBlock {
  nodeId: string
  nodeTitle: string
  errors: ValidationError[]
}

export interface ExecutionLog {
  timestamp: number
  nodeId: string
  nodeTitle: string
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  duration?: number
}

export interface ExecutionState {
  mode: ExecutionMode
  running: boolean
  currentNodeId: string | null
  nodeStates: Record<string, ExecutionNodeState>
  edgeStates: Record<string, ExecutionEdgeState>
  logs: ExecutionLog[]
  startedAt: number | null
  completedAt: number | null
  targetNodeId: string | null
  executionPath: string[]
  validationResult: ValidationBlock[] | null
}

export function createInitialExecutionState(): ExecutionState {
  return {
    mode: 'full',
    running: false,
    currentNodeId: null,
    nodeStates: {},
    edgeStates: {},
    logs: [],
    startedAt: null,
    completedAt: null,
    targetNodeId: null,
    executionPath: [],
    validationResult: null,
  }
}
