// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Configuration
// Run `node scripts/generate-dtos.mjs` to regenerate

export type GetConfigResponse = Array<{
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
}>;

export interface GetConfigErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace Configuration {
  export type GetConfigResponse = import("./configuration").GetConfigResponse;
  export type GetConfigErrorResponse = import("./configuration").GetConfigErrorResponse;
}
