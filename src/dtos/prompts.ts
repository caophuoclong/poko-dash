// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Prompts
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/prompts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all prompts (paginated) */
        get: operations["PromptsController_list"];
        put?: never;
        /** Create a new prompt */
        post: operations["PromptsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search prompts */
        get: operations["PromptsController_search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/trending/most-used": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get most used prompts */
        get: operations["PromptsController_mostUsed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/trending/highest-rated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get highest rated prompts */
        get: operations["PromptsController_highestRated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/type/{type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Find prompts by type */
        get: operations["PromptsController_findByType"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/role/{role}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Find prompts by role */
        get: operations["PromptsController_findByRole"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/category/{category}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Find prompts by category */
        get: operations["PromptsController_findByCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/by-tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Find prompts by tags */
        post: operations["PromptsController_byTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/{promptId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get prompt by ID */
        get: operations["PromptsController_findById"];
        put?: never;
        post?: never;
        /** Delete a prompt */
        delete: operations["PromptsController_delete"];
        options?: never;
        head?: never;
        /** Update a prompt */
        patch: operations["PromptsController_update"];
        trace?: never;
    };
    "/api/prompts/{promptId}/refine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Refine a prompt (create new version) */
        post: operations["PromptsController_refine"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/{promptId}/rate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rate a prompt */
        post: operations["PromptsController_ratePrompt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/{promptId}/usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record prompt usage */
        post: operations["PromptsController_recordUsage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/{promptId}/compile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Compile a prompt (fill in variables) */
        post: operations["PromptsController_compile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/prompts/{promptId}/versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get prompt version history */
        get: operations["PromptsController_getVersionHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    PromptsController_list: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of prompts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Created prompt */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_search: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Matching prompts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_mostUsed: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Most used prompts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_highestRated: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Highest rated prompts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_findByType: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                type: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prompts by type */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_findByRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                role: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prompts by role */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_findByCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prompts by category */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_byTags: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prompts matching all tags */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_findById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prompt found */
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
    PromptsController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prompt deleted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Updated prompt */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_refine: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Refined prompt */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_ratePrompt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Rated prompt */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_recordUsage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usage recorded */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_compile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Compiled prompt text */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromptsController_getVersionHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                promptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Version history */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}


// ─── Convenience type aliases ──────────────────────────────────────────────
