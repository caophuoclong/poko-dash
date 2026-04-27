// AUTO-GENERATED — DO NOT EDIT
// Source: openapi.json  |  Tag: Workflow Credential
// Run `node scripts/generate-dtos.mjs` to regenerate

export interface PostCredentialsRequest {
  name: string
  type: 'api_key' | 'bearer_token' | 'basic_auth'
  value: string
}

export interface PostCredentialsResponse {
  id: string
  name: string
  type: 'api_key' | 'bearer_token' | 'basic_auth'
}

// ─── Namespace re-export ────────────────────────────────────────────────────
export namespace WorkflowCredential {
  export type PostCredentialsRequest =
    import('./workflow-credential').PostCredentialsRequest
  export type PostCredentialsResponse =
    import('./workflow-credential').PostCredentialsResponse
}
