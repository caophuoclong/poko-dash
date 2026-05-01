import { useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  SelectionMode,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  type OnSelectionChangeParams,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import WorkflowNode from './nodes/workflow-node'
import type { WorkflowDetail, WorkflowNodeData } from '../types'
import { NODE_TYPE_CATALOG } from '../types'

const nodeTypes = {
  'workflow-node': WorkflowNode,
}

const defaultEdgeOptions = {
  type: 'smoothstep' as const,
  style: { stroke: 'var(--t-frost)', strokeWidth: 1 },
  animated: false,
}

interface WorkflowCanvasProps {
  workflow: WorkflowDetail
  onNodeSelect: (nodeId: string | null) => void
}

export function WorkflowCanvas({ workflow, onNodeSelect }: WorkflowCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance<Node<WorkflowNodeData>, Edge> | null>(null)
  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<WorkflowNodeData>>(workflow.nodes as Node<WorkflowNodeData>[])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(workflow.edges)
  const prevWorkflowRef = useRef(workflow.id)

  useEffect(() => {
    if (prevWorkflowRef.current !== workflow.id) {
      setNodes(workflow.nodes as Node<WorkflowNodeData>[])
      setEdges(workflow.edges)
      prevWorkflowRef.current = workflow.id
    }
  }, [workflow, setNodes, setEdges])

  const getNodeColor = useCallback((node: Node<WorkflowNodeData>) => {
    const icon = (node.data as WorkflowNodeData).icon
    const category = NODE_TYPE_CATALOG.find((n) => n.icon === icon)?.category
    switch (category) {
      case 'trigger':
        return 'var(--t-accent-orange)'
      case 'action':
        return 'var(--t-accent-blue)'
      case 'condition':
        return 'var(--t-accent-yellow)'
      case 'output':
        return 'var(--t-accent-green)'
      default:
        return 'var(--t-accent-blue)'
    }
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          ...connection,
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          type: 'smoothstep',
          style: { stroke: 'var(--t-muted-text)', strokeWidth: 1.5 },
        } as Edge,
      ])
    },
    [setEdges],
  )

  const handleNodesChange: OnNodesChange<Node<WorkflowNodeData>> = useCallback(
    (changes) => {
      onNodesChange(changes)
    },
    [onNodesChange],
  )

  const handleEdgesChange: OnEdgesChange<Edge> = useCallback(
    (changes) => {
      onEdgesChange(changes)
    },
    [onEdgesChange],
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

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected)
        if (selectedNodes.length > 0) {
          event.preventDefault()
          setNodes((nds) => nds.filter((n) => !n.selected))
          setEdges((eds) =>
            eds.filter(
              (e) =>
                !selectedNodes.some((n) => n.id === e.source || n.id === e.target),
            ),
          )
          onNodeSelect(null)
        }
        const selectedEdges = edges.filter((e) => e.selected)
        if (selectedEdges.length > 0) {
          event.preventDefault()
          setEdges((eds) => eds.filter((e) => !e.selected))
        }
      }
    },
    [nodes, edges, setNodes, setEdges, onNodeSelect],
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
        const parsed = JSON.parse(rawData) as { type: string; data: WorkflowNodeData }

        const nodeDef = NODE_TYPE_CATALOG.find((n) => n.type === parsed.type)
        const newData: WorkflowNodeData = nodeDef
          ? { ...nodeDef.defaultData, title: nodeDef.label }
          : parsed.data

        if (!reactFlowInstance.current) return
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        const newNode: Node<WorkflowNodeData> = {
          id: `node-${Date.now()}`,
          type: parsed.type,
          position,
          data: newData,
        }

        setNodes((nds) => [...nds, newNode])
      } catch {
        // Invalid drag data — ignore
      }
    },
    [setNodes],
  )

  return (
    <div
      ref={wrapperRef}
      className="flex-1 relative"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={(instance) => { reactFlowInstance.current = instance }}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onPaneClick={handlePaneClick}
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
