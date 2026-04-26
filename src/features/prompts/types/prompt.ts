export type PromptType = "content_generation" | "analysis" | "refinement" | "custom";
export type PromptCategory = "social_media" | "blog" | "video" | "email" | "general";
export type PromptStatus = "active" | "archived" | "draft";
export type PromptRole = "system" | "user";

export interface Prompt {
  promptId: string;
  name: string;
  description?: string;
  promptType: PromptType;
  role: PromptRole;
  category: PromptCategory;
  template: string;
  variables?: string[];
  tags?: string[];
  status: PromptStatus;
  version: number;
  parentPromptId?: string;
  usageCount: number;
  avgRating?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptRequest {
  name: string;
  description?: string;
  promptType: PromptType;
  role?: PromptRole;
  category: PromptCategory;
  template: string;
  variables?: string[];
  tags?: string[];
  status?: PromptStatus;
}

export interface UpdatePromptRequest {
  name?: string;
  description?: string;
  promptType?: PromptType;
  role?: PromptRole;
  category?: PromptCategory;
  template?: string;
  variables?: string[];
  tags?: string[];
  status?: PromptStatus;
}

export interface RefinePromptRequest {
  changes: {
    name?: string;
    description?: string;
    promptType?: PromptType;
    role?: PromptRole;
    category?: PromptCategory;
    template?: string;
    variables?: string[];
    tags?: string[];
    status?: PromptStatus;
    metadata?: Record<string, unknown>;
  };
}

export interface RatePromptRequest {
  rating: number;
}

export interface CompilePromptRequest {
  variables: Record<string, string>;
}

export interface CompilePromptResponse {
  compiled: string;
}
