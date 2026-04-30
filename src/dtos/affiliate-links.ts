// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Affiliate Links
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/affiliate-links": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all affiliate links
         * @description Retrieve a list of all affiliate links with their tracking URLs and commission rates
         */
        get: operations["AffiliateLinksController_list"];
        put?: never;
        /**
         * Create a new affiliate link
         * @description Add a new affiliate tracking link for a product
         */
        post: operations["AffiliateLinksController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/affiliate-links/{linkId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update affiliate link
         * @description Update an existing affiliate link by ID
         */
        patch: operations["AffiliateLinksController_patch"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        CreateAffiliateLinkDto: {
            /** @description Product UUID this link belongs to */
            productId: string;
            /**
             * @description Merchant name
             * @example Shopee
             */
            merchant: string;
            /** @description Original product URL */
            originalUrl: string;
            /** @description Affiliate tracking URL */
            affiliateUrl: string;
            /** @description Shortened tracking URL */
            shortUrl?: string;
            /**
             * @description Platform identifier
             * @example shopee
             */
            platform: string;
            /**
             * @description Commission rate percentage (0-100)
             * @example 10
             */
            commissionRate?: number;
            /** @description Coupon code for this link */
            couponCode?: string;
            /**
             * @description Deeplink status
             * @default pending
             * @enum {string}
             */
            deeplinkStatus: "valid" | "broken" | "pending" | "expired";
            /**
             * @description Whether the link is active
             * @default true
             */
            active: boolean;
        };
        UpdateAffiliateLinkDto: {
            /**
             * @description Merchant name
             * @example Shopee
             */
            merchant?: Record<string, never>;
            /** @description Original product URL */
            originalUrl?: Record<string, never>;
            /** @description Affiliate tracking URL */
            affiliateUrl?: Record<string, never>;
            /** @description Shortened tracking URL */
            shortUrl?: Record<string, never>;
            /**
             * @description Platform identifier
             * @example shopee
             */
            platform?: Record<string, never>;
            /**
             * @description Commission rate percentage (0-100)
             * @example 10
             */
            commissionRate?: Record<string, never>;
            /** @description Coupon code for this link */
            couponCode?: Record<string, never>;
            /**
             * @description Deeplink status
             * @enum {string}
             */
            deeplinkStatus?: "valid" | "broken" | "pending" | "expired";
            /**
             * @description Whether the link is active
             * @default true
             */
            active: Record<string, never>;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AffiliateLinksController_list: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of affiliate links */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AffiliateLinksController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAffiliateLinkDto"];
            };
        };
        responses: {
            /** @description Created affiliate link */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AffiliateLinksController_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                linkId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAffiliateLinkDto"];
            };
        };
        responses: {
            /** @description Updated affiliate link */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Affiliate link not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}


// ─── Convenience type aliases ──────────────────────────────────────────────
export type CreateAffiliateLinkDto = components["schemas"]["CreateAffiliateLinkDto"];
export type UpdateAffiliateLinkDto = components["schemas"]["UpdateAffiliateLinkDto"];

export type PostAffiliateLinksRequest = operations["AffiliateLinksController_create"]["requestBody"]["content"]["application/json"];
export type PatchAffiliateLinksByLinkIdRequest = operations["AffiliateLinksController_patch"]["requestBody"]["content"]["application/json"];
