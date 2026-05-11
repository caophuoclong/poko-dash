import type { Node, Edge } from '@xyflow/react'

export interface WorkflowNodeData extends Record<string, unknown> {
  title: string
  subtitle?: string
  icon?: string
  nodeTypeId?: string
  status?: 'active' | 'pending' | 'completed' | 'error' | 'paused'
  metrics?: { label: string; value: string }[]
  config?: Record<string, unknown>
  disabled?: boolean
  notes?: string
  continueOnFail?: boolean
  retryOnFail?: boolean
  retryCount?: number
  pinData?: unknown
  originalId?: string
}

export interface NodeMeta {
  disabled?: boolean
  notes?: string
  continueOnFail?: boolean
  retryOnFail?: boolean
  retryCount?: number
}

export interface NodeOutputResult {
  status: 'success' | 'error' | 'skipped'
  startedAt: string
  finishedAt: string
  durationMs: number
  inputData?: unknown
  outputData?: unknown
  error?: { message: string; stack?: string }
}

export interface NodeTypeDefinition {
  type: string
  label: string
  description: string
  icon: string
  category: 'trigger' | 'action' | 'condition' | 'output'
  defaultData: WorkflowNodeData
}

export interface WorkflowExecutionStats {
  totalRuns?: number
  successRate?: number
  avgDurationMs?: number
  lastStatus?: 'success' | 'error' | 'running'
  lastDurationMs?: number
}

export type WorkflowHealth = 'healthy' | 'degraded' | 'failing' | 'unknown'

export interface WorkflowSummary {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodeCount: number
  lastRunAt?: string
  createdAt: string
  updatedAt: string
  executionStats?: WorkflowExecutionStats
}

export interface WorkflowVariable {
  key: string
  value: string
  description?: string
}

export interface WorkflowDetail {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  variables?: WorkflowVariable[]
  createdAt: string
  updatedAt: string
}

export interface NodeExecutionData {
  nodeId: string
  title?: string
  status: string
  outputSummary?: Record<string, unknown>
  error?: string
  durationMs?: number
}

export interface ExecutionCacheData {
  id: string
  workflowId?: string
  status: string
  nodes?: NodeExecutionData[]
}
