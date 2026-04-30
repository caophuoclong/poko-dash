// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Dashboard
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface paths {
    "/api/dashboard/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get dashboard overview
         * @description Returns pre-computed aggregate data for the dashboard.
         */
        get: operations["DashboardController_getOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/dashboard/aggregate/trigger": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Trigger dashboard aggregation for a date
         * @description Runs the aggregation job for the given date (defaults to yesterday). Idempotent.
         */
        post: operations["DashboardController_triggerAggregation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/dashboard/aggregate/backfill": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Backfill dashboard aggregates for a date range
         * @description Runs the aggregation job for every date in [from, to]. Idempotent. Max range: 365 days.
         */
        post: operations["DashboardController_backfillAggregation"];
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
    DashboardController_getOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dashboard overview response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DashboardController_triggerAggregation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aggregation complete */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DashboardController_backfillAggregation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Backfill started */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}


// ─── Convenience type aliases ──────────────────────────────────────────────
