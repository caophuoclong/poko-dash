import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useWorkflowsControllerList,
  useWorkflowsControllerFindOne,
  useWorkflowsControllerCreate,
  useWorkflowsControllerListVersions,
  getWorkflowsControllerListQueryKey,
  getWorkflowsControllerFindOneQueryKey,
  getWorkflowsControllerListVersionsQueryKey,
  workflowsControllerSaveCanvas,
  workflowsControllerDelete,
} from '#/api/client'
import type { WorkflowSummaryDto } from '#/api/model/workflowSummaryDto'
import type { WorkflowDetailDto } from '#/api/model/workflowDetailDto'
import type { WorkflowNodeDto } from '#/api/model/workflowNodeDto'
import type { WorkflowEdgeDto } from '#/api/model/workflowEdgeDto'
import type { SaveWorkflowCanvasBodyDtoVersionType } from '#/api/model/saveWorkflowCanvasBodyDtoVersionType'
import type {
  WorkflowSummary,
  WorkflowDetail,
  WorkflowNodeData,
  WorkflowVariable,
} from '../types'
import type { Node, Edge } from '@xyflow/react'
import {
  mapCanvasEdgeToDtoEdge,
  mapDtoEdgeToCanvasEdge,
} from '../utils/edge-mapping'

function mapSummary(dto: WorkflowSummaryDto): WorkflowSummary {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    status: (dto.status as WorkflowSummary['status']) ?? 'draft',
    nodeCount: dto.node_count,
    lastRunAt: dto.last_run_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

function mapDetail(dto: WorkflowDetailDto): WorkflowDetail {
  const mappingNodes = new Map(dto.nodes.map((n) => [n.id, n.xyflow_id]))
  const edges = dto.edges.map((e) => ({
    ...e,
    source_node_id: mappingNodes.get(e.source_node_id) ?? e.source_node_id,
    target_node_id: mappingNodes.get(e.target_node_id) ?? e.target_node_id,
  }))
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    status: (dto.status as WorkflowDetail['status']) ?? 'draft',
    nodes: dto.nodes.map(mapNode),
    edges: edges.map(mapEdge),
    variables: (dto as any).variables ?? [],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

function mapNode(dto: WorkflowNodeDto): Node<WorkflowNodeData> {
  return {
    id: dto.xyflow_id,
    type: 'workflow-node',
    position: { x: dto.position_x, y: dto.position_y },
    data: {
      title: dto.title ?? '',
      subtitle: dto.subtitle,
      icon: dto.icon,
      nodeTypeId: dto.node_type_id,
      status: (dto.status as WorkflowNodeData['status']) ?? 'pending',
      config: dto.config,
      originalId: dto.id,
    },
  }
}

function mapEdge(dto: WorkflowEdgeDto): Edge {
  return mapDtoEdgeToCanvasEdge(dto)
}

export function useWorkflows() {
  return useWorkflowsControllerList(undefined, {
    query: {
      select: (res) => {
        const data = res?.data as any
        const items = data?.data ?? data ?? []
        return Array.isArray(items) ? items.map(mapSummary) : []
      },
    },
  })
}

export function useWorkflow(workflowId: string) {
  return useWorkflowsControllerFindOne(workflowId, {
    query: {
      enabled: !!workflowId,
      select: (res: any) => {
        const data = res?.data ?? res
        return data ? mapDetail(data) : null
      },
    },
  })
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient()

  return useWorkflowsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getWorkflowsControllerListQueryKey(),
        })
      },
    },
  })
}

export function useSaveWorkflowCanvas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      id: string
      nodes: Node<WorkflowNodeData>[]
      edges: Edge[]
      variables?: WorkflowVariable[]
      versionType?: SaveWorkflowCanvasBodyDtoVersionType
    }) => {
      const dto: Record<string, unknown> = {
        nodes: params.nodes.map((n) => ({
          xyflow_id: n.id,
          type: n.type ?? 'workflow-node',
          node_type_id: n.data.nodeTypeId ?? '',
          position_x: n.position.x,
          position_y: n.position.y,
          title: n.data.title,
          subtitle: n.data.subtitle,
          icon: n.data.icon,
          config: n.data.config ?? {},
        })),
        edges: params.edges.map(mapCanvasEdgeToDtoEdge),
      }

      if (params.variables !== undefined) {
        dto.variables = params.variables
      }

      if (params.versionType) {
        dto.versionType = params.versionType
      }

      return workflowsControllerSaveCanvas(params.id, dto)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowsControllerFindOneQueryKey(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: getWorkflowsControllerListQueryKey(),
      })
    },
  })
}

export function useUpdateWorkflowVariables() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      id: string
      variables: WorkflowVariable[]
      nodes: Node<WorkflowNodeData>[]
      edges: Edge[]
    }) => {
      const dto: Record<string, unknown> = {
        nodes: params.nodes.map((n) => ({
          xyflow_id: n.id,
          type: n.type ?? 'workflow-node',
          node_type_id: n.data.nodeTypeId ?? '',
          position_x: n.position.x,
          position_y: n.position.y,
          title: n.data.title,
          subtitle: n.data.subtitle,
          icon: n.data.icon,
          config: n.data.config ?? {},
        })),
        edges: params.edges.map(mapCanvasEdgeToDtoEdge),
        variables: params.variables,
        versionType: 'auto' as const,
      }
      return workflowsControllerSaveCanvas(params.id, dto)
    },
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowsControllerFindOneQueryKey(params.id),
      })
    },
  })
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => workflowsControllerDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowsControllerListQueryKey(),
      })
    },
  })
}

export function useWorkflowVersions(workflowId: string) {
  return useWorkflowsControllerListVersions(workflowId, {
    query: {
      enabled: !!workflowId,
      select: (res: any) => {
        const data = res?.data ?? []
        return (Array.isArray(data) ? data : []).map((v: any) => ({
          id: v.id,
          versionNumber: v.version_number,
          message: v.message ?? '',
          versionType: v.version_type as 'auto' | 'manual',
          createdAt: v.created_at,
        }))
      },
    },
  })
}

export function useCreateWorkflowVersion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      id: string
      message: string
      nodes: Node<WorkflowNodeData>[]
      edges: Edge[]
      variables?: WorkflowVariable[]
    }) => {
      const dto: Record<string, unknown> = {
        nodes: params.nodes.map((n) => ({
          xyflow_id: n.id,
          type: n.type ?? 'workflow-node',
          node_type_id: n.data.nodeTypeId ?? '',
          position_x: n.position.x,
          position_y: n.position.y,
          title: n.data.title,
          subtitle: n.data.subtitle,
          icon: n.data.icon,
          config: n.data.config ?? {},
        })),
        edges: params.edges.map(mapCanvasEdgeToDtoEdge),
        message: params.message || undefined,
        versionType: 'manual' as const,
      }

      if (params.variables !== undefined) {
        dto.variables = params.variables
      }

      return workflowsControllerSaveCanvas(params.id, dto)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowsControllerListVersionsQueryKey(variables.id),
      })
    },
  })
}
