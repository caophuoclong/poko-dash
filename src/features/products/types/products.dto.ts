// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Products
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetProductsResponse = Array<{
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
}>;

export interface GetProductsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostProductsRequest {
  /** Product title */
  canonicalTitle: string;
  /** Product brand */
  brand?: string;
  /** Primary category */
  category: string;
  subCategory?: string;
  specsKeyFacts?: string;
  priceCurrent?: string;
  priceSale?: string;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  sourceBestUrl: string;
  imageCover?: string;
  imageVariants?: string;
  videoUrl?: string;
  descriptionImages?: string;
  notes?: string;
  variants?: string;
  availability?: string;
  sellerName?: string;
  dealScore: number;
  publishScore: number;
  freshUntil?: string;
  status: "active" | "processing" | "done" | "failed";
}

export interface PostProductsResponse {
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
}

export interface PostProductsErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface GetProductsByProductIdResponse {
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
}

export interface GetProductsByProductIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PatchProductsByProductIdRequest {
  /** Product title */
  canonicalTitle?: string;
  /** Product brand */
  brand?: string;
  /** Primary category */
  category?: string;
  subCategory?: string;
  specsKeyFacts?: string;
  priceCurrent?: string;
  priceSale?: string;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  sourceBestUrl?: string;
  imageCover?: string;
  imageVariants?: string;
  videoUrl?: string;
  descriptionImages?: string;
  notes?: string;
  variants?: string;
  availability?: string;
  sellerName?: string;
  dealScore?: number;
  publishScore?: number;
  freshUntil?: string;
  status?: "active" | "processing" | "done" | "failed";
}

export interface PatchProductsByProductIdResponse {
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
}

export interface PatchProductsByProductIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface DeleteProductsByProductIdResponse {
  message: string;
}

export interface DeleteProductsByProductIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace Products {
  export type GetProductsResponse = import("./products").GetProductsResponse;
  export type GetProductsErrorResponse = import("./products").GetProductsErrorResponse;
  export type PostProductsRequest = import("./products").PostProductsRequest;
  export type PostProductsResponse = import("./products").PostProductsResponse;
  export type PostProductsErrorResponse = import("./products").PostProductsErrorResponse;
  export type GetProductsByProductIdResponse = import("./products").GetProductsByProductIdResponse;
  export type GetProductsByProductIdErrorResponse = import("./products").GetProductsByProductIdErrorResponse;
  export type PatchProductsByProductIdRequest = import("./products").PatchProductsByProductIdRequest;
  export type PatchProductsByProductIdResponse = import("./products").PatchProductsByProductIdResponse;
  export type PatchProductsByProductIdErrorResponse = import("./products").PatchProductsByProductIdErrorResponse;
  export type DeleteProductsByProductIdResponse = import("./products").DeleteProductsByProductIdResponse;
  export type DeleteProductsByProductIdErrorResponse = import("./products").DeleteProductsByProductIdErrorResponse;
}
