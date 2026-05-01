import { useCallback, useRef, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Save,
  Undo2,
  Redo2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { TooltipProvider } from '#/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { WorkflowCanvas } from './workflow-canvas'
import { NodePalette } from './node-palette'
import { NodeEditModal } from './node-edit-modal'
import { ExecutionDock } from './execution-dock'
import { ExecutionDrawer } from './execution-drawer'
import { useWorkflowsControllerRun } from '#/api/client'
import { useSaveWorkflowCanvas, useDeleteWorkflow } from '../hooks/use-workflows'
import { useExecutionStore } from '../stores/execution-store'
import { useExecutionSSE } from '../hooks/useExecutionSSE'
import type { WorkflowDetail, WorkflowNodeData } from '../types'
import type { Node, Edge, ReactFlowInstance } from '@xyflow/react'
import type { WorkflowNodeDefinition } from '../node-types'

interface WorkflowDetailPageProps {
  workflow: WorkflowDetail
}

export function WorkflowDetailPage({ workflow }: WorkflowDetailPageProps) {
  const navigate = useNavigate()
  const [paletteCollapsed, setPaletteCollapsed] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const selectedNodeRef = useRef<string | null>(null)
  void selectedNodeId

  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>(
    () => workflow.nodes as Node<WorkflowNodeData>[],
  )
  const [edges, setEdges] = useState<Edge[]>(() => workflow.edges)
  const prevWorkflowId = useRef(workflow.id)
  const rfInstance = useRef<ReactFlowInstance<
    Node<WorkflowNodeData>,
    Edge
  > | null>(null)

  const executionId = useExecutionStore((s) => s.executionId)
  const resetExecution = useExecutionStore((s) => s.resetExecution)
  const setExecutionId = useExecutionStore((s) => s.setExecutionId)
  const failExecution = useExecutionStore((s) => s.failExecution)
  const validateAndStart = useExecutionStore((s) => s.validateAndStart)

  const runMutation = useWorkflowsControllerRun()
  const saveMutation = useSaveWorkflowCanvas()
  const deleteMutation = useDeleteWorkflow()

  useExecutionSSE(executionId)

  const handleExecute = useCallback(
    (mode: 'full' | 'to-node' | 'single-node') => {
      const validationErrors = validateAndStart(
        mode,
        nodes,
        edges,
        mode !== 'full' ? selectedNodeId : null,
      )

      if (validationErrors && validationErrors.length > 0) {
        setDrawerOpen(true)
        return
      }

      setDrawerOpen(true)

      runMutation.mutate(
        { id: workflow.id },
        {
          onSuccess: (response) => {
            const runData = response.data
            if (runData?.id) {
              setExecutionId(runData.id)
            } else {
              failExecution('No execution ID received from server')
            }
          },
          onError: (error) => {
            failExecution(
              error instanceof Error
                ? error.message
                : 'Failed to start execution',
            )
          },
        },
      )
    },
    [
      validateAndStart,
      nodes,
      edges,
      selectedNodeId,
      runMutation,
      workflow.id,
      setExecutionId,
      failExecution,
    ],
  )

  const handleAddNode = useCallback(
    (def: WorkflowNodeDefinition) => {
      const inst = rfInstance.current
      const center = inst
        ? inst.screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          })
        : { x: 300 + nodes.length * 20, y: 200 + nodes.length * 30 }

      const newNode: Node<WorkflowNodeData> = {
        id: `node-${Date.now()}`,
        type: 'workflow-node',
        position: center,
        data: {
          title: def.title,
          subtitle: def.description,
          icon: def.icon,
          nodeTypeId: def.typeId,
          status: 'pending',
          config: { ...def.defaultProps },
        },
      }
      setNodes((prev) => [...prev, newNode])
    },
    [nodes.length],
  )

  useEffect(() => {
    if (prevWorkflowId.current !== workflow.id) {
      setNodes(workflow.nodes as Node<WorkflowNodeData>[])
      setEdges(workflow.edges)
      setSelectedNodeId(null)
      setEditingNodeId(null)
      resetExecution()
      prevWorkflowId.current = workflow.id
    }
  }, [workflow, resetExecution])

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId)
    if (nodeId && nodeId === selectedNodeRef.current) {
      setEditingNodeId(nodeId)
    }
    selectedNodeRef.current = nodeId
  }, [])

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    setEditingNodeId(nodeId)
  }, [])

  const handleCloseModal = useCallback(() => {
    setEditingNodeId(null)
  }, [])

  const handleNodeDataUpdate = useCallback(
    (nodeId: string, patch: Partial<WorkflowNodeData>) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...patch } as WorkflowNodeData }
            : n,
        ),
      )
    },
    [],
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((n) => n.id !== nodeId))
      setEdges((prev) =>
        prev.filter((e) => e.source !== nodeId && e.target !== nodeId),
      )
      setSelectedNodeId(null)
      setEditingNodeId(null)
    },
    [],
  )

  const editingNode = editingNodeId
    ? nodes.find((n) => n.id === editingNodeId)
    : null

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-void">
        {editingNode && (
          <NodeEditModal
            key={editingNodeId}
            open={true}
            nodeId={editingNode.id}
            data={editingNode.data as WorkflowNodeData}
            position={editingNode.position}
            nodes={nodes}
            edges={edges}
            onClose={handleCloseModal}
            onNodeDataUpdate={handleNodeDataUpdate}
            onDeleteNode={handleDeleteNode}
            onExecute={handleExecute}
          />
        )}

        <header className="flex items-center gap-3 px-4 py-2.5 border-b border-frost bg-surface shrink-0">
          <Link
            to="/dash/workflows"
            className="flex items-center gap-1.5 text-xs text-muted-text hover:text-near-white transition-colors no-underline mr-2"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-near-white truncate">
                {workflow.name}
              </h1>
              <Badge
                tone={
                  workflow.status === 'active'
                    ? 'green'
                    : workflow.status === 'paused'
                      ? 'yellow'
                      : 'neutral'
                }
                size="sm"
              >
                {workflow.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="xs"
              color="blue-dim"
              onClick={() => setPaletteCollapsed(false)}
            >
              <Plus size={14} />
              Add Node
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <Button
              variant="ghost"
              size="icon-xs"
              title="Undo"
              className="text-muted-text hover:text-near-white"
            >
              <Undo2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Redo"
              className="text-muted-text hover:text-near-white"
            >
              <Redo2 size={14} />
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setPaletteCollapsed((v) => !v)}
              title={paletteCollapsed ? 'Show node palette' : 'Hide node palette'}
              className={
                !paletteCollapsed
                  ? 'text-accent-blue bg-accent-blue-dim'
                  : 'text-muted-text hover:text-near-white'
              }
            >
              {paletteCollapsed ? (
                <PanelLeftOpen size={14} />
              ) : (
                <PanelLeftClose size={14} />
              )}
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <Button
              size="xs"
              color="green-dim"
              onClick={() =>
                saveMutation.mutate({ id: workflow.id, nodes, edges })
              }
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-text hover:text-near-white"
                >
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem
                  className="text-accent-red"
                  onClick={() => {
                    deleteMutation.mutate(workflow.id, {
                      onSuccess: () => {
                        navigate({ to: '/dash/workflows' })
                      },
                    })
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Workflow</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          <NodePalette
            collapsed={paletteCollapsed}
            onToggle={() => setPaletteCollapsed((v) => !v)}
            onAddNode={handleAddNode}
          />

          <div className="flex-1 flex min-w-0 relative">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={setNodes}
              onEdgesChange={setEdges}
              onNodeSelect={handleNodeSelect}
              onNodeDoubleClick={handleNodeDoubleClick}
              onPaneClick={() => {
                setSelectedNodeId(null)
                selectedNodeRef.current = null
              }}
              workflowId={workflow.id}
              rfInstanceRef={rfInstance}
            />

            <ExecutionDrawer
              nodes={nodes}
              edges={edges}
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />

            <ExecutionDock
              selectedNodeId={selectedNodeId}
              nodes={nodes}
              edges={edges}
              onToggleDrawer={() => setDrawerOpen((v) => !v)}
              drawerOpen={drawerOpen}
              workflowId={workflow.id}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
