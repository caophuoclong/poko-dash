import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../../../types'
import type { ValidationBlock } from './types'
import { getNodeDefinition } from '../../node-registry/use-node-registry.store'

export function validateExecutionPath(
  executionPath: string[],
  nodes: Node<WorkflowNodeData>[],
): ValidationBlock[] {
  const blocks: ValidationBlock[] = []
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  for (const nodeId of executionPath) {
    const node = nodeMap.get(nodeId)
    if (!node) continue

    const data = node.data
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

    const config = data.config ?? {}
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

  const data = node.data
  const typeId = data.nodeTypeId
  if (!typeId) return { allowed: false, reason: 'Node type not configured' }

  const def = getNodeDefinition(typeId)
  if (!def) return { allowed: false, reason: 'Unknown node type' }

  const hasUpstream = edges.some((e) => e.target === nodeId)
  if (hasUpstream && def.io.inputs.length > 0) {
    return {
      allowed: false,
      reason:
        'This node depends on upstream data. Use "Run to Selected Node" instead.',
    }
  }

  return { allowed: true }
}
