// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Content Ideas
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
  '/api/content-ideas': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List content ideas (paginated)
     * @description Returns a paginated list of content ideas with related productIds and postIds for batch hydration.
     */
    get: operations['ContentIdeasController_listPaginated']
    put?: never
    /**
     * Create a new content idea
     * @description Add a new content idea for a specific platform and product
     */
    post: operations['ContentIdeasController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/content-ideas/{ideaId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get content idea by ID
     * @description Retrieve a single content idea by its UUID
     */
    get: operations['ContentIdeasController_findById']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /**
     * Update content idea
     * @description Update an existing content idea by ID
     */
    patch: operations['ContentIdeasController_update']
    trace?: never
  }
  '/api/content-ideas/generate': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Generate content ideas from products
     * @description Automatically generate content ideas based on available products and target platform
     */
    post: operations['ContentIdeasController_generateIdeas']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    CreateContentIdeaDto: {
      /**
       * @description Type of content idea
       * @enum {string}
       */
      ideaType:
        | 'review'
        | 'comparison'
        | 'roundup'
        | 'tutorial'
        | 'deal'
        | 'trending'
      /**
       * @description Category
       * @example fitness
       */
      category: string
      /**
       * @description Target platform
       * @enum {string}
       */
      targetPlatform: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'blog'
      /** @description Main title/hook */
      hook: string
      /** @description Content angle */
      angle?: string
      /** @description Associated product UUIDs */
      productIds?: string[]
      /**
       * @description Reference URLs
       * @default []
       */
      sourceRefs: string[]
      /**
       * @description Priority (1-10)
       * @default 5
       */
      priority: number
      /**
       * @description Idea status
       * @default draft
       * @enum {string}
       */
      status: 'draft' | 'approved' | 'queued' | 'produced' | 'rejected'
      /** @description Owner identifier */
      owner?: string
      /** @description Associated products with IDs */
      ideaProducts?: {
        productId?: string
      }[]
    }
    ContentIdeaResponseDto: {
      /** Format: uuid */
      ideaId: string
      /** @description Type of content idea */
      ideaType: string
      category: string
      /** @description Target platform */
      targetPlatform: string
      /** @description Main title/hook */
      hook: string
      /** @description Content angle */
      angle?: string
      /**
       * @description Reference URLs
       * @default []
       */
      sourceRefs: string[]
      /** @default 5 */
      priority: number
      /** @description Idea status */
      status: string
      owner?: string
      /** Format: date-time */
      createdAt: string
      /** Format: date-time */
      updatedAt: string
      /** @description Associated product UUIDs */
      ideaProducts?: string[]
      /** @description IDs of posts generated from this idea */
      postIds?: string[]
    }
    UpdateContentIdeaDto: {
      /**
       * @description Type of content idea
       * @enum {string}
       */
      ideaType?:
        | 'review'
        | 'comparison'
        | 'roundup'
        | 'tutorial'
        | 'deal'
        | 'trending'
      /** @description Category */
      category?: string
      /**
       * @description Target platform
       * @enum {string}
       */
      targetPlatform?: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'blog'
      /** @description Main title/hook */
      hook?: string
      /** @description Content angle */
      angle?: Record<string, never>
      /** @description Associated product UUIDs (replaces all) */
      ideaProducts?: string[]
      /** @description Reference URLs */
      sourceRefs?: string[]
      /** @description Priority (1-10) */
      priority?: number
      /**
       * @description Idea status
       * @enum {string}
       */
      status?: 'draft' | 'approved' | 'queued' | 'produced' | 'rejected'
      /** @description Owner identifier */
      owner?: Record<string, never>
    }
    GenerateIdeasDto: {
      /**
       * @description Target platform
       * @default tiktok
       * @enum {string}
       */
      platform: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'blog'
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  ContentIdeasController_listPaginated: {
    parameters: {
      query?: {
        /** @description Page number (default: 1) */
        page?: number
        /** @description Items per page (default: 20, max: 100) */
        page_size?: number
        /** @description Search across hook, angle, category */
        search?: string
        /** @description Sort column */
        sort_by?: 'priority' | 'createdAt' | 'updatedAt' | 'status'
        /** @description Sort direction */
        sort_order?: 'asc' | 'desc'
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Paginated list of content ideas */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Internal server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentIdeasController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateContentIdeaDto']
      }
    }
    responses: {
      /** @description Created content idea */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ContentIdeaResponseDto']
        }
      }
      /** @description Invalid payload */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Internal server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentIdeasController_findById: {
    parameters: {
      query?: never
      header?: never
      path: {
        ideaId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Content idea found */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ContentIdeaResponseDto']
        }
      }
      /** @description Content idea not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Internal server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentIdeasController_update: {
    parameters: {
      query?: never
      header?: never
      path: {
        ideaId: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateContentIdeaDto']
      }
    }
    responses: {
      /** @description Content idea updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid payload */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Content idea not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Internal server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentIdeasController_generateIdeas: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['GenerateIdeasDto']
      }
    }
    responses: {
      /** @description Generated ideas */
      202: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid payload */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Internal server error */
      500: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}

// ─── Convenience type aliases ──────────────────────────────────────────────
export type CreateContentIdeaDto = components['schemas']['CreateContentIdeaDto']
export type ContentIdeaResponseDto =
  components['schemas']['ContentIdeaResponseDto']
export type UpdateContentIdeaDto = components['schemas']['UpdateContentIdeaDto']
export type GenerateIdeasDto = components['schemas']['GenerateIdeasDto']

export type PostContentIdeasRequest =
  operations['ContentIdeasController_create']['requestBody']['content']['application/json']
export type PostContentIdeasResponse =
  operations['ContentIdeasController_create']['responses'][201]['content']['application/json']
export type GetContentIdeasByIdeaIdResponse =
  operations['ContentIdeasController_findById']['responses'][200]['content']['application/json']
export type PatchContentIdeasByIdeaIdRequest =
  operations['ContentIdeasController_update']['requestBody']['content']['application/json']
export type PostContentIdeasGenerateRequest =
  operations['ContentIdeasController_generateIdeas']['requestBody']['content']['application/json']
