# Poko UI Refactor Execution Blueprint

Version: v1.0
Status: Implementation Ready
Target: Production-grade AI-native SaaS UX
Framework: React + TanStack Router + shadcn/ui + Tailwind + Zustand

---

# 0. Refactor Objectives

## Primary Goal

Transform Poko from:

* feature collection dashboard
* MVP-style tooling interface
* isolated workflow modules

Into:

* AI-powered affiliate content operating system
* workflow-centric SaaS platform
* scalable operational dashboard
* modern premium B2B product

---

# 1. Non-Negotiable Refactor Principles

## MUST KEEP

* Existing business logic
* Existing API contracts
* Zustand stores
* TanStack Query patterns
* Feature module boundaries
* Workflow execution engine
* Existing routing structure (Phase A/B)

---

## MUST CHANGE

* Information architecture
* Navigation hierarchy
* Visual consistency
* Empty states
* Loading states
* Component standardization
* Page structure consistency
* Table UX
* SaaS operational ergonomics

---

## NEVER DO

* Rewrite backend logic during UI phases
* Mix feature development with UI refactor
* Introduce new global state managers
* Hardcode colors
* Create duplicate primitives
* Use arbitrary spacing values
* Introduce inconsistent interaction patterns

---

# 2. Refactor Architecture

## 2.1 Target Frontend Structure

```txt
src/
├── app/
│
├── components/
│   ├── ui/                # shadcn primitives only
│   ├── patterns/          # reusable composed UI systems
│   ├── layouts/           # app shell/layouts
│   ├── motion/            # animation wrappers
│   └── feedback/          # loading/empty/error/success
│
├── features/
│   ├── posts/
│   ├── workflows/
│   ├── analytics/
│   ├── prompts/
│   ├── integrations/
│   └── products/
│
├── lib/
│   ├── design-system/
│   ├── utils/
│   └── constants/
│
├── styles/
│   ├── tokens.css
│   ├── theme.css
│   ├── motion.css
│   └── typography.css
```

---

## 2.2 Component Ownership Rules

### `components/ui`

Pure primitives only.

Examples:

* button
* input
* dialog
* table
* tooltip
* sheet

NO business logic.

---

### `components/patterns`

Reusable product patterns.

Examples:

* data-table
* page-header
* filter-toolbar
* empty-state
* app-sidebar
* stats-card
* command-palette

---

### `features/*`

Domain-specific UI only.

Examples:

* post-editor
* workflow-node
* execution-log
* prompt-template-card

---

# 3. SaaS Layout System

## 3.1 Global App Shell

```txt
AppShell
├── Sidebar
├── Topbar
│   ├── Breadcrumb
│   ├── Search
│   ├── Notifications
│   ├── UserMenu
│
├── CommandPalette
├── MainContent
│   ├── PageHeader
│   ├── RouteContent
│
└── OverlayLayer
```

---

## 3.2 Layout Rules

### Max Width

```css
max-width: 1600px;
```

For:

* analytics
* tables
* settings

---

### Dense Pages

Use:

```txt
px-4 lg:px-6
py-4
gap-4
```

Avoid oversized SaaS padding.

---

### Vertical Rhythm

Allowed spacing scale only:

```txt
2 / 4 / 6 / 8 / 12 / 16
```

No arbitrary spacing.

---

# 4. Information Architecture Refactor

## 4.1 New Navigation Structure

```txt
Workspace
├── Dashboard
│
├── Create
│   ├── Posts
│   ├── Content Library
│   ├── AI Prompts
│
├── Automations
│   ├── Workflows
│   ├── Schedules
│
├── Distribution
│   ├── Publish Queue
│   ├── Platforms
│
├── Intelligence
│   ├── Analytics
│   ├── Performance
│
├── Assets
│   ├── Products
│   ├── Media
│
└── System
    ├── Integrations
    ├── Team
    ├── Billing
    ├── Settings
```

---

## 4.2 Sidebar UX Rules

### Top Zone

Always visible:

* Create button
* Search
* Notifications

---

### Bottom Zone

Muted:

* settings
* billing
* integrations

---

### Active States

Must include:

* accent background
* left border
* icon emphasis
* text contrast

---

# 5. Design System Refactor

## 5.1 Token Architecture

### Allowed Token Categories

```css
--t-bg
--t-surface
--t-surface-muted
--t-border
--t-text
--t-text-muted
--t-accent
--t-danger
--t-success
--t-warning
--t-ring
```

---

## 5.2 Remove

```css
--sidebar*
--accent-orange-light
--accent-orange-border
--accent-orange-dim
```

Replace with opacity utilities.

---

## 5.3 Typography

### Fonts

#### Headings

```txt
Syne
```

#### Body

```txt
Inter
```

---

## 5.4 Typography Scale

```txt
text-xs
text-sm
text-base
text-lg
text-xl
text-2xl
text-3xl
```

No random sizes.

---

# 6. Page Standardization System

Every route MUST contain:

```txt
PageHeader
PageToolbar
ContentArea
FeedbackLayer
```

---

## 6.1 Page Header Contract

```tsx
<PageHeader
  title=""
  description=""
  breadcrumb=""
  primaryAction=""
  secondaryActions=""
/>
```

---

## 6.2 Required States

Every page MUST support:

* loading
* empty
* populated
* error
* success

---

# 7. Empty State System

## 7.1 Shared Component

```tsx
<EmptyState
  icon={}
  title=""
  description=""
  primaryAction={}
  secondaryAction={}
  tips={}
  docsLink={}
/>
```

---

## 7.2 Empty State Rules

Must answer:

1. What is this?
2. Why does it matter?
3. What should I do?
4. What happens next?

---

# 8. Loading Architecture

## 8.1 NEVER USE

* fullscreen spinners
* blank pages

---

## 8.2 ALWAYS USE

* skeleton continuity
* optimistic rendering
* progressive hydration feel

---

## 8.3 Required Skeletons

Create:

```txt
TableSkeleton
CardSkeleton
SidebarSkeleton
FormSkeleton
WorkflowSkeleton
StatsSkeleton
```

---

# 9. Data Table Standard

## 9.1 Required Features

Every table supports:

* sorting
* filtering
* pagination
* bulk actions
* row selection
* sticky headers
* keyboard navigation

---

## 9.2 Toolbar Structure

```txt
Left:
- filters
- search
- saved views

Right:
- density toggle
- export
- create action
```

---

## 9.3 Density Modes

Support:

* compact
* default

---

# 10. Workflow UX Refactor

## 10.1 Split Workflow Into 3 Systems

### Builder

Canvas editor

### Operations

Executions/logs/retries

### Intelligence

Optimization/recommendations

---

## 10.2 Workflow Layout

```txt
Topbar
├── Name
├── Status
├── Save
├── Publish

Canvas

Right Panel
├── Node Properties
├── Validation
├── AI Suggestions

Bottom Panel
├── Execution Logs
├── Runtime Events
├── Failures
```

---

## 10.3 Mobile Rule

Workflow editor becomes:

* read-only
* or limited mode

No full editing.

---

# 11. Command Palette System

## 11.1 Shortcut

```txt
⌘K / Ctrl+K
```

---

## 11.2 Actions

* navigate routes
* create posts
* open workflows
* search products
* generate prompts
* execute automation

---

## 11.3 Technical Requirement

Use:

```txt
cmdk
```

Integrate with:

* TanStack Router
* recent entities
* keyboard shortcuts

---

# 12. Motion System

## 12.1 Timing

### Fast

```txt
100–180ms
```

### Structural

```txt
220–300ms
```

---

## 12.2 Animate

* hover states
* sidebar collapse
* dialogs
* dropdowns
* tab transitions

---

## 12.3 NEVER Animate

* table reflow
* large layout shifts
* expensive canvas redraws

---

# 13. Accessibility Standards

## 13.1 Mandatory

* focus rings
* keyboard navigation
* ARIA labels
* semantic buttons
* form labels
* contrast compliance

---

## 13.2 Keyboard Navigation

All major flows must support:

* tab navigation
* escape handling
* enter actions
* arrow key menus

---

# 14. Responsive Standards

## 14.1 Breakpoints

```txt
sm
md
lg
xl
2xl
```

---

## 14.2 Mobile Strategy

Mobile is:

* monitor-first
* lightweight operations

NOT:

* full production environment

---

## 14.3 Tablet Strategy

Tablet supports:

* analytics
* scheduling
* lightweight editing

---

# 15. Route-by-Route Refactor Matrix

## `/dash/posts`

### Problems

* weak empty state
* low operational visibility
* weak filtering UX

### Target

Content operations center

### Required Components

* DataTable
* FilterToolbar
* EmptyState
* BulkActionsBar

Priority: P0

---

## `/dash/posts/new`

### Problems

* isolated editing
* weak workflow visibility

### Target

AI-assisted content editor

### Required

* StickyToolbar
* AutosaveIndicator
* AI Assist Panel
* Preview Mode

Priority: P1

---

## `/dash/workflows`

### Problems

* unclear execution visibility

### Target

Automation operations hub

### Required

* workflow cards
* execution stats
* recent runs
* health indicators

Priority: P1

---

## `/dash/workflows/$id`

### Problems

* prototype feel
* isolated canvas

### Target

Production workflow system

### Required

* execution panel
* logs
* validation
* publish states

Priority: P1

---

## `/dash/prompts`

### Problems

* disconnected utility feel

### Target

AI prompt operations library

### Required

* categories
* tags
* usage analytics
* favorites

Priority: P2

---

## `/dash/analytics`

### Problems

* passive dashboard feel

### Target

Operational intelligence center

### Required

* KPI cards
* trend charts
* insights feed
* anomalies

Priority: P2

---

# 16. Refactor Phases

## Phase A — Foundation

Duration: 1 week

### Deliverables

* typography fix
* token cleanup
* page-header system
* empty-state system
* skeleton system

---

## Phase B — Layout & Navigation

Duration: 1 week

### Deliverables

* sidebar redesign
* app shell standardization
* topbar
* breadcrumbs
* navigation hierarchy

---

## Phase C — Operational UX

Duration: 2 weeks

### Deliverables

* data-table system
* workflow operations
* command palette
* filter systems
* bulk actions

---

## Phase D — SaaS Maturity

Duration: 2 weeks

### Deliverables

* onboarding
* notifications
* execution visibility
* activity feeds
* AI recommendations

---

## Phase E — Polish

Duration: 1 week

### Deliverables

* micro-interactions
* animation polish
* accessibility audit
* responsive audit
* performance tuning

---

# 17. Git Strategy

## Branch Naming

```txt
feat/ui-foundation
feat/sidebar-v2
feat/table-system
feat/workflow-ops
```

---

## PR Rules

### Max

* 15 files
* 600 LOC

---

## NEVER MIX

* business logic
* UI refactor
* backend changes

---

# 18. AI Agent Rules

## ALWAYS

* reuse shadcn components
* use semantic tokens
* support dark/light mode
* preserve accessibility
* preserve responsive behavior

---

## NEVER

* hardcode values
* rewrite stores
* create duplicate components
* bypass patterns
* introduce inconsistent spacing

---

# 19. Definition of Done

A page is considered refactored only if:

* supports loading/empty/error/success states
* responsive
* accessible
* tokenized
* follows layout system
* uses shared patterns
* has keyboard support
* has consistent spacing
* has motion states
* works in dark/light mode

---

# 20. Final Product Direction

Poko should feel like:

* Linear × Notion × n8n
* operational
* intelligent
* fast
* cinematic
* workflow-native
* AI-assisted
* content-production-first

NOT:

* generic admin dashboard
* template SaaS clone
* component showcase

The UI should communicate:

> "This system helps me run and scale content operations."

Not:

> "This app contains several tools."
