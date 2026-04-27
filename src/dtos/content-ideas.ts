// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Content Ideas
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetContentIdeasResponse = Array<{
  ideaId: string
  /** Type of content idea */
  ideaType: string
  category: string
  /** Target platform */
  targetPlatform: string
  /** Main title/hook */
  hook: string
  /** Content angle */
  angle?: string
  /** Reference URLs */
  sourceRefs: Array<string>
  priority: number
  /** Idea status */
  status: string
  owner?: string
  createdAt: string
  updatedAt: string
  /** Associated product UUIDs */
  ideaProducts?: Array<string>
  /** IDs of posts generated from this idea */
  postIds?: Array<string>
}>

export interface GetContentIdeasErrorResponse {
  error: string
  message: string
  details?: unknown
}

export interface PostContentIdeasRequest {
  ideaType: string
  category: string
  targetPlatform: string
  hook: string
  angle?: string
  sourceRefs?: Array<string>
  priority?: number
  status?: string
  owner?: string
  productIds?: Array<string>
}

export interface PostContentIdeasResponse {
  ideaId: string
  /** Type of content idea */
  ideaType: string
  category: string
  /** Target platform */
  targetPlatform: string
  /** Main title/hook */
  hook: string
  /** Content angle */
  angle?: string
  /** Reference URLs */
  sourceRefs: Array<string>
  priority: number
  /** Idea status */
  status: string
  owner?: string
  createdAt: string
  updatedAt: string
  /** Associated product UUIDs */
  ideaProducts?: Array<string>
  /** IDs of posts generated from this idea */
  postIds?: Array<string>
}

export interface PostContentIdeasErrorResponse {
  error: string
  message: string
  details?: unknown
}

export interface GetContentIdeasByIdeaIdResponse {
  ideaId: string
  /** Type of content idea */
  ideaType: string
  category: string
  /** Target platform */
  targetPlatform: string
  /** Main title/hook */
  hook: string
  /** Content angle */
  angle?: string
  /** Reference URLs */
  sourceRefs: Array<string>
  priority: number
  /** Idea status */
  status: string
  owner?: string
  createdAt: string
  updatedAt: string
  /** Associated product UUIDs */
  ideaProducts?: Array<string>
  /** IDs of posts generated from this idea */
  postIds?: Array<string>
}

export interface GetContentIdeasByIdeaIdErrorResponse {
  error: string
  message: string
  details?: unknown
}

export interface PatchContentIdeasByIdeaIdRequest {
  ideaType?: string
  category?: string
  targetPlatform?: string
  hook?: string
  angle?: string
  sourceRefs?: Array<string>
  priority?: number
  status?: string
  owner?: string
  productIds?: Array<string>
}

export interface PatchContentIdeasByIdeaIdResponse {
  message: string
}

export interface PatchContentIdeasByIdeaIdErrorResponse {
  error: string
  message: string
  details?: unknown
}

export interface PostContentIdeasGenerateRequest {
  platform: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'blog'
}

export interface PostContentIdeasGenerateResponse {
  /** Number of ideas generated */
  generated: number
  ideas: Array<{
    ideaId: string
    /** Type of content idea */
    ideaType: string
    category: string
    /** Target platform */
    targetPlatform: string
    /** Main title/hook */
    hook: string
    /** Content angle */
    angle?: string
    /** Reference URLs */
    sourceRefs: Array<string>
    priority: number
    /** Idea status */
    status: string
    owner?: string
    createdAt: string
    updatedAt: string
    /** Associated product UUIDs */
    ideaProducts?: Array<string>
    /** IDs of posts generated from this idea */
    postIds?: Array<string>
  }>
}

export interface PostContentIdeasGenerateErrorResponse {
  error: string
  message: string
  details?: unknown
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace ContentIdeas {
  export type GetContentIdeasResponse =
    import('./content-ideas').GetContentIdeasResponse
  export type GetContentIdeasErrorResponse =
    import('./content-ideas').GetContentIdeasErrorResponse
  export type PostContentIdeasRequest =
    import('./content-ideas').PostContentIdeasRequest
  export type PostContentIdeasResponse =
    import('./content-ideas').PostContentIdeasResponse
  export type PostContentIdeasErrorResponse =
    import('./content-ideas').PostContentIdeasErrorResponse
  export type GetContentIdeasByIdeaIdResponse =
    import('./content-ideas').GetContentIdeasByIdeaIdResponse
  export type GetContentIdeasByIdeaIdErrorResponse =
    import('./content-ideas').GetContentIdeasByIdeaIdErrorResponse
  export type PatchContentIdeasByIdeaIdRequest =
    import('./content-ideas').PatchContentIdeasByIdeaIdRequest
  export type PatchContentIdeasByIdeaIdResponse =
    import('./content-ideas').PatchContentIdeasByIdeaIdResponse
  export type PatchContentIdeasByIdeaIdErrorResponse =
    import('./content-ideas').PatchContentIdeasByIdeaIdErrorResponse
  export type PostContentIdeasGenerateRequest =
    import('./content-ideas').PostContentIdeasGenerateRequest
  export type PostContentIdeasGenerateResponse =
    import('./content-ideas').PostContentIdeasGenerateResponse
  export type PostContentIdeasGenerateErrorResponse =
    import('./content-ideas').PostContentIdeasGenerateErrorResponse
}
