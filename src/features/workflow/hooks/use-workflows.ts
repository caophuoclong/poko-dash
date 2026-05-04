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
import type { WorkflowSummary, WorkflowDetail, WorkflowNodeData } from '../types'
import type { Node, Edge } from '@xyflow/react'

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
      config: dto.config as Record<string, unknown>,
    },
  }
}

function mapEdge(dto: WorkflowEdgeDto): Edge {
  return {
    id: dto.id,
    source: dto.source_node_id,
    target: dto.target_node_id,
    type: 'workflow-edge',
    data: { style: 'auto' },
    style: { stroke: 'var(--t-frost)', strokeWidth: 1.5 },
  }
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
      versionType?: SaveWorkflowCanvasBodyDtoVersionType
    }) => {
      const dto: Record<string, unknown> = {
        nodes: params.nodes.map((n) => ({
          xyflow_id: n.id,
          type: n.type ?? 'workflow-node',
          node_type_id: (n.data as WorkflowNodeData).nodeTypeId ?? '',
          position_x: n.position.x,
          position_y: n.position.y,
          title: (n.data as WorkflowNodeData).title,
          subtitle: (n.data as WorkflowNodeData).subtitle,
          icon: (n.data as WorkflowNodeData).icon,
          config: (n.data as WorkflowNodeData).config ?? {},
        })),
        edges: params.edges.map((e) => ({
          source_node_id: e.source,
          target_node_id: e.target,
          type: e.type ?? 'workflow-edge',
        })),
      }

      if (params.versionType) {
        dto.versionType = params.versionType
      }

      return workflowsControllerSaveCanvas(
        params.id,
        dto as Parameters<typeof workflowsControllerSaveCanvas>[1],
      )
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
    }) => {
      const dto: Record<string, unknown> = {
        nodes: params.nodes.map((n) => ({
          xyflow_id: n.id,
          type: n.type ?? 'workflow-node',
          node_type_id: (n.data as WorkflowNodeData).nodeTypeId ?? '',
          position_x: n.position.x,
          position_y: n.position.y,
          title: (n.data as WorkflowNodeData).title,
          subtitle: (n.data as WorkflowNodeData).subtitle,
          icon: (n.data as WorkflowNodeData).icon,
          config: (n.data as WorkflowNodeData).config ?? {},
        })),
        edges: params.edges.map((e) => ({
          source_node_id: e.source,
          target_node_id: e.target,
          type: e.type ?? 'workflow-edge',
        })),
        message: params.message || undefined,
        versionType: 'manual' as const,
      }

      return workflowsControllerSaveCanvas(
        params.id,
        dto as Parameters<typeof workflowsControllerSaveCanvas>[1],
      )
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowsControllerListVersionsQueryKey(variables.id),
      })
    },
  })
}
