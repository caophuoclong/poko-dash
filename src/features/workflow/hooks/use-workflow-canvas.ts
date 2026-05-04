import { useCallback, useRef, useMemo, useEffect } from 'react'
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  type OnSelectionChangeParams,
  type ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import type { WorkflowNodeData } from '../types'
import { getNodeDefinition } from '../node-registry'
import { useExecutionStore } from '../stores/execution-store'
import { useExecutionEdgeStates } from './use-execution-edge-states'
import type { EdgeStyle } from '../components/edges/workflow-edge'

interface WorkflowCanvasLogic {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onNodesChange: (nodes: Node<WorkflowNodeData>[]) => void
  onEdgesChange: (edges: Edge[]) => void
  onNodeSelect: (nodeId: string | null) => void
  onNodeDoubleClick: (nodeId: string) => void
}

export function useWorkflowCanvasLogic({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
  onNodeDoubleClick,
}: WorkflowCanvasLogic) {
  const reactFlowInstance = useRef<ReactFlowInstance<
    Node<WorkflowNodeData>,
    Edge
  > | null>(null)

  const running = useExecutionStore((s) => s.running)
  const executionPath = useExecutionStore((s) => s.executionPath)
  const nodeExecutions = useExecutionEdgeStates()

  const completedNodeIds = useMemo(() => {
    if (!nodeExecutions) return new Set<string>()
    return new Set(
      nodeExecutions
        .filter((n) => n.status === 'completed' || n.status === 'failed')
        .map((n) => n.nodeId),
    )
  }, [nodeExecutions])

  const styledEdges = useMemo(() => {
    if (!running) return edges

    const pathSet = new Set(executionPath)

    return edges.map((edge) => {
      const onPath = pathSet.has(edge.source) && pathSet.has(edge.target)

      if (!onPath) {
        return {
          ...edge,
          style: { stroke: 'var(--t-frost)', strokeWidth: 1, opacity: 0.25 },
          animated: false,
        }
      }

      const sourceCompleted = completedNodeIds.has(edge.source)
      const targetRunning = !completedNodeIds.has(edge.target) && onPath

      if (sourceCompleted && targetRunning) {
        return {
          ...edge,
          style: { stroke: 'var(--t-accent-blue)', strokeWidth: 2 },
          animated: true,
        }
      }

      if (sourceCompleted && completedNodeIds.has(edge.target)) {
        return {
          ...edge,
          style: { stroke: 'var(--t-accent-green)', strokeWidth: 1.5 },
          animated: false,
        }
      }

      return edge
    })
  }, [edges, running, executionPath, completedNodeIds])

  const getNodeColor = useCallback((node: Node<WorkflowNodeData>) => {
    const data = node.data as WorkflowNodeData
    if (data.nodeTypeId) {
      const def = getNodeDefinition(data.nodeTypeId)
      if (def) {
        const catColors: Record<string, string> = {
          trigger: 'var(--t-accent-orange)',
          source: 'var(--t-accent-blue)',
          content: 'var(--t-accent-yellow)',
          utility: 'var(--t-muted-text)',
          logic: 'var(--t-accent-purple)',
          crawl: 'var(--t-accent-purple)',
          product: 'var(--t-accent-blue)',
          affiliate: 'var(--t-accent-green)',
          publish: 'var(--t-accent-green)',
          metric: 'var(--t-accent-purple)',
        }
        return catColors[def.category] ?? 'var(--t-accent-blue)'
      }
    }
    return 'var(--t-accent-blue)'
  }, [])

  const handleNodesChange: OnNodesChange<Node<WorkflowNodeData>> = useCallback(
    (changes) => {
      const updated = applyNodeChanges(changes, nodes)
      onNodesChange(updated as Node<WorkflowNodeData>[])
    },
    [nodes, onNodesChange],
  )

  const handleEdgesChange: OnEdgesChange<Edge> = useCallback(
    (changes) => {
      const updated = applyEdgeChanges(changes, edges)
      onEdgesChange(updated)
    },
    [edges, onEdgesChange],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const label =
        connection.sourceHandle && connection.targetHandle
          ? `${connection.sourceHandle} → ${connection.targetHandle}`
          : undefined

      onEdgesChange([
        ...edges,
        {
          ...connection,
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          type: 'workflow-edge',
          data: {
            style: 'auto' as EdgeStyle,
            ...(label ? { label } : {}),
          },
          style: { stroke: 'var(--t-frost)', strokeWidth: 1.5 },
        } as Edge,
      ])
    },
    [edges, onEdgesChange],
  )

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      if (selectedNodes.length === 1) {
        onNodeSelect(selectedNodes[0].id)
      } else {
        onNodeSelect(null)
      }
    },
    [onNodeSelect],
  )

  const handleNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      onNodeDoubleClick(node.id)
    },
    [onNodeDoubleClick],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected)
        if (selectedNodes.length > 0) {
          event.preventDefault()
          onNodesChange(nodes.filter((n) => !n.selected))
          onEdgesChange(
            edges.filter(
              (e) =>
                !selectedNodes.some(
                  (n) => n.id === e.source || n.id === e.target,
                ),
            ),
          )
          onNodeSelect(null)
        }
        const selectedEdges = edges.filter((e) => e.selected)
        if (selectedEdges.length > 0) {
          event.preventDefault()
          onEdgesChange(edges.filter((e) => !e.selected))
        }
      }
    },
    [nodes, edges, onNodesChange, onEdgesChange, onNodeSelect],
  )

  useEffect(() => {
    const handleEdgeStyleChange = (e: Event) => {
      const { edgeId, style } = (e as CustomEvent).detail as { edgeId: string; style: EdgeStyle }
      onEdgesChange(
        edges.map((edge) =>
          edge.id === edgeId
            ? { ...edge, data: { ...(edge.data as Record<string, unknown>), style } }
            : edge,
        ),
      )
    }

    const handleEdgeDelete = (e: Event) => {
      const { edgeId } = (e as CustomEvent).detail as { edgeId: string }
      onEdgesChange(edges.filter((edge) => edge.id !== edgeId))
    }

    document.addEventListener('workflow-edge-style-change', handleEdgeStyleChange)
    document.addEventListener('workflow-edge-delete', handleEdgeDelete)

    const handleNodeDuplicate = (e: Event) => {
      const { nodeId } = (e as CustomEvent).detail as { nodeId: string }
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      const copy: Node<WorkflowNodeData> = {
        ...node,
        id: `node-${Date.now()}`,
        position: { x: node.position.x + 32, y: node.position.y + 32 },
        selected: false,
      }
      onNodesChange([...nodes.map((n) => ({ ...n, selected: false })), { ...copy, selected: true }])
    }

    document.addEventListener('workflow-node-duplicate', handleNodeDuplicate)
    return () => {
      document.removeEventListener('workflow-edge-style-change', handleEdgeStyleChange)
      document.removeEventListener('workflow-edge-delete', handleEdgeDelete)
      document.removeEventListener('workflow-node-duplicate', handleNodeDuplicate)
    }
  }, [edges, onEdgesChange])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const rawData = event.dataTransfer.getData('application/reactflow')
      if (!rawData) return

      try {
        const parsed = JSON.parse(rawData) as {
          type: string
          data: WorkflowNodeData
        }

        if (!reactFlowInstance.current) return
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        const newNode: Node<WorkflowNodeData> = {
          id: `node-${Date.now()}`,
          type: parsed.type,
          position,
          data: parsed.data,
        }

        onNodesChange([...nodes, newNode])
      } catch {
        // Invalid drag data — ignore
      }
    },
    [nodes, onNodesChange],
  )

  return {
    reactFlowInstance,
    styledEdges,
    getNodeColor,
    handleNodesChange,
    handleEdgesChange,
    onConnect,
    handleSelectionChange,
    handleNodeDoubleClick,
    handleKeyDown,
    onDragOver,
    onDrop,
  }
}
