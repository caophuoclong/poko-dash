import type { Edge } from '@xyflow/react'
import type { WorkflowEdgeDto } from '#/api/model/workflowEdgeDto'
import type { WorkflowEdgeInputDto } from '#/api/model/workflowEdgeInputDto'
import type { WorkflowEdgeInputDtoEdgeType } from '#/api/model/workflowEdgeInputDtoEdgeType'

type LogicalEdgeType =
  | 'default'
  | 'true'
  | 'false'
  | 'loop'
  | 'main'
  | 'error'
  | 'switch_case'
  | 'switch_default'

type CanvasEdgeData = {
  style?: string
  edgeType?: string
  logicalType?: LogicalEdgeType
}

function getLogicalType(edge: Edge): { type: LogicalEdgeType; edge_type?: WorkflowEdgeInputDtoEdgeType } {
  const data = (edge.data ?? {}) as CanvasEdgeData
  const marker = data.edgeType
  const sourceHandle = edge.sourceHandle ?? ''

  if (marker === 'condition_true') return { type: 'true' }
  if (marker === 'condition_false') return { type: 'false' }

  if (sourceHandle === 'default') return { type: 'switch_default' }
  if (sourceHandle.startsWith('case_')) return { type: 'switch_case' }

  if (marker === 'error' || sourceHandle === 'error') return { type: 'error', edge_type: 'error' }

  return { type: 'main', edge_type: 'main' }
}

function getCanvasEdgeType(type?: string, edgeType?: string, sourceHandle?: string): string | undefined {
  if (type === 'true') return 'condition_true'
  if (type === 'false') return 'condition_false'
  if (type === 'error' || edgeType === 'error' || sourceHandle === 'error') return 'error'
  return edgeType
}

export function mapCanvasEdgeToDtoEdge(edge: Edge): WorkflowEdgeInputDto {
  const route = getLogicalType(edge)
  return {
    source_node_id: edge.source,
    target_node_id: edge.target,
    source_handle: edge.sourceHandle ?? undefined,
    target_handle: edge.targetHandle ?? undefined,
    type: route.type,
    edge_type: route.edge_type,
    style: (edge.style as Record<string, unknown>) ?? undefined,
  }
}

export function mapDtoEdgeToCanvasEdge(dto: WorkflowEdgeDto): Edge {
  const edgeType = getCanvasEdgeType(dto.type, dto.edge_type, dto.source_handle)
  const data: CanvasEdgeData = {
    style: 'auto',
    logicalType: (dto.type as LogicalEdgeType) ?? 'main',
    edgeType,
  }

  return {
    id: dto.id,
    source: dto.source_node_id,
    target: dto.target_node_id,
    sourceHandle: dto.source_handle,
    targetHandle: dto.target_handle,
    type: 'workflow-edge',
    data,
    style: dto.style ?? { stroke: 'var(--t-frost)', strokeWidth: 1.5 },
  }
}
