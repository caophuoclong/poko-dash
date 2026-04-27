// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Prompts
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetPromptsResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostPromptsRequest {
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status?: "active" | "archived" | "draft";
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface PostPromptsResponse {
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PostPromptsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface GetPromptsByPromptIdResponse {
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GetPromptsByPromptIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PatchPromptsByPromptIdRequest {
  /** Prompt name */
  name?: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType?: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role?: "system" | "user";
  /** Prompt category */
  category?: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template?: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status?: "active" | "archived" | "draft";
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface PatchPromptsByPromptIdResponse {
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PatchPromptsByPromptIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface DeletePromptsByPromptIdResponse {
  message: string;
}

export interface DeletePromptsByPromptIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostPromptsByPromptIdRefineRequest {
  changes: {
    /** Prompt name */
    name?: string;
    /** Prompt description */
    description?: string;
    /** Type of prompt */
    promptType?: "content_generation" | "analysis" | "refinement" | "custom";
    /** Prompt role: system (behavior/context) or user (task) */
    role?: "system" | "user";
    /** Prompt category */
    category?: "social_media" | "blog" | "video" | "email" | "general";
    /** The prompt template with {{variable}} placeholders */
    template?: string;
    /** Array of variable names used in template */
    variables?: Array<string>;
    /** Tags for filtering/searching */
    tags?: Array<string>;
    /** Prompt status */
    status?: "active" | "archived" | "draft";
    /** Additional metadata */
    metadata?: Record<string, unknown>;
  };
}

export interface PostPromptsByPromptIdRefineResponse {
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PostPromptsByPromptIdRefineErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostPromptsByPromptIdRateRequest {
  /** Rating (0-5 stars) */
  rating: number;
}

export interface PostPromptsByPromptIdRateResponse {
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PostPromptsByPromptIdRateErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostPromptsByPromptIdUsageResponse {
  message: string;
}

export interface PostPromptsByPromptIdUsageErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostPromptsByPromptIdCompileRequest {
  /** Variable values to fill in template */
  variables: Record<string, unknown>;
}

export interface PostPromptsByPromptIdCompileResponse {
  /** The compiled prompt with variables filled in */
  compiled: string;
}

export interface PostPromptsByPromptIdCompileErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface GetPromptsByPromptIdVersionsResponse {
  /** All versions of the prompt */
  versions: Array<{
    /** Unique prompt identifier */
    promptId: string;
    /** Prompt name */
    name: string;
    /** Prompt description */
    description?: string;
    /** Type of prompt */
    promptType: "content_generation" | "analysis" | "refinement" | "custom";
    /** Prompt role: system (behavior/context) or user (task) */
    role: "system" | "user";
    /** Prompt category */
    category: "social_media" | "blog" | "video" | "email" | "general";
    /** The prompt template with {{variable}} placeholders */
    template: string;
    /** Array of variable names used in template */
    variables?: Array<string>;
    /** Tags for filtering/searching */
    tags?: Array<string>;
    /** Prompt status */
    status: "active" | "archived" | "draft";
    /** Version number */
    version: number;
    /** Parent prompt ID for version history */
    parentPromptId?: string;
    /** Number of times this prompt was used */
    usageCount: number;
    /** Average rating (0-5) */
    avgRating?: number;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface GetPromptsByPromptIdVersionsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type GetPromptsSearchResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsSearchErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type GetPromptsTrendingMostUsedResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsTrendingMostUsedErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type GetPromptsTrendingHighestRatedResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsTrendingHighestRatedErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type GetPromptsTypeByTypeResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsTypeByTypeErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type GetPromptsRoleByRoleResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsRoleByRoleErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type GetPromptsCategoryByCategoryResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetPromptsCategoryByCategoryErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostPromptsByTagsRequest {
  tags: Array<string>;
}

export type PostPromptsByTagsResponse = Array<{
  /** Unique prompt identifier */
  promptId: string;
  /** Prompt name */
  name: string;
  /** Prompt description */
  description?: string;
  /** Type of prompt */
  promptType: "content_generation" | "analysis" | "refinement" | "custom";
  /** Prompt role: system (behavior/context) or user (task) */
  role: "system" | "user";
  /** Prompt category */
  category: "social_media" | "blog" | "video" | "email" | "general";
  /** The prompt template with {{variable}} placeholders */
  template: string;
  /** Array of variable names used in template */
  variables?: Array<string>;
  /** Tags for filtering/searching */
  tags?: Array<string>;
  /** Prompt status */
  status: "active" | "archived" | "draft";
  /** Version number */
  version: number;
  /** Parent prompt ID for version history */
  parentPromptId?: string;
  /** Number of times this prompt was used */
  usageCount: number;
  /** Average rating (0-5) */
  avgRating?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}>;

export interface PostPromptsByTagsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace Prompts {
  export type GetPromptsResponse = import("./prompts").GetPromptsResponse;
  export type GetPromptsErrorResponse = import("./prompts").GetPromptsErrorResponse;
  export type PostPromptsRequest = import("./prompts").PostPromptsRequest;
  export type PostPromptsResponse = import("./prompts").PostPromptsResponse;
  export type PostPromptsErrorResponse = import("./prompts").PostPromptsErrorResponse;
  export type GetPromptsByPromptIdResponse = import("./prompts").GetPromptsByPromptIdResponse;
  export type GetPromptsByPromptIdErrorResponse = import("./prompts").GetPromptsByPromptIdErrorResponse;
  export type PatchPromptsByPromptIdRequest = import("./prompts").PatchPromptsByPromptIdRequest;
  export type PatchPromptsByPromptIdResponse = import("./prompts").PatchPromptsByPromptIdResponse;
  export type PatchPromptsByPromptIdErrorResponse = import("./prompts").PatchPromptsByPromptIdErrorResponse;
  export type DeletePromptsByPromptIdResponse = import("./prompts").DeletePromptsByPromptIdResponse;
  export type DeletePromptsByPromptIdErrorResponse = import("./prompts").DeletePromptsByPromptIdErrorResponse;
  export type PostPromptsByPromptIdRefineRequest = import("./prompts").PostPromptsByPromptIdRefineRequest;
  export type PostPromptsByPromptIdRefineResponse = import("./prompts").PostPromptsByPromptIdRefineResponse;
  export type PostPromptsByPromptIdRefineErrorResponse = import("./prompts").PostPromptsByPromptIdRefineErrorResponse;
  export type PostPromptsByPromptIdRateRequest = import("./prompts").PostPromptsByPromptIdRateRequest;
  export type PostPromptsByPromptIdRateResponse = import("./prompts").PostPromptsByPromptIdRateResponse;
  export type PostPromptsByPromptIdRateErrorResponse = import("./prompts").PostPromptsByPromptIdRateErrorResponse;
  export type PostPromptsByPromptIdUsageResponse = import("./prompts").PostPromptsByPromptIdUsageResponse;
  export type PostPromptsByPromptIdUsageErrorResponse = import("./prompts").PostPromptsByPromptIdUsageErrorResponse;
  export type PostPromptsByPromptIdCompileRequest = import("./prompts").PostPromptsByPromptIdCompileRequest;
  export type PostPromptsByPromptIdCompileResponse = import("./prompts").PostPromptsByPromptIdCompileResponse;
  export type PostPromptsByPromptIdCompileErrorResponse = import("./prompts").PostPromptsByPromptIdCompileErrorResponse;
  export type GetPromptsByPromptIdVersionsResponse = import("./prompts").GetPromptsByPromptIdVersionsResponse;
  export type GetPromptsByPromptIdVersionsErrorResponse = import("./prompts").GetPromptsByPromptIdVersionsErrorResponse;
  export type GetPromptsSearchResponse = import("./prompts").GetPromptsSearchResponse;
  export type GetPromptsSearchErrorResponse = import("./prompts").GetPromptsSearchErrorResponse;
  export type GetPromptsTrendingMostUsedResponse = import("./prompts").GetPromptsTrendingMostUsedResponse;
  export type GetPromptsTrendingMostUsedErrorResponse = import("./prompts").GetPromptsTrendingMostUsedErrorResponse;
  export type GetPromptsTrendingHighestRatedResponse = import("./prompts").GetPromptsTrendingHighestRatedResponse;
  export type GetPromptsTrendingHighestRatedErrorResponse = import("./prompts").GetPromptsTrendingHighestRatedErrorResponse;
  export type GetPromptsTypeByTypeResponse = import("./prompts").GetPromptsTypeByTypeResponse;
  export type GetPromptsTypeByTypeErrorResponse = import("./prompts").GetPromptsTypeByTypeErrorResponse;
  export type GetPromptsRoleByRoleResponse = import("./prompts").GetPromptsRoleByRoleResponse;
  export type GetPromptsRoleByRoleErrorResponse = import("./prompts").GetPromptsRoleByRoleErrorResponse;
  export type GetPromptsCategoryByCategoryResponse = import("./prompts").GetPromptsCategoryByCategoryResponse;
  export type GetPromptsCategoryByCategoryErrorResponse = import("./prompts").GetPromptsCategoryByCategoryErrorResponse;
  export type PostPromptsByTagsRequest = import("./prompts").PostPromptsByTagsRequest;
  export type PostPromptsByTagsResponse = import("./prompts").PostPromptsByTagsResponse;
  export type PostPromptsByTagsErrorResponse = import("./prompts").PostPromptsByTagsErrorResponse;
}
