import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../../../types'
import type { ExecutionMode } from './types'

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

export function topologicalSort(nodeIds: string[], edges: Edge[]): string[] {
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
    return topologicalSort(
      nodes.map((n) => n.id),
      edges,
    )
  }

  if (mode === 'to-node' && targetNodeId) {
    const upstream = getUpstreamNodeIds(targetNodeId, edges)
    return topologicalSort([...upstream, targetNodeId], edges)
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
