# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**poko-dash** is a workflow automation dashboard built with TanStack Start (React SSR framework). The application provides a visual workflow builder with a node-based canvas for creating and managing automation workflows, similar to n8n or Zapier.

## Tech Stack

- **Framework**: TanStack Start (React 19 with SSR)
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Zustand + TanStack Query
- **UI**: Tailwind CSS 4, Radix UI, shadcn/ui components
- **Workflow Canvas**: @xyflow/react (React Flow)
- **Code Editor**: Monaco Editor
- **Rich Text**: Tiptap
- **Deployment**: Cloudflare Pages (via Wrangler)
- **Testing**: Vitest + Testing Library

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (runs on port 3001)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code (check only)
pnpm format

# Format and fix (auto-fix linting + formatting)
pnpm check

# Deploy to Cloudflare
pnpm deploy

# Generate API client from OpenAPI spec
pnpm generate:dtos
```

## Project Structure

```
src/
├── routes/              # File-based routes (TanStack Router)
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   ├── dash/           # Dashboard routes
│   └── workflow/       # Workflow routes
├── features/           # Feature modules (domain-driven)
│   ├── workflow/       # Workflow builder (main feature)
│   ├── contents/       # Content management
│   ├── posts/          # Post management
│   ├── products/       # Product management
│   ├── prompts/        # Prompt templates
│   ├── scheduler/      # Scheduling
│   ├── dashboard/      # Dashboard views
│   └── platform-integrations/  # External platform integrations
├── components/         # Shared UI components
│   ├── ui/            # shadcn/ui components
│   ├── table/         # Table components
│   ├── editor/        # Editor components
│   ├── layout/        # Layout components
│   └── data-display/  # Data display components
├── shared/            # Shared utilities
│   ├── utils/         # Utility functions
│   ├── hooks/         # Shared React hooks
│   ├── constants/     # Constants
│   └── api/           # Shared API utilities
├── api/               # API client (generated from OpenAPI)
│   ├── client.ts      # Generated API client
│   ├── model/         # Generated TypeScript types
│   └── custom-fetch.ts # Custom fetch wrapper
├── integrations/      # Third-party integrations
│   └── tanstack-query/ # TanStack Query setup
├── dtos/              # Data transfer objects
├── types/             # Global TypeScript types
└── router.tsx         # Router configuration
```

## Architecture

### Feature-Based Organization

Features are organized by domain (workflow, contents, posts, etc.). Each feature module contains:
- `components/` - Feature-specific React components
- `hooks/` - Feature-specific hooks
- `stores/` - Zustand stores for local state
- `utils/` - Feature-specific utilities
- `types.ts` - Feature-specific TypeScript types
- `data/` - Mock data and seed data

### Workflow Feature (Core)

The workflow feature (`src/features/workflow/`) is the heart of the application:

- **Canvas**: Visual node-based workflow editor using React Flow (@xyflow/react)
- **Node Registry**: Extensible system for defining workflow node types with:
  - Property schemas (configuration fields)
  - Input/output port definitions
  - Validation rules
  - UI customization (colors, icons, summary fields)
- **Node Types**: Nodes are categorized as triggers, actions, conditions, or outputs
- **Execution**: Workflow execution tracking with node-level status and output data
- **Variable System**: Dynamic variable resolution across nodes
- **Property Editors**: Specialized editors for different data types (code, JSON, key-value, assignments, conditions, URLs, cron expressions)

Key files:
- `node-registry.utils.ts` - Node definition utilities and validation
- `types.ts` - Core workflow types (WorkflowNodeData, WorkflowDetail, etc.)
- `stores/canvas-store.ts` - Canvas state management
- `components/workflow-canvas.tsx` - Main canvas component
- `components/node-palette.tsx` - Draggable node palette
- `components/node-edit-modal/` - Node configuration modal

### API Integration

API client is auto-generated from `openapi.json` using Orval:
- Generated client uses TanStack Query (React Query) hooks
- Custom fetch wrapper in `src/api/custom-fetch.ts` handles base URL resolution
- Backend URL configured via `BACKEND_URL` environment variable
- Vite proxy forwards `/api/*` requests to backend in development

### Routing

TanStack Router with file-based routing:
- Routes defined in `src/routes/`
- Route tree auto-generated in `src/routeTree.gen.ts`
- SSR integration with TanStack Query via `setupRouterSsrQueryIntegration`
- Root layout in `src/routes/__root.tsx`

### State Management

- **TanStack Query**: Server state, data fetching, caching
- **Zustand**: Local UI state (canvas state, execution state)
- **React Hook Form + Zod**: Form state and validation

## Path Aliases

Two path aliases are configured:
- `#/*` → `./src/*` (package.json imports)
- `@/*` → `./src/*` (TypeScript paths)

Use either prefix for imports: `import { Button } from '@/components/ui/button'`

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/` and configured via `components.json`.

## Environment Variables

Create `.env` file (see `.env` for example):
```bash
BACKEND_URL=http://localhost:3000
```

For production (Cloudflare), set `BACKEND_URL` in `wrangler.jsonc` under `vars`.

## Testing

- Test files: `*.test.ts`, `*.test.tsx`
- Test environment: jsdom
- Run single test: `pnpm test <file-pattern>`

## Code Style

- ESLint config: `@tanstack/eslint-config`
- Prettier for formatting
- TypeScript strict mode enabled
- Use `pnpm check` before committing to auto-fix issues

## Deployment

Deploys to Cloudflare Pages via Wrangler:
```bash
pnpm deploy
```

Builds are SSR-enabled and run on Cloudflare Workers.

## Important Notes

- The workflow canvas uses React Flow's node and edge system - nodes are typed with `WorkflowNodeData`
- Node definitions follow a registry pattern - see `node-registry.utils.ts` for the schema
- Property editors are dynamically rendered based on property schema types
- Execution state is tracked separately from workflow definition state
- Variable system allows referencing upstream node outputs using `{{$node.output.field}}` syntax
- Monaco Editor is used for code editing (JavaScript, JSON, etc.)
- Tiptap is used for rich text editing in prompts and descriptions

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
