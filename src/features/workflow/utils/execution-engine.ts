import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import type { ValidationError } from '../node-types'
import { getNodeDefinition } from '../node-registry'

export type ExecutionMode = 'full' | 'to-node' | 'single-node'

export type NodeExecutionStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'success'
  | 'error'
  | 'skipped'
  | 'out-of-scope'

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

export function findRootNodes(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): Node<WorkflowNodeData>[] {
  const targetIds = new Set(edges.map((e) => e.target))
  return nodes.filter((n) => !targetIds.has(n.id))
}

export function getUpstreamNodeIds(
  targetNodeId: string,
  edges: Edge[],
): string[] {
  const upstream = new Set<string>()
  const queue = [targetNodeId]

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const edge of edges) {
      if (edge.target === current && !upstream.has(edge.source)) {
        upstream.add(edge.source)
        queue.push(edge.source)
      }
    }
  }

  return Array.from(upstream)
}

export function topologicalSort(
  nodeIds: string[],
  edges: Edge[],
): string[] {
  const idSet = new Set(nodeIds)
  const relevantEdges = edges.filter(
    (e) => idSet.has(e.source) && idSet.has(e.target),
  )

  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const id of nodeIds) {
    inDegree.set(id, 0)
    adjacency.set(id, [])
  }

  for (const edge of relevantEdges) {
    adjacency.get(edge.source)!.push(edge.target)
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
  }

  const queue: string[] = []
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }

  const sorted: string[] = []
  while (queue.length > 0) {
    const current = queue.shift()!
    sorted.push(current)
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1
      inDegree.set(neighbor, newDeg)
      if (newDeg === 0) queue.push(neighbor)
    }
  }

  return sorted
}

export function computeExecutionPath(
  mode: ExecutionMode,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  targetNodeId?: string | null,
): string[] {
  if (mode === 'full') {
    const allIds = nodes.map((n) => n.id)
    return topologicalSort(allIds, edges)
  }

  if (mode === 'to-node' && targetNodeId) {
    const upstream = getUpstreamNodeIds(targetNodeId, edges)
    const subgraphIds = [...upstream, targetNodeId]
    return topologicalSort(subgraphIds, edges)
  }

  if (mode === 'single-node' && targetNodeId) {
    return [targetNodeId]
  }

  return []
}

export function getEdgesForPath(
  executionPath: string[],
  edges: Edge[],
): string[] {
  const pathSet = new Set(executionPath)
  return edges
    .filter((e) => pathSet.has(e.source) && pathSet.has(e.target))
    .map((e) => e.id)
}

export function validateExecutionPath(
  executionPath: string[],
  nodes: Node<WorkflowNodeData>[],
): ValidationBlock[] {
  const blocks: ValidationBlock[] = []
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  for (const nodeId of executionPath) {
    const node = nodeMap.get(nodeId)
    if (!node) continue

    const data = node.data as WorkflowNodeData
    const typeId = data.nodeTypeId
    if (!typeId) {
      blocks.push({
        nodeId,
        nodeTitle: data.title || nodeId,
        errors: [
          {
            propertyKey: 'nodeTypeId',
            message: 'Node type is not configured',
            severity: 'error' as const,
          },
        ],
      })
      continue
    }

    const def = getNodeDefinition(typeId)
    if (!def) {
      blocks.push({
        nodeId,
        nodeTitle: data.title || nodeId,
        errors: [
          {
            propertyKey: 'typeId',
            message: `Unknown node type: ${typeId}`,
            severity: 'error' as const,
          },
        ],
      })
      continue
    }

    const config = (data.config ?? {}) as Record<string, unknown>
    const errors = def.validate(config)
    const blockingErrors = errors.filter((e) => e.severity === 'error')
    if (blockingErrors.length > 0) {
      blocks.push({
        nodeId,
        nodeTitle: data.title || nodeId,
        errors: blockingErrors,
      })
    }
  }

  return blocks
}

export function canExecuteSingleNode(
  nodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): { allowed: boolean; reason?: string } {
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return { allowed: false, reason: 'Node not found' }

  const data = node.data as WorkflowNodeData
  const typeId = data.nodeTypeId
  if (!typeId) return { allowed: false, reason: 'Node type not configured' }

  const def = getNodeDefinition(typeId)
  if (!def) return { allowed: false, reason: 'Unknown node type' }

  const hasUpstream = edges.some((e) => e.target === nodeId)
  if (hasUpstream && def.inputs.length > 0) {
    return {
      allowed: false,
      reason:
        'This node depends on upstream data. Use "Run to Selected Node" instead.',
    }
  }

  return { allowed: true }
}
