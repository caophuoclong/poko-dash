# Workflow API Contract

## Base URL

```
/api/v1/workflows
```

## Authentication

All endpoints require `Authorization: Bearer <token>` header.

---

## Resources

### WorkflowSummary

Used in list views. Lightweight representation.

```typescript
interface WorkflowSummary {
  id: string           // UUID v4
  name: string         // Max 100 chars
  description: string  // Max 500 chars
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodeCount: number    // Computed server-side
  lastRunAt?: string   // ISO 8601, null if never run
  createdAt: string    // ISO 8601
  updatedAt: string    // ISO 8601
}
```

### WorkflowDetail

Full representation including nodes and edges.

```typescript
interface WorkflowDetail {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
}

interface WorkflowNode {
  id: string
  type: string              // e.g. 'workflow-node'
  position: { x: number; y: number }
  data: WorkflowNodeData
}

interface WorkflowNodeData {
  title: string             // Display label
  subtitle?: string         // Helper text
  icon?: string             // Lucide icon name
  status?: 'active' | 'pending' | 'completed' | 'error'
  metrics?: { label: string; value: string }[]
  config?: Record<string, unknown>  // Node-type-specific configuration
}

interface WorkflowEdge {
  id: string
  source: string            // Source node ID
  target: string            // Target node ID
  type?: string             // 'smoothstep' | 'straight' | 'bezier'
  animated?: boolean
  style?: {
    stroke?: string         // CSS color
    strokeWidth?: number
  }
  label?: string
}
```

### NodeTypeDefinition

Static catalog of available node types. Read-only, not user-editable.

```typescript
interface NodeTypeDefinition {
  type: string              // Internal type key
  label: string             // Display name
  description: string       // What this node does
  icon: string              // Lucide icon name
  category: 'trigger' | 'action' | 'condition' | 'output'
  defaultData: WorkflowNodeData
}
```

### WorkflowRun

Execution history record.

```typescript
interface WorkflowRun {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  nodeResults: Record<string, NodeRunResult>  // Keyed by node ID
}

interface NodeRunResult {
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt?: string
  completedAt?: string
  error?: string
  output?: Record<string, unknown>
}
```

---

## Endpoints

### 1. List Workflows

```
GET /api/v1/workflows
```

**Query Params:**
| Param     | Type   | Default  | Description                  |
|-----------|--------|----------|------------------------------|
| `status`  | string | —        | Filter: draft, active, paused, archived |
| `search`  | string | —        | Search in name & description |
| `page`    | number | 1        | Page number (1-indexed)      |
| `limit`   | number | 20       | Items per page (max 100)     |
| `sort`    | string | -updatedAt | Sort field + direction: `name`, `-updatedAt`, `createdAt` |

**Response:**
```json
{
  "data": [ WorkflowSummary, ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

### 2. Get Workflow

```
GET /api/v1/workflows/:workflowId
```

**Response:** `WorkflowDetail`

### 3. Create Workflow

```
POST /api/v1/workflows
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "nodes": [ WorkflowNode, ... ],
  "edges": [ WorkflowEdge, ... ]
}
```

**Response:** `WorkflowDetail` (HTTP 201)

### 4. Update Workflow

```
PUT /api/v1/workflows/:workflowId
```

**Request Body:** Partial `WorkflowDetail`

- `name`, `description`, `status`, `nodes`, `edges` are all optional
- If `nodes`/`edges` are provided, they **replace** the full set
- This is a full replacement, not a patch — send the complete nodes/edges arrays

**Response:** `WorkflowDetail`

### 5. Delete Workflow

```
DELETE /api/v1/workflows/:workflowId
```

**Response:** HTTP 204

### 6. Run Workflow

```
POST /api/v1/workflows/:workflowId/run
```

Triggers execution. Only valid for `active` workflows.

**Response:**
```json
{
  "runId": "uuid",
  "status": "running",
  "startedAt": "ISO 8601"
}
```
HTTP 202 Accepted

### 7. Get Workflow Runs

```
GET /api/v1/workflows/:workflowId/runs
```

**Query Params:**
| Param   | Description |
|---------|-------------|
| `page`  | Default 1   |
| `limit` | Default 20  |

**Response:**
```json
{
  "data": [ WorkflowRun, ... ],
  "pagination": { ... }
}
```

### 8. Pause / Resume Workflow

```
POST /api/v1/workflows/:workflowId/pause
POST /api/v1/workflows/:workflowId/resume
```

**Response:** `WorkflowDetail`

### 9. Duplicate Workflow

```
POST /api/v1/workflows/:workflowId/duplicate
```

Creates a copy with `" (Copy)"` appended to name. Status set to `draft`.

**Response:** `WorkflowDetail` (HTTP 201)

### 10. List Node Types

```
GET /api/v1/workflows/node-types
```

Returns the static catalog of available node types.

**Response:**
```json
{
  "data": [ NodeTypeDefinition, ... ]
}
```

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": {
    "code": "WORKFLOW_NOT_FOUND",
    "message": "Workflow with id 'wf-123' not found",
    "details": {}
  }
}
```

**Common Error Codes:**
| Code                    | HTTP  | Description                    |
|-------------------------|-------|--------------------------------|
| `WORKFLOW_NOT_FOUND`    | 404   | Workflow ID doesn't exist      |
| `VALIDATION_ERROR`      | 422   | Request body validation failed |
| `INVALID_STATE`         | 409   | Cannot perform action in current state (e.g., run a paused workflow) |
| `RATE_LIMITED`          | 429   | Too many requests              |

---

## Frontend Implementation Notes

### State Management Strategy

The frontend uses a **local-first optimistic** approach:

1. **List page** (`WorkflowIndexPage`): Fetches `GET /api/v1/workflows` and displays summaries
2. **Detail page** (`WorkflowDetailPage`): Fetches `GET /api/v1/workflows/:id`, loads into React Flow with `useNodesState` + `useEdgesState`
3. **Edits** (add node, move node, connect, delete, edit node data):
   - Modify local React Flow state immediately (instant UI)
   - Debounce save: 1s after last change → `PUT /api/v1/workflows/:id` with full nodes/edges
   - Show "Saving..." / "Saved" indicator in toolbar
   - On save failure, show toast with error + retry button; keep local changes
4. **Switch between workflows**: Reset local state from the fetched detail

### TanStack Query Integration

```typescript
// Suggested query key structure
const workflowKeys = {
  all:    ['workflows'],
  list:   (filters) => ['workflows', 'list', filters],
  detail: (id)     => ['workflows', 'detail', id],
  runs:   (id)     => ['workflows', 'runs', id],
  nodeTypes:       ['workflows', 'node-types'],
}
```

### Mock → Real Migration Steps

1. Replace `mockWorkflows` array with `useQuery({ queryKey: workflowKeys.list(filters), queryFn: fetchWorkflows })`
2. Replace `mockWorkflowDetails[id]` lookup with `useQuery({ queryKey: workflowKeys.detail(id), queryFn: () => fetchWorkflow(id) })`
3. Replace `NODE_TYPE_CATALOG` constant with `useQuery({ queryKey: workflowKeys.nodeTypes, queryFn: fetchNodeTypes, staleTime: Infinity })`
4. Add mutation hooks for create/update/delete/run/pause/resume/duplicate
5. Wire save-on-debounce in `WorkflowDetailPage` using `useMutation`

### Validation Rules (Client-Side)

- Workflow name: 1-100 chars, required
- At least 1 node required to save
- Edge source/target must reference existing node IDs
- Nodes must have unique IDs
- Position must include x and y (numbers)

---

## Database Schema (for reference)

```sql
CREATE TABLE workflows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(500) DEFAULT '',
  status      workflow_status DEFAULT 'draft',
  nodes       JSONB NOT NULL DEFAULT '[]',
  edges       JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE workflow_status AS ENUM ('draft', 'active', 'paused', 'archived');

CREATE TABLE workflow_runs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status      run_status DEFAULT 'running',
  node_results JSONB DEFAULT '{}',
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error       TEXT
);

CREATE TYPE run_status AS ENUM ('running', 'completed', 'failed');

CREATE INDEX idx_workflow_runs_workflow ON workflow_runs(workflow_id);
CREATE INDEX idx_workflows_status ON workflows(status);
```
