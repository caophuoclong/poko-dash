// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Health
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health check */
        get: operations["HealthController_check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/health/liveness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Liveness probe */
        get: operations["HealthController_liveness"];
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
    HealthController_check: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Service is healthy
             *
             *     The Health Check is successful
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example ok */
                        status?: string;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       }
                         *     }
                         */
                        info?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /** @example {} */
                        error?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       }
                         *     }
                         */
                        details?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        };
                    };
                };
            };
            /** @description The Health Check is not successful */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example error */
                        status?: string;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       }
                         *     }
                         */
                        info?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /**
                         * @example {
                         *       "redis": {
                         *         "status": "down",
                         *         "message": "Could not connect"
                         *       }
                         *     }
                         */
                        error?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       },
                         *       "redis": {
                         *         "status": "down",
                         *         "message": "Could not connect"
                         *       }
                         *     }
                         */
                        details?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        };
                    };
                };
            };
        };
    };
    HealthController_liveness: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Service is alive */
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
export type GetHealthResponse = operations["HealthController_check"]["responses"][200]["content"]["application/json"];
