// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Scheduler
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface PostSchedulerJobsRequest {
  postId: string;
  platform: string;
  scheduledAt: string;
  utmCode?: string;
}

export interface PatchSchedulerJobsByJobIdRequest {
  status?: "pending" | "scheduled" | "published" | "failed" | "cancelled";
  scheduledAt?: string;
  publishedAt?: string;
  postUrl?: string;
  utmCode?: string;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace Scheduler {
  export type PostSchedulerJobsRequest = import("./scheduler").PostSchedulerJobsRequest;
  export type PatchSchedulerJobsByJobIdRequest = import("./scheduler").PatchSchedulerJobsByJobIdRequest;
}
