import type { Node, Edge, ReactFlowInstance } from '@xyflow/react'

import type { WorkflowNodeData } from '../../types'
import type { NodeDefinition } from '../../stores/node-registry/use-node-registry.store'
import { mapDtoEdgeToCanvasEdge } from '../../utils/edge-mapping'

/**
 * Maps raw snapshot node records (from the API version snapshot) to ReactFlow nodes.
 */

export function mapSnapshotNodes(nodes: any[]): Node<WorkflowNodeData>[] {
  return nodes.map((n: any) => ({
    id: n.xyflow_id as string,
    type: (n.type as string | undefined) ?? 'workflow-node',
    position: { x: n.position_x as number, y: n.position_y as number },
    data: {
      title: (n.title as string | undefined) ?? '',
      subtitle: n.subtitle as string | undefined,
      icon: n.icon as string | undefined,
      nodeTypeId: n.node_type_id as string | undefined,
      status: (n.status as WorkflowNodeData['status'] | undefined) ?? 'pending',
      config: (n.config as Record<string, unknown> | undefined) ?? {},
    },
  }))
}

/**
 * Maps raw snapshot edge records (from the API version snapshot) to ReactFlow edges.
 */

export function mapSnapshotEdges(edges: any[]): Edge[] {
  return edges.map((e: any) => mapDtoEdgeToCanvasEdge(e))
}

/**
 * Resolves the canvas position for a newly added node.
 * Uses the ReactFlow instance to get the viewport center when available,
 * otherwise falls back to a staggered offset based on existing node count.
 */
export function resolveNodePosition(
  rfInstance: ReactFlowInstance<Node<WorkflowNodeData>, Edge> | null,
  nodeCount: number,
): { x: number; y: number } {
  if (rfInstance) {
    return rfInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
  }
  return { x: 300 + nodeCount * 20, y: 200 + nodeCount * 30 }
}

/**
 * Builds a new ReactFlow node from a node definition, position, and resolved default props.
 */
export function buildNewNodeFromDefinition(
  def: NodeDefinition,
  position: { x: number; y: number },
  defaultProps: Record<string, unknown>,
): Node<WorkflowNodeData> {
  return {
    id: `node-${Date.now()}`,
    type: 'workflow-node',
    position,
    data: {
      title: def.identity.title,
      subtitle: def.identity.description,
      icon: def.identity.icon,
      nodeTypeId: def.identity.typeId,
      status: 'pending',
      config: { ...defaultProps },
    },
  }
}
