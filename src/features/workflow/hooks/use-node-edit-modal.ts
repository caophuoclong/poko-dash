import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { WorkflowNodeData, WorkflowVariable } from '../types'
import { buildVariableList } from '../utils/variable-system-utils'
import { ICON_MAP } from '../components/nodes/workflow-node.constants'
import type { LucideIcon } from 'lucide-react'
import { getNodeDefinition } from '../stores/node-registry/use-node-registry.store'
import type { ValidationError } from '../stores/node-registry/use-node-registry.store'
import { CATEGORY_CONFIG } from '../stores/node-registry/constants'

interface UseNodeEditModalProps {
  nodeId: string
  data: WorkflowNodeData
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  workflowVariables?: WorkflowVariable[]
  onClose: () => void
  onNodeDataUpdate: (nodeId: string, patch: Partial<WorkflowNodeData>) => void
}

export function useNodeEditModal({
  nodeId,
  data,
  nodes,
  edges,
  workflowVariables,
  onClose,
  onNodeDataUpdate,
}: UseNodeEditModalProps) {
  const def = getNodeDefinition(data.nodeTypeId ?? '')
  const [activeTab, setActiveTab] = useState<'properties' | 'validation'>(
    'properties',
  )

  const [localProps, setLocalProps] = useState<Record<string, unknown>>(() => ({
    ...def?.config.defaultProps,
    ...(data.config ?? {}),
  }))

  const [title, setTitle] = useState(data.title)
  const [subtitle, setSubtitle] = useState(data.subtitle ?? '')

  const availableVars = useMemo(
    () => buildVariableList(nodes, edges, nodeId, undefined, workflowVariables),
    [nodes, edges, nodeId, workflowVariables],
  )

  const errors: ValidationError[] = useMemo(() => {
    if (!def) return []
    return def.validate(localProps)
  }, [def, localProps])

  const errorCount = errors.filter((e) => e.severity === 'error').length
  const warningCount = errors.filter((e) => e.severity === 'warning').length

  const { prevNodes, nextNodes } = useMemo(() => {
    const prev = nodes.filter((n) =>
      edges.some((e) => e.target === nodeId && e.source === n.id),
    )
    const next = nodes.filter((n) =>
      edges.some((e) => e.source === nodeId && e.target === n.id),
    )
    return { prevNodes: prev, nextNodes: next }
  }, [nodes, edges, nodeId])

  const handlePropChange = useCallback(
    (key: string, value: unknown) => {
      setLocalProps((prev) => {
        const next = { ...prev, [key]: value }
        onNodeDataUpdate(nodeId, { config: next })
        return next
      })
    },
    [nodeId, onNodeDataUpdate],
  )

  const handleTitleBlur = useCallback(() => {
    if (title.trim()) onNodeDataUpdate(nodeId, { title: title.trim() })
  }, [nodeId, title, onNodeDataUpdate])

  const handleSubtitleBlur = useCallback(() => {
    onNodeDataUpdate(nodeId, { subtitle })
  }, [nodeId, subtitle, onNodeDataUpdate])

  const handleSave = useCallback(() => {
    onNodeDataUpdate(nodeId, { title, subtitle })
    handleTitleBlur()
    handleSubtitleBlur()
    onClose()
  }, [
    nodeId,
    title,
    subtitle,
    onNodeDataUpdate,
    onClose,
    handleTitleBlur,
    handleSubtitleBlur,
  ])

  const catConfig = def ? CATEGORY_CONFIG[def.identity?.category] : null
  const Icon: LucideIcon | undefined = def
    ? (ICON_MAP[def.identity?.icon ?? ''] ?? ICON_MAP['default'])
    : undefined

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dragState = useRef<{
    startX: number
    startY: number
    offsetX: number
    offsetY: number
  } | null>(null)

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        offsetX: dragOffset.x,
        offsetY: dragOffset.y,
      }
    },
    [dragOffset],
  )

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      setDragOffset({
        x: dragState.current.offsetX + dx,
        y: dragState.current.offsetY + dy,
      })
    }
    const handleDragEnd = () => {
      dragState.current = null
    }
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [])

  return {
    def,
    activeTab,
    setActiveTab,
    localProps,
    setLocalProps,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    availableVars,
    errors,
    errorCount,
    warningCount,
    prevNodes,
    nextNodes,
    handlePropChange,
    handleTitleBlur,
    handleSubtitleBlur,
    handleSave,
    catConfig,
    Icon,
    dragOffset,
    handleDragStart,
  }
}
