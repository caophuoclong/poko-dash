// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Dashboard
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetDashboardOverviewResponse = Record<string, unknown>;

export interface PostDashboardAggregateTriggerRequest {
  /** ISO date YYYY-MM-DD. Defaults to yesterday. */
  date?: string;
}

export interface PostDashboardAggregateBackfillRequest {
  /** Start date YYYY-MM-DD (inclusive) */
  from: string;
  /** End date YYYY-MM-DD (inclusive) */
  to: string;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace Dashboard {
  export type GetDashboardOverviewResponse = import("./dashboard").GetDashboardOverviewResponse;
  export type PostDashboardAggregateTriggerRequest = import("./dashboard").PostDashboardAggregateTriggerRequest;
  export type PostDashboardAggregateBackfillRequest = import("./dashboard").PostDashboardAggregateBackfillRequest;
}
