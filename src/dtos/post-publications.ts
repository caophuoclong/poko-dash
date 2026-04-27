// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Post Publications
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetContentPostsByPostIdPublicationsResponse = Array<{
  publicationId: string;
  postId: string;
  /** Target platform (facebook, tiktok, instagram…) */
  platform: string;
  /** Target type within the platform (page_feed, reel, story…) */
  targetType: string | null;
  /** Platform-specific target ID (page ID, account ID…) */
  targetId: string | null;
  /** Human-readable target label */
  targetName: string | null;
  /** Lifecycle status of a single platform publication attempt */
  publishStatus: "pending" | "publishing" | "published" | "failed" | "cancelled";
  /** Post ID returned by the platform after publish */
  externalPostId: string | null;
  /** Public URL of the published post */
  externalUrl: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  /** Platform-specific error code on failure */
  errorCode: string | null;
  /** Human-readable error description */
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export interface GetContentPostsByPostIdPublicationsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostContentPostsByPostIdPublicationsRequest {
  /** Platform identifier */
  platform: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  scheduledFor?: string;
}

export interface PostContentPostsByPostIdPublicationsResponse {
  publicationId: string;
  postId: string;
  /** Target platform (facebook, tiktok, instagram…) */
  platform: string;
  /** Target type within the platform (page_feed, reel, story…) */
  targetType: string | null;
  /** Platform-specific target ID (page ID, account ID…) */
  targetId: string | null;
  /** Human-readable target label */
  targetName: string | null;
  /** Lifecycle status of a single platform publication attempt */
  publishStatus: "pending" | "publishing" | "published" | "failed" | "cancelled";
  /** Post ID returned by the platform after publish */
  externalPostId: string | null;
  /** Public URL of the published post */
  externalUrl: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  /** Platform-specific error code on failure */
  errorCode: string | null;
  /** Human-readable error description */
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  /** Media IDs uploaded to the platform (photos, videos) */
  externalMediaIds: Array<string>;
  /** Sanitised request payload sent to the platform API */
  requestPayload: Record<string, unknown> | null;
  /** Raw response payload from the platform API */
  responsePayload: Record<string, unknown> | null;
}

export interface PostContentPostsByPostIdPublicationsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface GetContentPostsByPostIdPublicationsByPubIdResponse {
  publicationId: string;
  postId: string;
  /** Target platform (facebook, tiktok, instagram…) */
  platform: string;
  /** Target type within the platform (page_feed, reel, story…) */
  targetType: string | null;
  /** Platform-specific target ID (page ID, account ID…) */
  targetId: string | null;
  /** Human-readable target label */
  targetName: string | null;
  /** Lifecycle status of a single platform publication attempt */
  publishStatus: "pending" | "publishing" | "published" | "failed" | "cancelled";
  /** Post ID returned by the platform after publish */
  externalPostId: string | null;
  /** Public URL of the published post */
  externalUrl: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  /** Platform-specific error code on failure */
  errorCode: string | null;
  /** Human-readable error description */
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  /** Media IDs uploaded to the platform (photos, videos) */
  externalMediaIds: Array<string>;
  /** Sanitised request payload sent to the platform API */
  requestPayload: Record<string, unknown> | null;
  /** Raw response payload from the platform API */
  responsePayload: Record<string, unknown> | null;
}

export interface GetContentPostsByPostIdPublicationsByPubIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface DeleteContentPostsByPostIdPublicationsByPubIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostContentPostsByPostIdPublicationsByPubIdSuccessRequest {
  externalPostId?: string;
  externalMediaIds?: Array<string>;
  externalUrl?: string;
  responsePayload?: Record<string, unknown>;
}

export interface PostContentPostsByPostIdPublicationsByPubIdSuccessResponse {
  publicationId: string;
  postId: string;
  /** Target platform (facebook, tiktok, instagram…) */
  platform: string;
  /** Target type within the platform (page_feed, reel, story…) */
  targetType: string | null;
  /** Platform-specific target ID (page ID, account ID…) */
  targetId: string | null;
  /** Human-readable target label */
  targetName: string | null;
  /** Lifecycle status of a single platform publication attempt */
  publishStatus: "pending" | "publishing" | "published" | "failed" | "cancelled";
  /** Post ID returned by the platform after publish */
  externalPostId: string | null;
  /** Public URL of the published post */
  externalUrl: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  /** Platform-specific error code on failure */
  errorCode: string | null;
  /** Human-readable error description */
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  /** Media IDs uploaded to the platform (photos, videos) */
  externalMediaIds: Array<string>;
  /** Sanitised request payload sent to the platform API */
  requestPayload: Record<string, unknown> | null;
  /** Raw response payload from the platform API */
  responsePayload: Record<string, unknown> | null;
}

export interface PostContentPostsByPostIdPublicationsByPubIdSuccessErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostContentPostsByPostIdPublicationsByPubIdFailureRequest {
  errorCode?: string;
  errorMessage: string;
  responsePayload?: Record<string, unknown>;
}

export interface PostContentPostsByPostIdPublicationsByPubIdFailureResponse {
  publicationId: string;
  postId: string;
  /** Target platform (facebook, tiktok, instagram…) */
  platform: string;
  /** Target type within the platform (page_feed, reel, story…) */
  targetType: string | null;
  /** Platform-specific target ID (page ID, account ID…) */
  targetId: string | null;
  /** Human-readable target label */
  targetName: string | null;
  /** Lifecycle status of a single platform publication attempt */
  publishStatus: "pending" | "publishing" | "published" | "failed" | "cancelled";
  /** Post ID returned by the platform after publish */
  externalPostId: string | null;
  /** Public URL of the published post */
  externalUrl: string | null;
  scheduledFor: string | null;
  publishedAt: string | null;
  /** Platform-specific error code on failure */
  errorCode: string | null;
  /** Human-readable error description */
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  /** Media IDs uploaded to the platform (photos, videos) */
  externalMediaIds: Array<string>;
  /** Sanitised request payload sent to the platform API */
  requestPayload: Record<string, unknown> | null;
  /** Raw response payload from the platform API */
  responsePayload: Record<string, unknown> | null;
}

export interface PostContentPostsByPostIdPublicationsByPubIdFailureErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostContentPostsByPostIdPublicationsByPubIdCancelErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace PostPublications {
  export type GetContentPostsByPostIdPublicationsResponse = import("./post-publications").GetContentPostsByPostIdPublicationsResponse;
  export type GetContentPostsByPostIdPublicationsErrorResponse = import("./post-publications").GetContentPostsByPostIdPublicationsErrorResponse;
  export type PostContentPostsByPostIdPublicationsRequest = import("./post-publications").PostContentPostsByPostIdPublicationsRequest;
  export type PostContentPostsByPostIdPublicationsResponse = import("./post-publications").PostContentPostsByPostIdPublicationsResponse;
  export type PostContentPostsByPostIdPublicationsErrorResponse = import("./post-publications").PostContentPostsByPostIdPublicationsErrorResponse;
  export type GetContentPostsByPostIdPublicationsByPubIdResponse = import("./post-publications").GetContentPostsByPostIdPublicationsByPubIdResponse;
  export type GetContentPostsByPostIdPublicationsByPubIdErrorResponse = import("./post-publications").GetContentPostsByPostIdPublicationsByPubIdErrorResponse;
  export type DeleteContentPostsByPostIdPublicationsByPubIdErrorResponse = import("./post-publications").DeleteContentPostsByPostIdPublicationsByPubIdErrorResponse;
  export type PostContentPostsByPostIdPublicationsByPubIdSuccessRequest = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdSuccessRequest;
  export type PostContentPostsByPostIdPublicationsByPubIdSuccessResponse = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdSuccessResponse;
  export type PostContentPostsByPostIdPublicationsByPubIdSuccessErrorResponse = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdSuccessErrorResponse;
  export type PostContentPostsByPostIdPublicationsByPubIdFailureRequest = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdFailureRequest;
  export type PostContentPostsByPostIdPublicationsByPubIdFailureResponse = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdFailureResponse;
  export type PostContentPostsByPostIdPublicationsByPubIdFailureErrorResponse = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdFailureErrorResponse;
  export type PostContentPostsByPostIdPublicationsByPubIdCancelErrorResponse = import("./post-publications").PostContentPostsByPostIdPublicationsByPubIdCancelErrorResponse;
}
