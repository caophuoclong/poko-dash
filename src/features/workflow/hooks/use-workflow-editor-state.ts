import { useState, useRef, useCallback, useEffect } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'

interface HistoryEntry {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

export function useWorkflowEditorState(initialNodes: Node<WorkflowNodeData>[], initialEdges: Edge[]) {
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)

  const savedNodesRef = useRef<Node<WorkflowNodeData>[]>(structuredClone(initialNodes))
  const savedEdgesRef = useRef<Edge[]>(structuredClone(initialEdges))
  const undoStack = useRef<HistoryEntry[]>([])
  const redoStack = useRef<HistoryEntry[]>([])
  const skipHistoryRef = useRef(false)
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveCallbackRef = useRef<((nodes: Node<WorkflowNodeData>[], edges: Edge[]) => Promise<void>) | null>(null)
  const dirtyCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isDirty = useCallback(() => {
    const sn = savedNodesRef.current
    const se = savedEdgesRef.current
    if (sn.length !== nodes.length || se.length !== edges.length) return true
    return !deepEqualNodes(sn, nodes) || !deepEqualEdges(se, edges)
  }, [nodes, edges])

  const markSaved = useCallback((newNodes: Node<WorkflowNodeData>[], newEdges: Edge[]) => {
    savedNodesRef.current = structuredClone(newNodes)
    savedEdgesRef.current = structuredClone(newEdges)
    setLastSavedAt(Date.now())
    setSaveStatus('saved')

    if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current)
    saveStatusTimerRef.current = setTimeout(() => {
      setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev))
    }, 2000)
  }, [])

  const pushHistory = useCallback(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false
      return
    }
    undoStack.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    })
    redoStack.current = []
  }, [nodes, edges])

  const undo = useCallback(() => {
    const entry = undoStack.current.pop()
    if (!entry) return
    redoStack.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    })
    skipHistoryRef.current = true
    setNodes(entry.nodes)
    setEdges(entry.edges)
  }, [nodes, edges])

  const redo = useCallback(() => {
    const entry = redoStack.current.pop()
    if (!entry) return
    undoStack.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    })
    skipHistoryRef.current = true
    setNodes(entry.nodes)
    setEdges(entry.edges)
  }, [nodes, edges])

  const handleNodesChange = useCallback(
    (newNodes: Node<WorkflowNodeData>[]) => {
      pushHistory()
      setNodes(newNodes)
    },
    [pushHistory],
  )

  const handleEdgesChange = useCallback(
    (newEdges: Edge[]) => {
      pushHistory()
      setEdges(newEdges)
    },
    [pushHistory],
  )

  const replaceState = useCallback(
    (newNodes: Node<WorkflowNodeData>[], newEdges: Edge[]) => {
      skipHistoryRef.current = true
      setNodes(newNodes)
      setEdges(newEdges)
      undoStack.current = []
      redoStack.current = []
    },
    [],
  )

  const revertToSaved = useCallback(() => {
    const sn = savedNodesRef.current
    const se = savedEdgesRef.current
    skipHistoryRef.current = true
    setNodes(structuredClone(sn))
    setEdges(structuredClone(se))
    undoStack.current = []
    redoStack.current = []
    setSaveStatus('idle')
  }, [])

  const clearAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
  }, [])

  const registerSaveCallback = useCallback(
    (cb: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => Promise<void>) => {
      saveCallbackRef.current = cb
    },
    [],
  )

  const triggerSave = useCallback(async () => {
    if (!saveCallbackRef.current) return
    setSaveStatus('saving')
    try {
      await saveCallbackRef.current(nodes, edges)
      markSaved(nodes, edges)
    } catch {
      setSaveStatus('error')
    }
  }, [nodes, edges, markSaved])

  const scheduleAutoSave = useCallback(() => {
    clearAutoSaveTimer()
    setSaveStatus('dirty')
    autoSaveTimerRef.current = setTimeout(() => {
      triggerSave()
    }, 3000)
  }, [clearAutoSaveTimer, triggerSave])

  useEffect(() => {
    if (dirtyCheckTimerRef.current) clearTimeout(dirtyCheckTimerRef.current)
    dirtyCheckTimerRef.current = setTimeout(() => {
      if (isDirty()) {
        scheduleAutoSave()
      } else {
        clearAutoSaveTimer()
        if (saveStatus === 'dirty' || saveStatus === 'saved') {
          setSaveStatus((prev) => (prev === 'dirty' || prev === 'saved' ? 'idle' : prev))
        }
      }
    }, 150)
  }, [nodes, edges])

  useEffect(() => {
    return () => {
      clearAutoSaveTimer()
      if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current)
      if (dirtyCheckTimerRef.current) clearTimeout(dirtyCheckTimerRef.current)
    }
  }, [clearAutoSaveTimer])

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    saveStatus,
    lastSavedAt,
    undoStack,
    redoStack,
    undo,
    redo,
    handleNodesChange,
    handleEdgesChange,
    pushHistory,
    replaceState,
    triggerSave,
    markSaved,
    revertToSaved,
    registerSaveCallback,
    isDirty,
    skipNextHistory: () => { skipHistoryRef.current = true },
  }
}

function deepEqualNodes(a: Node<WorkflowNodeData>[], b: Node<WorkflowNodeData>[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const na = a[i]
    const nb = b[i]
    if (
      na.id !== nb.id ||
      na.type !== nb.type ||
      na.position.x !== nb.position.x ||
      na.position.y !== nb.position.y
    ) return false
    if (na.data.title !== nb.data.title) return false
    if (na.data.subtitle !== nb.data.subtitle) return false
    if (na.data.nodeTypeId !== nb.data.nodeTypeId) return false
    if (na.data.status !== nb.data.status) return false
    if (na.selected !== nb.selected) return false
    if (!deepEqualConfig(na.data.config as Record<string, unknown>, nb.data.config as Record<string, unknown>)) return false
  }
  return true
}

function deepEqualEdges(a: Edge[], b: Edge[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const ea = a[i]
    const eb = b[i]
    if (
      ea.id !== eb.id ||
      ea.source !== eb.source ||
      ea.target !== eb.target ||
      ea.sourceHandle !== eb.sourceHandle ||
      ea.type !== eb.type
    ) return false
  }
  return true
}

function deepEqualConfig(a: Record<string, unknown> | undefined, b: Record<string, unknown> | undefined): boolean {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {})
}
