// layer: types
export type PromptType =
  | 'content_generation'
  | 'analysis'
  | 'refinement'
  | 'custom'
export type PromptCategory =
  | 'social_media'
  | 'blog'
  | 'video'
  | 'email'
  | 'general'
export type PromptStatus = 'active' | 'draft' | 'archived'
export type PromptRole = 'system' | 'user'

export interface Prompt {
  promptId: string
  name: string
  description?: string
  promptType: PromptType
  role: PromptRole
  category: PromptCategory
  template: string
  variables?: string[]
  tags?: string[]
  status: PromptStatus
  version: number
  parentPromptId?: string
  usageCount: number
  avgRating?: number
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreatePromptRequest {
  name: string
  description?: string
  promptType: PromptType
  role: PromptRole
  category: PromptCategory
  template: string
  variables?: string[]
  tags?: string[]
  status?: PromptStatus
  metadata?: Record<string, unknown>
}

export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {}

export interface RefinePromptRequest {
  changes: Partial<CreatePromptRequest>
}

export interface RatePromptRequest {
  rating: number
}

export interface CompilePromptRequest {
  variables: Record<string, unknown>
}

export interface CompilePromptResponse {
  compiled: string
}

export const PROMPT_TYPES: { value: PromptType; label: string }[] = [
  { value: 'content_generation', label: 'Content Generation' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'refinement', label: 'Refinement' },
  { value: 'custom', label: 'Custom' },
]

export const PROMPT_CATEGORIES: { value: PromptCategory; label: string }[] = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'blog', label: 'Blog' },
  { value: 'video', label: 'Video' },
  { value: 'email', label: 'Email' },
  { value: 'general', label: 'General' },
]

export const PROMPT_STATUSES: { value: PromptStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export const PROMPT_ROLES: {
  value: PromptRole
  label: string
  description: string
}[] = [
  { value: 'user', label: 'User', description: 'Task / instruction prompt' },
  {
    value: 'system',
    label: 'System',
    description: 'Behavior / context prompt',
  },
]

export const TYPE_LABELS: Record<string, string> = {
  content_generation: 'Content Gen',
  analysis: 'Analysis',
  refinement: 'Refinement',
  custom: 'Custom',
}

export const CATEGORY_LABELS: Record<string, string> = {
  social_media: 'Social',
  blog: 'Blog',
  video: 'Video',
  email: 'Email',
  general: 'General',
}
