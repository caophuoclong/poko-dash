import { useCallback, useRef, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useExecutionControllerExecuteWorkflow,
  workflowsControllerGetVersion,
} from '#/api/client'
import {
  useSaveWorkflowCanvas,
  useDeleteWorkflow,
  useCreateWorkflowVersion,
} from './use-workflows'
import { useWorkflowEditorState } from './use-workflow-editor-state'
import { useExecutionStore } from '../stores/execution-store'
import { useExecutionSSE } from './useExecutionSSE'
import { loadNodeDefinitionsFromAPI } from '../node-registry'
import { importWorkflow } from '../workflow-transfer'
import type { WorkflowDetail, WorkflowNodeData } from '../types'
import type { Node, Edge, ReactFlowInstance } from '@xyflow/react'
import type { NodeDefinition } from '../node-types'

export function useWorkflowDetailPage(workflow: WorkflowDetail) {
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const editor = useWorkflowEditorState(
    workflow.nodes as Node<WorkflowNodeData>[],
    workflow.edges,
  )

  const prevWorkflowId = useRef(workflow.id)
  const rfInstance = useRef<ReactFlowInstance<
    Node<WorkflowNodeData>,
    Edge
  > | null>(null)

  const resetExecution = useExecutionStore((s) => s.resetExecution)
  const failExecution = useExecutionStore((s) => s.failExecution)
  const validateAndStart = useExecutionStore((s) => s.validateAndStart)

  const runMutation = useExecutionControllerExecuteWorkflow()
  const saveMutation = useSaveWorkflowCanvas()
  const deleteMutation = useDeleteWorkflow()
  const createVersionMutation = useCreateWorkflowVersion()

  const { connect: connectSSE } = useExecutionSSE()

  editor.registerSaveCallback(
    useCallback(
      async (nodesToSave, edgesToSave, versionType) => {
        await saveMutation.mutateAsync({
          id: workflow.id,
          nodes: nodesToSave,
          edges: edgesToSave,
          versionType: versionType ?? 'auto',
        })
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
        {
          workflowId: workflow.id,
          data: {
            mode,
            targetNodeId: mode !== 'full' ? (selectedNodeId ?? undefined) : undefined,
            triggeredBy: 'manual' as const,
          },
        },
        {
          onSuccess: (response) => {
            const executionId = response.data?.executionId
            if (executionId) {
              connectSSE(executionId)
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
      failExecution,
      connectSSE,
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
            type: 'workflow-edge',
            data: { style: 'auto' },
            style: { stroke: 'var(--t-frost)', strokeWidth: 1.5 },
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
      {
        id: workflow.id,
        nodes: editor.nodes,
        edges: editor.edges,
        versionType: 'manual',
      },
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
      {
        id: workflow.id,
        message: versionMessage,
        nodes: editor.nodes,
        edges: editor.edges,
      },
      {
        onSuccess: () => {
          setSaveVersionPopoverOpen(false)
          setVersionMessage('')
        },
      },
    )
  }, [
    createVersionMutation,
    workflow.id,
    versionMessage,
    editor.nodes,
    editor.edges,
  ])

  const handleAddNode = useCallback(
    (def: NodeDefinition) => {
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
    loadNodeDefinitionsFromAPI()
  }, [])

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

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null)
    selectedNodeRef.current = null
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

  const handleImportChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      importWorkflow(file)
        .then((result) => {
          navigate({
            to: '/workflow/$workflowId',
            params: { workflowId: result.id },
          })
        })
        .catch((err) => {
          console.error('Import failed:', err)
        })
    },
    [navigate],
  )

  const editingNode = editingNodeId
    ? editor.nodes.find((n) => n.id === editingNodeId)
    : null

  const canUndo = editor.undoStack.current.length > 0
  const canRedo = editor.redoStack.current.length > 0

  return {
    paletteCollapsed,
    setPaletteCollapsed,
    selectedNodeId,
    editingNodeId,
    editingNode,
    drawerOpen,
    setDrawerOpen,
    versionPanelOpen,
    setVersionPanelOpen,
    previewVersion,
    restoringVersion,
    saveVersionPopoverOpen,
    setSaveVersionPopoverOpen,
    versionMessage,
    setVersionMessage,
    autoSaveVisible,
    fileInputRef,
    editor,
    rfInstance,
    runMutation,
    saveMutation,
    deleteMutation,
    createVersionMutation,
    connectSSE,
    canUndo,
    canRedo,
    navigate,
    handleExecute,
    handleRestoreClick,
    handleConfirmRestore,
    handleCancelRestore,
    handleSaveVersion,
    handleAddNode,
    handlePaneClick,
    handleNodeSelect,
    handleNodeDoubleClick,
    handleCloseModal,
    handleNodeDataUpdate,
    handleDeleteNode,
    handleImportChange,
  }
}
