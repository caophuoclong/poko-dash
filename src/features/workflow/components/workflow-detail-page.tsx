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
  History,
  GitCommit,
  Info,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
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
import { VersionHistoryPanel } from './VersionHistoryPanel'
import {
  useWorkflowsControllerRun,
  workflowsControllerGetVersion,
} from '#/api/client'
import {
  useSaveWorkflowCanvas,
  useDeleteWorkflow,
  useCreateWorkflowVersion,
} from '../hooks/use-workflows'
import { useWorkflowEditorState } from '../hooks/use-workflow-editor-state'
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
  const [versionPanelOpen, setVersionPanelOpen] = useState(false)
  const [previewVersion, setPreviewVersion] = useState<number | null>(null)
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null)
  const [saveVersionPopoverOpen, setSaveVersionPopoverOpen] = useState(false)
  const [versionMessage, setVersionMessage] = useState('')
  const [autoSaveVisible, setAutoSaveVisible] = useState(false)
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedNodeRef = useRef<string | null>(null)

  const editor = useWorkflowEditorState(
    workflow.nodes as Node<WorkflowNodeData>[],
    workflow.edges,
  )

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
  const createVersionMutation = useCreateWorkflowVersion()

  useExecutionSSE(executionId)

  editor.registerSaveCallback(
    useCallback(
      async (nodesToSave, edgesToSave) => {
        await saveMutation.mutateAsync(
          { id: workflow.id, nodes: nodesToSave, edges: edgesToSave },
        )
        showAutoSave()
      },
      [saveMutation, workflow.id],
    ),
  )

  const showAutoSave = useCallback(() => {
    setAutoSaveVisible(true)
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      setAutoSaveVisible(false)
    }, 2000)
  }, [])

  const handleExecute = useCallback(
    (mode: 'full' | 'to-node' | 'single-node') => {
      const validationErrors = validateAndStart(
        mode,
        editor.nodes,
        editor.edges,
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
      editor.nodes,
      editor.edges,
      selectedNodeId,
      runMutation,
      workflow.id,
      setExecutionId,
      failExecution,
    ],
  )

  const handleRestoreClick = useCallback(
    async (versionNumber: number) => {
      setRestoringVersion(versionNumber)

      try {
        const res = await workflowsControllerGetVersion(
          workflow.id,
          versionNumber,
        )
        const data = (res as any)?.data ?? res
        const snapshot = data?.snapshot

        if (snapshot?.nodes && snapshot?.edges) {
          const mappedNodes = snapshot.nodes.map((n: any) => ({
            id: n.xyflow_id,
            type: n.type ?? 'workflow-node',
            position: { x: n.position_x, y: n.position_y },
            data: {
              title: n.title ?? '',
              subtitle: n.subtitle,
              icon: n.icon,
              nodeTypeId: n.node_type_id,
              status: n.status ?? 'pending',
              config: n.config ?? {},
            },
          })) as Node<WorkflowNodeData>[]

          const mappedEdges = snapshot.edges.map((e: any) => ({
            id: e.id,
            source: e.source_node_id,
            target: e.target_node_id,
            sourceHandle: e.source_handle,
            type: e.type ?? 'smoothstep',
          })) as Edge[]

          editor.replaceState(mappedNodes, mappedEdges)

          if (rfInstance.current) {
            rfInstance.current.setNodes(mappedNodes)
            rfInstance.current.setEdges(mappedEdges)
          }

          setPreviewVersion(versionNumber)
        }
      } catch {
        // restore failed, do nothing
      }
    },
    [workflow.id, editor],
  )

  const handleConfirmRestore = useCallback(() => {
    if (previewVersion === null) return

    saveMutation.mutate(
      { id: workflow.id, nodes: editor.nodes, edges: editor.edges },
      {
        onSuccess: () => {
          editor.markSaved(editor.nodes, editor.edges)
          setPreviewVersion(null)
          setRestoringVersion(null)
        },
      },
    )
  }, [saveMutation, workflow.id, editor, previewVersion])

  const handleCancelRestore = useCallback(() => {
    editor.revertToSaved()
    if (rfInstance.current) {
      rfInstance.current.setNodes(editor.nodes)
      rfInstance.current.setEdges(editor.edges)
    }
    setPreviewVersion(null)
    setRestoringVersion(null)
  }, [editor])

  const handleSaveVersion = useCallback(() => {
    createVersionMutation.mutate(
      { id: workflow.id, message: versionMessage },
      {
        onSuccess: () => {
          setSaveVersionPopoverOpen(false)
          setVersionMessage('')
        },
      },
    )
  }, [createVersionMutation, workflow.id, versionMessage])

  const handleAddNode = useCallback(
    (def: WorkflowNodeDefinition) => {
      const inst = rfInstance.current
      const center = inst
        ? inst.screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          })
        : { x: 300 + editor.nodes.length * 20, y: 200 + editor.nodes.length * 30 }

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

      editor.pushHistory()
      editor.skipNextHistory()
      editor.setNodes((prev: Node<WorkflowNodeData>[]) => [...prev, newNode])
    },
    [editor],
  )

  useEffect(() => {
    if (prevWorkflowId.current !== workflow.id) {
      editor.replaceState(
        workflow.nodes as Node<WorkflowNodeData>[],
        workflow.edges,
      )
      setSelectedNodeId(null)
      setEditingNodeId(null)
      resetExecution()
      prevWorkflowId.current = workflow.id
    }
  }, [workflow, resetExecution, editor])

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
      editor.pushHistory()
      editor.skipNextHistory()
      editor.setNodes((prev: Node<WorkflowNodeData>[]) =>
        prev.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...patch } as WorkflowNodeData }
            : n,
        ),
      )
    },
    [editor],
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      editor.pushHistory()
      editor.skipNextHistory()
      editor.setNodes((prev: Node<WorkflowNodeData>[]) =>
        prev.filter((n) => n.id !== nodeId),
      )
      editor.setEdges((prev: Edge[]) =>
        prev.filter((e) => e.source !== nodeId && e.target !== nodeId),
      )
      setSelectedNodeId(null)
      setEditingNodeId(null)
    },
    [editor],
  )

  const editingNode = editingNodeId
    ? editor.nodes.find((n) => n.id === editingNodeId)
    : null

  const canUndo = editor.undoStack.current.length > 0
  const canRedo = editor.redoStack.current.length > 0

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
            nodes={editor.nodes}
            edges={editor.edges}
            onClose={handleCloseModal}
            onNodeDataUpdate={handleNodeDataUpdate}
            onDeleteNode={handleDeleteNode}
            onExecute={handleExecute}
          />
        )}

        {previewVersion !== null && (
          <div className="flex items-center justify-between px-4 py-2 bg-accent-yellow/10 border-b border-accent-yellow/20 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-accent-yellow" />
              <span className="text-xs text-accent-yellow">
                Previewing v{previewVersion} — Save to apply or Cancel to discard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                color="green-dim"
                onClick={handleConfirmRestore}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                Save this version
              </Button>
              <Button size="xs" variant="ghost" onClick={handleCancelRestore}>
                Cancel
              </Button>
            </div>
          </div>
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
              onClick={() =>
                paletteCollapsed
                  ? setPaletteCollapsed(false)
                  : editor.setNodes((prev) => [...prev])
              }
              title={
                paletteCollapsed
                  ? 'Open node palette'
                  : 'Palette is open — drag nodes to canvas'
              }
            >
              <Plus size={14} />
              Add Node
            </Button>

            <div className="w-px h-5 bg-frost mx-1" />

            <Button
              variant="ghost"
              size="icon-xs"
              title="Undo"
              onClick={editor.undo}
              disabled={!canUndo}
              className="text-muted-text hover:text-near-white disabled:opacity-30"
            >
              <Undo2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Redo"
              onClick={editor.redo}
              disabled={!canRedo}
              className="text-muted-text hover:text-near-white disabled:opacity-30"
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

            <div className="relative">
              {saveVersionPopoverOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] bg-surface border border-frost rounded-xl shadow-lg p-3 z-50">
                  <div className="flex items-center gap-2 mb-3">
                    <GitCommit size={14} className="text-accent-blue" />
                    <span className="text-xs font-semibold text-near-white">
                      Save Version
                    </span>
                  </div>
                  <input
                    type="text"
                    value={versionMessage}
                    onChange={(e) => setVersionMessage(e.target.value)}
                    placeholder="What changed in this version?"
                    className="w-full h-8 px-3 rounded-lg border border-frost bg-surface-2 text-xs text-near-white placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 mb-3"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveVersion()
                      if (e.key === 'Escape') {
                        setSaveVersionPopoverOpen(false)
                        setVersionMessage('')
                      }
                    }}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setSaveVersionPopoverOpen(false)
                        setVersionMessage('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={handleSaveVersion}
                      disabled={createVersionMutation.isPending}
                    >
                      {createVersionMutation.isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <GitCommit size={12} />
                      )}
                      Save Version
                    </Button>
                  </div>
                </div>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setSaveVersionPopoverOpen(true)}
                    className="text-muted-text hover:text-near-white"
                  >
                    <GitCommit size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Save a version snapshot</TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setVersionPanelOpen((v) => !v)}
                  className={
                    versionPanelOpen
                      ? 'text-accent-blue bg-accent-blue-dim'
                      : 'text-muted-text hover:text-near-white'
                  }
                >
                  <History size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Version history</TooltipContent>
            </Tooltip>

            <div className="w-px h-5 bg-frost mx-1" />

            <div className="flex items-center gap-2">
              <Button
                size="xs"
                color="green-dim"
                onClick={() => editor.triggerSave()}
                disabled={
                  saveMutation.isPending ||
                  editor.saveStatus === 'saving'
                }
              >
                {editor.saveStatus === 'saving' ? (
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
                  <DropdownMenuItem onClick={() => editor.revertToSaved()}>
                    <RotateCcw size={14} />
                    <span>Revert to last saved</span>
                  </DropdownMenuItem>
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

              {editor.saveStatus === 'saving' && (
                <span className="text-[10px] text-accent-blue animate-pulse">
                  Saving…
                </span>
              )}
              {editor.saveStatus === 'dirty' && (
                <span className="text-[10px] text-accent-yellow">
                  <Info size={10} className="inline mr-0.5" />
                  Unsaved changes
                </span>
              )}
              {editor.saveStatus === 'saved' && (
                <span className="text-[10px] text-accent-green fade-out">
                  All changes saved
                </span>
              )}
              {editor.saveStatus === 'error' && (
                <span className="text-[10px] text-accent-red">
                  Save failed
                </span>
              )}
              {autoSaveVisible && editor.saveStatus === 'idle' && (
                <span className="text-[10px] text-muted-text">
                  Version auto-saved
                </span>
              )}
            </div>
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
              nodes={editor.nodes}
              edges={editor.edges}
              onNodesChange={editor.handleNodesChange}
              onEdgesChange={editor.handleEdgesChange}
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
              nodes={editor.nodes}
              edges={editor.edges}
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />

            <ExecutionDock
              selectedNodeId={selectedNodeId}
              nodes={editor.nodes}
              edges={editor.edges}
              onToggleDrawer={() => setDrawerOpen((v) => !v)}
              drawerOpen={drawerOpen}
              workflowId={workflow.id}
            />
          </div>

          <VersionHistoryPanel
            workflowId={workflow.id}
            open={versionPanelOpen}
            onClose={() => setVersionPanelOpen(false)}
            onRestore={handleRestoreClick}
            restoringVersion={restoringVersion}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
