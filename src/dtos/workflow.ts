// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Workflow
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface GetWorkflowsResponse {
  data: Array<{
    id: string
    name: string
    definition: {
      nodes: Array<{
        id: string
        type: string
        label: string
        config: Record<string, unknown>
        position: {
          x: number
          y: number
        }
      }>
      edges: Array<{
        id: string
        from: string
        to: string
        label?: string
      }>
    }
    trigger_type: 'manual' | 'cron' | 'webhook' | 'db_event'
    cron_expr: string | null
    webhook_token: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }>
  total: number
  limit: number
  offset: number
}

export interface PostWorkflowsRequest {
  name: string
  trigger_type: 'manual' | 'cron' | 'webhook' | 'db_event'
}

export interface PostWorkflowsResponse {
  id: string
  name: string
  definition: {
    nodes: Array<{
      id: string
      type: string
      label: string
      config: Record<string, unknown>
      position: {
        x: number
        y: number
      }
    }>
    edges: Array<{
      id: string
      from: string
      to: string
      label?: string
    }>
  }
  trigger_type: 'manual' | 'cron' | 'webhook' | 'db_event'
  cron_expr: string | null
  webhook_token: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GetWorkflowsByIdResponse {
  id: string
  name: string
  definition: {
    nodes: Array<{
      id: string
      type: string
      label: string
      config: Record<string, unknown>
      position: {
        x: number
        y: number
      }
    }>
    edges: Array<{
      id: string
      from: string
      to: string
      label?: string
    }>
  }
  trigger_type: 'manual' | 'cron' | 'webhook' | 'db_event'
  cron_expr: string | null
  webhook_token: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PutWorkflowsByIdRequest {
  name?: string
  definition?: {
    nodes: Array<{
      id: string
      type: string
      label: string
      config: Record<string, unknown>
      position: {
        x: number
        y: number
      }
    }>
    edges: Array<{
      id: string
      from: string
      to: string
      label?: string
    }>
  }
  trigger_type?: 'manual' | 'cron' | 'webhook' | 'db_event'
  cron_expr?: string
  is_active?: boolean
}

export interface PutWorkflowsByIdResponse {
  id: string
  name: string
  definition: {
    nodes: Array<{
      id: string
      type: string
      label: string
      config: Record<string, unknown>
      position: {
        x: number
        y: number
      }
    }>
    edges: Array<{
      id: string
      from: string
      to: string
      label?: string
    }>
  }
  trigger_type: 'manual' | 'cron' | 'webhook' | 'db_event'
  cron_expr: string | null
  webhook_token: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PostWorkflowsByIdRunRequest {
  input?: Record<string, unknown>
}

export interface PostWorkflowsByIdRunResponse {
  execution_id: string
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace Workflow {
  export type GetWorkflowsResponse = import('./workflow').GetWorkflowsResponse
  export type PostWorkflowsRequest = import('./workflow').PostWorkflowsRequest
  export type PostWorkflowsResponse = import('./workflow').PostWorkflowsResponse
  export type GetWorkflowsByIdResponse =
    import('./workflow').GetWorkflowsByIdResponse
  export type PutWorkflowsByIdRequest =
    import('./workflow').PutWorkflowsByIdRequest
  export type PutWorkflowsByIdResponse =
    import('./workflow').PutWorkflowsByIdResponse
  export type PostWorkflowsByIdRunRequest =
    import('./workflow').PostWorkflowsByIdRunRequest
  export type PostWorkflowsByIdRunResponse =
    import('./workflow').PostWorkflowsByIdRunResponse
}
