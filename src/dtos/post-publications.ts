// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Post Publications
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/content-posts/{postId}/publications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List publications for a content post */
        get: operations["PostPublicationsController_listForPost"];
        put?: never;
        /** Create a publication record (PENDING) */
        post: operations["PostPublicationsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/content-posts/{postId}/publications/{pubId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a publication record (full detail) */
        get: operations["PostPublicationsController_findById"];
        put?: never;
        post?: never;
        /** Delete a publication record */
        delete: operations["PostPublicationsController_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/content-posts/{postId}/publications/{pubId}/success": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record a successful publish */
        post: operations["PostPublicationsController_recordSuccess"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/content-posts/{postId}/publications/{pubId}/failure": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record a failed publish */
        post: operations["PostPublicationsController_recordFailure"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/content-posts/{postId}/publications/{pubId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel a publication */
        post: operations["PostPublicationsController_cancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        CreatePublicationDto: {
            /** @description Platform identifier */
            platform?: string;
            /** @description Target type within the platform */
            targetType?: string;
            /** @description Platform-specific target ID */
            targetId?: string;
            /** @description Human-readable target name */
            targetName?: string;
            /** @description Scheduled publish time (ISO 8601) */
            scheduledFor?: string;
        };
        RecordPublishSuccessDto: {
            /** @description Post ID returned by the platform */
            externalPostId?: string;
            /** @description Media IDs from the platform */
            externalMediaIds?: string[];
            /** @description Public URL of the published post */
            externalUrl?: string;
            /** @description Full response payload from the platform API */
            responsePayload?: Record<string, never>;
        };
        RecordPublishFailureDto: {
            /** @description Platform-specific error code */
            errorCode?: string;
            /** @description Human-readable error message from the platform */
            errorMessage: string;
            /** @description Full error response payload from the platform API */
            responsePayload?: Record<string, never>;
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
    PostPublicationsController_listForPost: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                postId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Publication summaries */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PostPublicationsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                postId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePublicationDto"];
            };
        };
        responses: {
            /** @description Created publication record */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PostPublicationsController_findById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pubId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Full publication record */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PostPublicationsController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pubId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PostPublicationsController_recordSuccess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pubId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordPublishSuccessDto"];
            };
        };
        responses: {
            /** @description Publication marked PUBLISHED */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PostPublicationsController_recordFailure: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pubId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordPublishFailureDto"];
            };
        };
        responses: {
            /** @description Publication marked FAILED */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PostPublicationsController_cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pubId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cancelled */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}


// ─── Convenience type aliases ──────────────────────────────────────────────
export type CreatePublicationDto = components["schemas"]["CreatePublicationDto"];
export type RecordPublishSuccessDto = components["schemas"]["RecordPublishSuccessDto"];
export type RecordPublishFailureDto = components["schemas"]["RecordPublishFailureDto"];

export type PostContentPostsByPostIdPublicationsRequest = operations["PostPublicationsController_create"]["requestBody"]["content"]["application/json"];
export type PostContentPostsByPostIdPublicationsByPubIdSuccessRequest = operations["PostPublicationsController_recordSuccess"]["requestBody"]["content"]["application/json"];
export type PostContentPostsByPostIdPublicationsByPubIdFailureRequest = operations["PostPublicationsController_recordFailure"]["requestBody"]["content"]["application/json"];
