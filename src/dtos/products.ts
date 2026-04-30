// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Products
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List products (paginated)
         * @description Returns a paginated list of products with search and sort support.
         */
        get: operations["ProductsController_listPaginated"];
        put?: never;
        /**
         * Create a new product
         * @description Add a new product to the catalog
         */
        post: operations["ProductsController_createDirect"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/products/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch lookup products by IDs
         * @description Returns products matching the provided IDs.
         */
        post: operations["ProductsController_batch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/products/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all products (non-paginated, legacy)
         * @description Retrieve all products in the catalog with optional status filter.
         */
        get: operations["ProductsController_listAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/products/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get product by ID
         * @description Retrieve a single product by its UUID
         */
        get: operations["ProductsController_getById"];
        put?: never;
        post?: never;
        /**
         * Delete product
         * @description Delete a product from the catalog
         */
        delete: operations["ProductsController_delete"];
        options?: never;
        head?: never;
        /**
         * Update product
         * @description Update an existing product by ID
         */
        patch: operations["ProductsController_patch"];
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
    ProductsController_listPaginated: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated list of products */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_createDirect: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Created product */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_batch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Matched products and not-found IDs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_listAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of products */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_getById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Product details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Product not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Product deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProductsController_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Updated product */
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
