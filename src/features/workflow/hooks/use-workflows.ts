import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useWorkflowsControllerList,
  useWorkflowsControllerFindOne,
  useWorkflowsControllerCreate,
  getWorkflowsControllerListQueryKey,
  getWorkflowsControllerFindOneQueryKey,
  workflowsControllerSaveCanvas,
  workflowsControllerDelete,
} from '#/api/client'
import type { WorkflowSummaryDto } from '#/api/model/workflowSummaryDto'
import type { WorkflowDetailDto } from '#/api/model/workflowDetailDto'
import type { WorkflowNodeDto } from '#/api/model/workflowNodeDto'
import type { WorkflowEdgeDto } from '#/api/model/workflowEdgeDto'
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
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    status: (dto.status as WorkflowDetail['status']) ?? 'draft',
    nodes: dto.nodes.map(mapNode),
    edges: dto.edges.map(mapEdge),
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
    sourceHandle: dto.source_handle,
    type: dto.type,
  }
}

export function useWorkflows() {
  return useWorkflowsControllerList({
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
    }) => {
      const body = JSON.stringify({
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
          id: e.id,
          source_node_id: e.source,
          target_node_id: e.target,
          source_handle: e.sourceHandle,
          type: e.type ?? 'smoothstep',
        })),
      })

      const res = await workflowsControllerSaveCanvas(params.id, {
        body,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })

      return res
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
