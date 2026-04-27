// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Content Posts
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetContentPostsResponse = Array<{
  _type: "summary";
  postId: string;
  title: string;
  platform: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  primaryProduct?: {
    productId: string;
    canonicalTitle: string;
    imageCover?: string;
  };
}>;

export interface GetContentPostsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostContentPostsRequest {
  ideaId?: string;
  primaryProductId: string;
  supportingProductIds?: Array<string>;
  contentType: string;
  platform: string;
  title: string;
  body: string;
  hashtags?: Array<string>;
  status: string;
  approvalStatus?: string;
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
}

export interface PostContentPostsResponse {
  postId: string;
  ideaId?: string;
  primaryProductId: string;
  /** Type of content */
  contentType: string;
  /** Publishing platform */
  platform: string;
  title: string;
  body: string;
  hashtags?: Array<string>;
  /** Content status */
  status: string;
  /** Approval status */
  approvalStatus?: string;
  /** Publish status */
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostContentPostsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface GetContentPostsByPostIdResponse {
  _type: "detail";
  postId: string;
  ideaId?: string;
  primaryProductId: string;
  /** Type of content */
  contentType: string;
  /** Publishing platform */
  platform: string;
  title: string;
  body: string;
  hashtags?: Array<string>;
  /** Content status */
  status: string;
  /** Approval status */
  approvalStatus?: string;
  /** Publish status */
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
  createdAt: string;
  updatedAt: string;
  primaryProduct?: {
    /** Unique product identifier */
    productId: string;
    /** Product title */
    canonicalTitle: string;
    /** Product brand */
    brand?: string;
    /** Primary category */
    category: string;
    /** Sub-category */
    subCategory?: string;
    /** Key specifications */
    specsKeyFacts?: string;
    /** Current price (decimal as string) */
    priceCurrent?: string;
    /** Sale price (decimal as string) */
    priceSale?: string;
    /** Currency code */
    currency?: string;
    /** Product rating 0.0-5.0 */
    rating?: number;
    /** Number of reviews */
    reviewCount?: number;
    /** Source URL */
    sourceBestUrl: string;
    /** Cover image URL */
    imageCover?: string;
    /** Semicolon-separated image URLs */
    imageVariants?: string;
    /** Video URL */
    videoUrl?: string;
    /** Semicolon-separated description image URLs */
    descriptionImages?: string;
    /** Internal notes */
    notes?: string;
    /** Product variants */
    variants?: string;
    /** Availability status */
    availability?: string;
    /** Seller name */
    sellerName?: string;
    /** Deal quality score */
    dealScore: number;
    /** Publish priority score */
    publishScore: number;
    /** Freshness expiry date */
    freshUntil?: string;
    /** Product status */
    status: "active" | "processing" | "done" | "failed";
    createdAt: string;
    updatedAt: string;
    affiliateProduct?: {
      linkId: string;
      productId: string;
      merchant: string;
      originalUrl: string;
      affiliateUrl: string;
      shortUrl?: string;
      platform: string;
      commissionRate?: number;
      couponCode?: string;
      deeplinkStatus: "valid" | "broken" | "pending" | "expired";
      active: boolean;
      createdAt: string;
    };
  };
  supportingProducts?: Array<{
    /** Unique product identifier */
    productId: string;
    /** Product title */
    canonicalTitle: string;
    /** Product brand */
    brand?: string;
    /** Primary category */
    category: string;
    /** Sub-category */
    subCategory?: string;
    /** Key specifications */
    specsKeyFacts?: string;
    /** Current price (decimal as string) */
    priceCurrent?: string;
    /** Sale price (decimal as string) */
    priceSale?: string;
    /** Currency code */
    currency?: string;
    /** Product rating 0.0-5.0 */
    rating?: number;
    /** Number of reviews */
    reviewCount?: number;
    /** Source URL */
    sourceBestUrl: string;
    /** Cover image URL */
    imageCover?: string;
    /** Semicolon-separated image URLs */
    imageVariants?: string;
    /** Video URL */
    videoUrl?: string;
    /** Semicolon-separated description image URLs */
    descriptionImages?: string;
    /** Internal notes */
    notes?: string;
    /** Product variants */
    variants?: string;
    /** Availability status */
    availability?: string;
    /** Seller name */
    sellerName?: string;
    /** Deal quality score */
    dealScore: number;
    /** Publish priority score */
    publishScore: number;
    /** Freshness expiry date */
    freshUntil?: string;
    /** Product status */
    status: "active" | "processing" | "done" | "failed";
    createdAt: string;
    updatedAt: string;
    affiliateProduct?: {
      linkId: string;
      productId: string;
      merchant: string;
      originalUrl: string;
      affiliateUrl: string;
      shortUrl?: string;
      platform: string;
      commissionRate?: number;
      couponCode?: string;
      deeplinkStatus: "valid" | "broken" | "pending" | "expired";
      active: boolean;
      createdAt: string;
    };
  }>;
  idea?: {
    ideaId: string;
    ideaType: string;
    category: string;
    targetPlatform: string;
    hook: string;
    angle?: string;
    status: string;
    priority: number;
    createdAt: string;
  };
}

export interface GetContentPostsByPostIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PatchContentPostsByPostIdRequest {
  ideaId?: string;
  primaryProductId?: string;
  supportingProductIds?: Array<string>;
  contentType?: string;
  platform?: string;
  title?: string;
  body?: string;
  hashtags?: Array<string>;
  status?: string;
  approvalStatus?: string;
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
}

export interface PatchContentPostsByPostIdResponse {
  postId: string;
  ideaId?: string;
  primaryProductId: string;
  /** Type of content */
  contentType: string;
  /** Publishing platform */
  platform: string;
  title: string;
  body: string;
  hashtags?: Array<string>;
  /** Content status */
  status: string;
  /** Approval status */
  approvalStatus?: string;
  /** Publish status */
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatchContentPostsByPostIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface DeleteContentPostsByPostIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostContentPostsGenerateRequest {
  /** Semicolon-separated product UUIDs */
  productIds?: string;
  platform?: "blog" | "youtube" | "tiktok" | "instagram" | "twitter";
}

export type PostContentPostsGenerateResponse = Array<{
  postId: string;
  ideaId?: string;
  primaryProductId: string;
  /** Type of content */
  contentType: string;
  /** Publishing platform */
  platform: string;
  title: string;
  body: string;
  hashtags?: Array<string>;
  /** Content status */
  status: string;
  /** Approval status */
  approvalStatus?: string;
  /** Publish status */
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
  createdAt: string;
  updatedAt: string;
}>;

export interface PostContentPostsGenerateErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export type PostContentPostsGenerateFromIdeaByIdeaIdResponse = Array<{
  postId: string;
  ideaId?: string;
  primaryProductId: string;
  /** Type of content */
  contentType: string;
  /** Publishing platform */
  platform: string;
  title: string;
  body: string;
  hashtags?: Array<string>;
  /** Content status */
  status: string;
  /** Approval status */
  approvalStatus?: string;
  /** Publish status */
  publishStatus?: string;
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
  generationSource?: string;
  generationModel?: string;
  createdAt: string;
  updatedAt: string;
}>;

export interface PostContentPostsGenerateFromIdeaByIdeaIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PatchContentPostsByPostIdStatusRequest {
  /** New publish status */
  publishStatus: string;
}

export interface PatchContentPostsByPostIdStatusResponse {
  message: string;
}

export interface PatchContentPostsByPostIdStatusErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace ContentPosts {
  export type GetContentPostsResponse = import("./content-posts").GetContentPostsResponse;
  export type GetContentPostsErrorResponse = import("./content-posts").GetContentPostsErrorResponse;
  export type PostContentPostsRequest = import("./content-posts").PostContentPostsRequest;
  export type PostContentPostsResponse = import("./content-posts").PostContentPostsResponse;
  export type PostContentPostsErrorResponse = import("./content-posts").PostContentPostsErrorResponse;
  export type GetContentPostsByPostIdResponse = import("./content-posts").GetContentPostsByPostIdResponse;
  export type GetContentPostsByPostIdErrorResponse = import("./content-posts").GetContentPostsByPostIdErrorResponse;
  export type PatchContentPostsByPostIdRequest = import("./content-posts").PatchContentPostsByPostIdRequest;
  export type PatchContentPostsByPostIdResponse = import("./content-posts").PatchContentPostsByPostIdResponse;
  export type PatchContentPostsByPostIdErrorResponse = import("./content-posts").PatchContentPostsByPostIdErrorResponse;
  export type DeleteContentPostsByPostIdErrorResponse = import("./content-posts").DeleteContentPostsByPostIdErrorResponse;
  export type PostContentPostsGenerateRequest = import("./content-posts").PostContentPostsGenerateRequest;
  export type PostContentPostsGenerateResponse = import("./content-posts").PostContentPostsGenerateResponse;
  export type PostContentPostsGenerateErrorResponse = import("./content-posts").PostContentPostsGenerateErrorResponse;
  export type PostContentPostsGenerateFromIdeaByIdeaIdResponse = import("./content-posts").PostContentPostsGenerateFromIdeaByIdeaIdResponse;
  export type PostContentPostsGenerateFromIdeaByIdeaIdErrorResponse = import("./content-posts").PostContentPostsGenerateFromIdeaByIdeaIdErrorResponse;
  export type PatchContentPostsByPostIdStatusRequest = import("./content-posts").PatchContentPostsByPostIdStatusRequest;
  export type PatchContentPostsByPostIdStatusResponse = import("./content-posts").PatchContentPostsByPostIdStatusResponse;
  export type PatchContentPostsByPostIdStatusErrorResponse = import("./content-posts").PatchContentPostsByPostIdStatusErrorResponse;
}
