import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  SelectionMode,
} from '@xyflow/react'
import type { Node, Edge, ReactFlowInstance } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import WorkflowNode from './nodes/workflow-node'
import CompactPillNode from './nodes/compact-pill-node'
import { WorkflowEdge } from './edges/workflow-edge'
import { CompactPillEdge } from './edges/compact-pill-edge'
import type { WorkflowNodeData } from '../types'
import { useWorkflowCanvasLogic } from '../hooks/use-workflow-canvas'

const nodeTypes = {
  'workflow-node': WorkflowNode,
  'compact-pill-node': CompactPillNode,
}

const edgeTypes = {
  'workflow-edge': WorkflowEdge,
  'compact-pill-edge': CompactPillEdge,
}

const defaultEdgeOptions = {
  type: 'workflow-edge' as const,
  data: { style: 'auto' as const },
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
  const {
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
  } = useWorkflowCanvasLogic({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeSelect,
    onNodeDoubleClick,
  })

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
        edges={styledEdges}
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
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-right"
        selectionMode={SelectionMode.Partial}
        selectNodesOnDrag={true}
        deleteKeyCode={['Delete', 'Backspace']}
        className="[&_.react-flow__attribution]:!bg-transparent [&_.react-flow__attribution]:!text-muted-text [&_.react-flow__attribution]:!text-[10px] [&_.react-flow__edges]:!z-[2] [&_.react-flow__nodes]:!z-[3] [&_.react-flow__pane]:!overflow-visible"
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
