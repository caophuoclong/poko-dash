// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Scheduler
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/scheduler/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List scheduled jobs
         * @description Retrieve scheduled jobs, optionally filtered by status, platform, or date range
         */
        get: operations["SchedulerController_list"];
        put?: never;
        /**
         * Schedule a post
         * @description Create a scheduled job for a content post (1-to-1: one post → one job)
         */
        post: operations["SchedulerController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/scheduler/jobs/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a scheduled job
         * @description Retrieve a single scheduled job with its related post populated
         */
        get: operations["SchedulerController_findById"];
        put?: never;
        post?: never;
        /**
         * Cancel a scheduled job
         * @description Remove a scheduled job. The post itself is not affected.
         */
        delete: operations["SchedulerController_cancel"];
        options?: never;
        head?: never;
        /**
         * Update a scheduled job
         * @description Reschedule, update status, or set post URL / UTM code
         */
        patch: operations["SchedulerController_patch"];
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
    SchedulerController_list: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of scheduled jobs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchedulerController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Created scheduled job */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchedulerController_findById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Scheduled job found */
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
    SchedulerController_cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
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
    SchedulerController_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Updated scheduled job */
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
