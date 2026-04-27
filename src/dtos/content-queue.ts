// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Content Queue
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetContentQueueResponse = Array<{
  queueId: string
  postId: string
  /** Publishing platform */
  platform: string
  scheduledTime: string
  /** Queue status */
  status: string
  priority: number
  retryCount: number
  lastError?: string
  notes?: string
  createdAt: string
  updatedAt: string
}>

export interface GetContentQueueErrorResponse {
  error: string
  message: string
  details?: unknown
}

export interface PostContentQueueRequest {
  postId: string
  platform: string
  scheduledTime: string
  status?: string
  priority?: number
  retryCount?: number
  lastError?: string
  notes?: string
}

export interface PostContentQueueResponse {
  queueId: string
  postId: string
  /** Publishing platform */
  platform: string
  scheduledTime: string
  /** Queue status */
  status: string
  priority: number
  retryCount: number
  lastError?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface PostContentQueueErrorResponse {
  error: string
  message: string
  details?: unknown
}

export interface PatchContentQueueByContentIdStatusRequest {
  /** New queue status */
  status: string
}

export interface PatchContentQueueByContentIdStatusResponse {
  message: string
}

export interface PatchContentQueueByContentIdStatusErrorResponse {
  error: string
  message: string
  details?: unknown
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace ContentQueue {
  export type GetContentQueueResponse =
    import('./content-queue').GetContentQueueResponse
  export type GetContentQueueErrorResponse =
    import('./content-queue').GetContentQueueErrorResponse
  export type PostContentQueueRequest =
    import('./content-queue').PostContentQueueRequest
  export type PostContentQueueResponse =
    import('./content-queue').PostContentQueueResponse
  export type PostContentQueueErrorResponse =
    import('./content-queue').PostContentQueueErrorResponse
  export type PatchContentQueueByContentIdStatusRequest =
    import('./content-queue').PatchContentQueueByContentIdStatusRequest
  export type PatchContentQueueByContentIdStatusResponse =
    import('./content-queue').PatchContentQueueByContentIdStatusResponse
  export type PatchContentQueueByContentIdStatusErrorResponse =
    import('./content-queue').PatchContentQueueByContentIdStatusErrorResponse
}
