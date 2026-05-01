import { useRef, useCallback } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import { useExecutionStore } from './execution-store'
import { getNodeDefinition } from '../node-registry'

export function useWorkflowExecutor(
  nodes: Node<WorkflowNodeData>[],
  _edges: Edge[],
) {
  const store = useExecutionStore()
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes

  const simulateExecution = useCallback(async () => {
    const currentState = useExecutionStore.getState()
    if (!currentState.running) return

    const path = currentState.executionPath
    const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]))

    for (let i = 0; i < path.length; i++) {
      if (!useExecutionStore.getState().running) break

      const nodeId = path[i]
      const node = nodeMap.get(nodeId)
      if (!node) continue

      const nodeTitle = (node.data as WorkflowNodeData).title ?? nodeId

      store.advanceToNode(node.id)

      const config = ((node.data as WorkflowNodeData).config ?? {}) as Record<string, unknown>
      const typeId = (node.data as WorkflowNodeData).nodeTypeId as string | undefined

      if (typeId) {
        const def = getNodeDefinition(typeId)
        if (def) {
          const errors = def.validate(config)
          const blocking = errors.filter((e) => e.severity === 'error')
          if (blocking.length > 0) {
            store.addLog({
              nodeId,
              nodeTitle,
              level: 'error',
              message: blocking.map((e) => e.message).join('; '),
            })
            store.completeNode(nodeId, blocking[0].message)
            return
          }
        }
      }

      store.addLog({
        nodeId,
        nodeTitle,
        level: 'info',
        message: 'Executing...',
      })

      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

      if (!useExecutionStore.getState().running) break

      const shouldError = Math.random() < 0.05
      if (shouldError) {
        store.completeNode(nodeId, 'Simulated execution error')
      } else {
        store.completeNode(nodeId)
      }
    }
  }, [store])

  return { simulateExecution }
}
