// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Affiliate Links
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetAffiliateLinksResponse = Array<{
  linkId: string;
  productId: string;
  /** Merchant name */
  merchant: string;
  /** Original product URL */
  originalUrl: string;
  /** Affiliate tracking URL */
  affiliateUrl: string;
  /** Shortened URL */
  shortUrl?: string;
  /** Affiliate platform */
  platform: string;
  /** Commission rate percentage */
  commissionRate?: number;
  /** Coupon code */
  couponCode?: string;
  deeplinkStatus: "valid" | "broken" | "pending" | "expired";
  active: boolean;
  createdAt: string;
}>;

export interface GetAffiliateLinksErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PostAffiliateLinksRequest {
  productId: string;
  merchant: string;
  originalUrl: string;
  affiliateUrl: string;
  shortUrl?: string;
  platform: string;
  commissionRate?: number;
  couponCode?: string;
  deeplinkStatus?: "valid" | "broken" | "pending" | "expired";
  active?: boolean;
}

export interface PostAffiliateLinksResponse {
  linkId: string;
  productId: string;
  /** Merchant name */
  merchant: string;
  /** Original product URL */
  originalUrl: string;
  /** Affiliate tracking URL */
  affiliateUrl: string;
  /** Shortened URL */
  shortUrl?: string;
  /** Affiliate platform */
  platform: string;
  /** Commission rate percentage */
  commissionRate?: number;
  /** Coupon code */
  couponCode?: string;
  deeplinkStatus: "valid" | "broken" | "pending" | "expired";
  active: boolean;
  createdAt: string;
}

export interface PostAffiliateLinksErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

export interface PatchAffiliateLinksByLinkIdRequest {
  productId?: string;
  merchant?: string;
  originalUrl?: string;
  affiliateUrl?: string;
  shortUrl?: string;
  platform?: string;
  commissionRate?: number;
  couponCode?: string;
  deeplinkStatus?: "valid" | "broken" | "pending" | "expired";
  active?: boolean;
}

export interface PatchAffiliateLinksByLinkIdResponse {
  linkId: string;
  productId: string;
  /** Merchant name */
  merchant: string;
  /** Original product URL */
  originalUrl: string;
  /** Affiliate tracking URL */
  affiliateUrl: string;
  /** Shortened URL */
  shortUrl?: string;
  /** Affiliate platform */
  platform: string;
  /** Commission rate percentage */
  commissionRate?: number;
  /** Coupon code */
  couponCode?: string;
  deeplinkStatus: "valid" | "broken" | "pending" | "expired";
  active: boolean;
  createdAt: string;
}

export interface PatchAffiliateLinksByLinkIdErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace AffiliateLinks {
  export type GetAffiliateLinksResponse = import("./affiliate-links").GetAffiliateLinksResponse;
  export type GetAffiliateLinksErrorResponse = import("./affiliate-links").GetAffiliateLinksErrorResponse;
  export type PostAffiliateLinksRequest = import("./affiliate-links").PostAffiliateLinksRequest;
  export type PostAffiliateLinksResponse = import("./affiliate-links").PostAffiliateLinksResponse;
  export type PostAffiliateLinksErrorResponse = import("./affiliate-links").PostAffiliateLinksErrorResponse;
  export type PatchAffiliateLinksByLinkIdRequest = import("./affiliate-links").PatchAffiliateLinksByLinkIdRequest;
  export type PatchAffiliateLinksByLinkIdResponse = import("./affiliate-links").PatchAffiliateLinksByLinkIdResponse;
  export type PatchAffiliateLinksByLinkIdErrorResponse = import("./affiliate-links").PatchAffiliateLinksByLinkIdErrorResponse;
}
