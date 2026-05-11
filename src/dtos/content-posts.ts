// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Content Posts
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
  '/api/content-posts': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** List content posts (paginated) */
    get: operations['ContentPostsController_list']
    put?: never
    /** Create a new content post */
    post: operations['ContentPostsController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/content-posts/batch': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Batch lookup posts by IDs */
    post: operations['ContentPostsController_batch']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/content-posts/{postId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get content post by ID */
    get: operations['ContentPostsController_findById']
    put?: never
    post?: never
    /** Delete content post */
    delete: operations['ContentPostsController_delete']
    options?: never
    head?: never
    /** Update content post */
    patch: operations['ContentPostsController_patch']
    trace?: never
  }
  '/api/content-posts/generate': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Generate content posts from products */
    post: operations['ContentPostsController_generateFromProducts']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/content-posts/generate-from-idea/{ideaId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Generate content posts from idea */
    post: operations['ContentPostsController_generateFromIdea']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/content-posts/{postId}/status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /** Update content post status */
    patch: operations['ContentPostsController_updateStatus']
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    CreateContentPostDto: {
      /**
       * Format: uuid
       * @description Content Idea UUID
       */
      ideaId: string
      /**
       * Format: uuid
       * @description Primary Product UUID
       */
      primaryProductId: string
      /**
       * @description Content type
       * @enum {string}
       */
      contentType:
        | 'review'
        | 'comparison'
        | 'roundup'
        | 'tutorial'
        | 'deal'
        | 'trending'
      /** @description Platform identifier */
      platform: string
      /** @description Post title */
      title: string
      /** @description Post body/content */
      body: string
      /** @description Hashtags for the post */
      hashtags?: string[]
      /**
       * @description Content status
       * @default draft
       * @enum {string}
       */
      status: 'draft' | 'approved' | 'queued' | 'published' | 'archived'
      /**
       * @description Approval status
       * @enum {string}
       */
      approvalStatus?: 'pending' | 'approved' | 'rejected'
      /** @description Generation source identifier */
      generationSource?: string
      /** @description AI model used for generation */
      generationModel?: string
    }
    BatchRequestDto: {
      /** @description Array of IDs to look up (max 500) */
      ids: string[]
    }
    PatchContentPostDto: {
      /**
       * Format: uuid
       * @description Content Idea UUID
       */
      ideaId?: string
      /**
       * Format: uuid
       * @description Primary Product UUID
       */
      primaryProductId?: string
      /**
       * @description Content type
       * @enum {string}
       */
      contentType?:
        | 'review'
        | 'comparison'
        | 'roundup'
        | 'tutorial'
        | 'deal'
        | 'trending'
      /** @description Platform identifier */
      platform?: string
      /** @description Post title */
      title?: string
      /** @description Post body/content */
      body?: string
      /** @description Hashtags for the post */
      hashtags?: string[]
      /**
       * @description Content status
       * @enum {string}
       */
      status?: 'draft' | 'approved' | 'queued' | 'published' | 'archived'
      /**
       * @description Approval status
       * @enum {string}
       */
      approvalStatus?: 'pending' | 'approved' | 'rejected'
      /** @description Generation source identifier */
      generationSource?: string
      /** @description AI model used for generation */
      generationModel?: string
    }
    GenerateContentPostsDto: {
      /** @description Product UUIDs to generate posts for */
      productIds: string[]
      /**
       * @description Content type
       * @enum {string}
       */
      contentType:
        | 'review'
        | 'comparison'
        | 'roundup'
        | 'tutorial'
        | 'deal'
        | 'trending'
      /** @description Platform identifier */
      platform: string
    }
    UpdateContentPostStatusDto: {
      /**
       * @description New content status
       * @enum {string}
       */
      status: 'draft' | 'approved' | 'queued' | 'published' | 'archived'
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
  ContentPostsController_list: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Paginated list of content posts */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateContentPostDto']
      }
    }
    responses: {
      /** @description Created content post */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_batch: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['BatchRequestDto']
      }
    }
    responses: {
      /** @description Matched posts and not-found IDs */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_findById: {
    parameters: {
      query: {
        include: string
      }
      header?: never
      path: {
        postId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Content post detail */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_delete: {
    parameters: {
      query?: never
      header?: never
      path: {
        postId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Deleted */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_patch: {
    parameters: {
      query?: never
      header?: never
      path: {
        postId: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['PatchContentPostDto']
      }
    }
    responses: {
      /** @description Updated content post */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_generateFromProducts: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['GenerateContentPostsDto']
      }
    }
    responses: {
      /** @description Generated content posts */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_generateFromIdea: {
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
      /** @description Generated content posts */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Idea not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ContentPostsController_updateStatus: {
    parameters: {
      query?: never
      header?: never
      path: {
        postId: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateContentPostStatusDto']
      }
    }
    responses: {
      /** @description Status updated */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}

// ─── Convenience type aliases ──────────────────────────────────────────────
export type CreateContentPostDto = components['schemas']['CreateContentPostDto']
export type BatchRequestDto = components['schemas']['BatchRequestDto']
export type PatchContentPostDto = components['schemas']['PatchContentPostDto']
export type GenerateContentPostsDto =
  components['schemas']['GenerateContentPostsDto']
export type UpdateContentPostStatusDto =
  components['schemas']['UpdateContentPostStatusDto']

export type PostContentPostsRequest =
  operations['ContentPostsController_create']['requestBody']['content']['application/json']
export type PostContentPostsBatchRequest =
  operations['ContentPostsController_batch']['requestBody']['content']['application/json']
export type PatchContentPostsByPostIdRequest =
  operations['ContentPostsController_patch']['requestBody']['content']['application/json']
export type PostContentPostsGenerateRequest =
  operations['ContentPostsController_generateFromProducts']['requestBody']['content']['application/json']
export type PatchContentPostsByPostIdStatusRequest =
  operations['ContentPostsController_updateStatus']['requestBody']['content']['application/json']
