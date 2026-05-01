import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  SelectionMode,
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
import '@xyflow/react/dist/style.css'
import WorkflowNode from './nodes/workflow-node'
import type { WorkflowNodeData } from '../types'
import { getNodeDefinition } from '../node-registry'
import '../node-catalog'

const nodeTypes = {
  'workflow-node': WorkflowNode,
}

const defaultEdgeOptions = {
  type: 'smoothstep' as const,
  style: { stroke: 'var(--t-frost)', strokeWidth: 1 },
  animated: false,
}

interface WorkflowCanvasProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onNodesChange: (nodes: Node<WorkflowNodeData>[]) => void
  onEdgesChange: (edges: Edge[]) => void
  onNodeSelect: (nodeId: string | null) => void
  onNodeDoubleClick: (nodeId: string) => void
  onPaneClick: () => void
  workflowId: string
  rfInstanceRef?: React.MutableRefObject<ReactFlowInstance<Node<WorkflowNodeData>, Edge> | null>
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
  onNodeDoubleClick,
  onPaneClick,
  workflowId: _workflowId,
  rfInstanceRef,
}: WorkflowCanvasProps) {
  const reactFlowInstance = useRef<ReactFlowInstance<
    Node<WorkflowNodeData>,
    Edge
  > | null>(null)

  const getNodeColor = useCallback((node: Node<WorkflowNodeData>) => {
    const data = node.data as WorkflowNodeData
    if (data.nodeTypeId) {
      const def = getNodeDefinition(data.nodeTypeId)
      if (def) {
        const catColors: Record<string, string> = {
          trigger: 'var(--t-accent-orange)',
          source: 'var(--t-accent-orange)',
          crawl: 'var(--t-accent-purple)',
          product: 'var(--t-accent-blue)',
          affiliate: 'var(--t-accent-green)',
          content: 'var(--t-accent-yellow)',
          publish: 'var(--t-accent-green)',
          metric: 'var(--t-accent-purple)',
          logic: 'var(--t-accent-yellow)',
          utility: 'var(--t-muted-text)',
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
      onEdgesChange([
        ...edges,
        {
          ...connection,
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          type: 'smoothstep',
          style: { stroke: 'var(--t-muted-text)', strokeWidth: 1.5 },
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

  return (
    <div
      className="flex-1 relative"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={(instance) => {
          reactFlowInstance.current = instance
          if (rfInstanceRef) rfInstanceRef.current = instance
        }}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onNodeDoubleClick={handleNodeDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-right"
        selectionMode={SelectionMode.Partial}
        selectNodesOnDrag={true}
        deleteKeyCode={['Delete', 'Backspace']}
        className="[&_.react-flow__attribution]:!bg-transparent [&_.react-flow__attribution]:!text-muted-text [&_.react-flow__attribution]:!text-[10px]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--t-frost)"
        />

        <Controls
          position="top-left"
          className="!shadow-none !rounded-lg !border !border-frost !bg-surface !overflow-hidden [&_button]:!bg-transparent [&_button]:!border-frost [&_button]:!text-muted-text hover:[&_button]:!text-near-white hover:[&_button]:!bg-surface-2 [&_button]:!w-7 [&_button]:!h-7 [&_svg]:!w-3 [&_svg]:!h-3"
        />

        <MiniMap
          position="bottom-left"
          nodeColor={getNodeColor}
          maskColor="var(--t-void)"
          className="!bg-surface !border !border-frost !rounded-lg"
          style={{ opacity: 0.7 }}
        />
      </ReactFlow>
    </div>
  )
}
