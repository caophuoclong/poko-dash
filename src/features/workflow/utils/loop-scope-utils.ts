import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'

/**
 * Result of loop scope detection: whether the node is inside a loop body,
 * and which loop node owns the scope.
 */
export interface LoopScopeResult {
  inLoopScope: boolean
  loopNodeId?: string
  loopNodeName?: string
}

/**
 * Determine whether `nodeId` is inside the body scope of a loop node.
 *
 * A node is "in loop scope" when it is reachable from a loop node's `loop`
 * output port (NOT the `done` port), following edges forward.
 *
 * Traversal: walk backward from nodeId through incoming edges. If any edge
 * originates from a loop node's `loop`-like sourceHandle, the node is in scope.
 * For intermediate nodes, if they're reachable from a loop node via the loop
 * port, they propagate scope to all their descendants.
 */
export function findLoopScope(
  nodeId: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): LoopScopeResult {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  // Walk backward from nodeId until we find a loop node or run out of edges
  const visited = new Set<string>()
  const queue = [nodeId]
  visited.add(nodeId)

  while (queue.length > 0) {
    const current = queue.shift()!
    const incoming = edges.filter((e) => e.target === current)

    for (const edge of incoming) {
      const sourceNode = nodeMap.get(edge.source)
      if (!sourceNode) continue

      const sourceData = sourceNode.data
      const sourceTypeId = sourceData.nodeTypeId

      // Check if source is a loop node
      if (isLoopNode(sourceTypeId)) {
        // Only count as in scope if edge originates from the `loop` port
        if (isLoopPort(edge.sourceHandle ?? undefined)) {
          return {
            inLoopScope: true,
            loopNodeId: sourceNode.id,
            loopNodeName: sanitizeTitle(sourceData.title || sourceNode.id),
          }
        }
        // Edge from `done` port — not in loop scope
        continue
      }

      // Normal node — continue traversing upward
      if (!visited.has(edge.source)) {
        visited.add(edge.source)
        queue.push(edge.source)
      }
    }
  }

  return { inLoopScope: false }
}

/**
 * Detect loop node by typeId pattern.
 * Matches: logic.loop.foreach, logic.loop, loop.*, etc.
 */
function isLoopNode(typeId?: string): boolean {
  if (!typeId) return false
  return (
    typeId.startsWith('logic.loop') ||
    typeId === 'loop' ||
    typeId.startsWith('loop.')
  )
}

/**
 * Check if a sourceHandle (port ID) is the loop body port.
 * Matches port IDs like "loop", "loop_body", "loop-items".
 */
function isLoopPort(sourceHandle?: string): boolean {
  if (!sourceHandle) {
    // Legacy canvases often don't persist source handles; default to loop branch.
    return true
  }
  // Explicitly exclude done/completed ports
  if (sourceHandle === 'done' || sourceHandle === 'completed') return false
  return sourceHandle === 'loop' || sourceHandle.startsWith('loop')
}

function sanitizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}
