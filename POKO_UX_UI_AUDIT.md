# Poko SaaS UX/UI Audit & Modernization Roadmap

## Phase 3 — UX/Product Audit

### Information Architecture

**Sidebar navigation** is the backbone of the app. Current issues:

1. **Mixed-language labels** — "Bài viết" (Vietnamese) sits next to "Integrations," "Workflow," "Dashboard" (English). This creates cognitive friction. Pick one language per persona. Given Poko's Vietnamese market: use Vietnamese for operator-facing modules (bài viết, sản phẩm, lịch đăng) and English for technical/admin modules (Workflow, Integrations, Prompts) — or go fully Vietnamese with tooltips in English for technical terms.

2. **Flat-then-nested inconsistency** — Posts and Products have sub-items; Content, Prompts, Workflow, Analytics, Settings, Integrations are flat links. A content operator's mental model is: "I need to create something." That action is currently split across Posts (bài viết), Content (nội dung), and Prompts — three separate top-level items. Consider grouping under a single "Create" or "Nội dung" parent with sub-navigation.

3. **Missing active-state breadcrumb** — The sidebar highlights the active item, but there's no page-level breadcrumb or section header reinforcing where the user is. The `PageHeaderSlot` exists in the layout but is inconsistently populated across routes.

### Empty States

Screenshots show **four pages with empty states** (posts list, prompts, workflows, schedule). This is a critical onboarding failure:

- Every empty state should answer: _What is this? Why should I care? What do I do first?_
- Current empty states appear to be unstyled fallbacks — no illustration, no value proposition, no CTA hierarchy.
- Recommendation: design a single `<EmptyState>` primitive with `title`, `description`, `illustration` (optional), and `primaryAction` + `secondaryAction` slots. Use it everywhere.

### Action Hierarchy

- The "Tạo bài viết" (Create Post) action is buried in a sub-menu under Posts. This is the **highest-frequency action** for content operators. It should be a primary CTA at the top of the sidebar or as a persistent FAB/command bar.
- Settings and Integrations are **setup-time actions** (low frequency). They should not occupy equal visual weight with daily-use modules.

### Density & Readability

- The posts table and workflows list have adequate whitespace but **low information density** — few visible rows, large empty columns. This works for Linear-style minimalism but needs actual data to justify the space.
- List views need: row count, quick filters, sort indicators, and batch actions (select + bulk delete/schedule).

## Phase 4 — Visual Design Audit

### Token System

The token architecture in `src/styles.css` is **well-structured** — separate `--t-*` semantic tokens with dark/light overrides. This is a strong foundation. Issues:

1. **Token bloat** — 25+ accent tokens (`accent-orange`, `accent-orange-light`, `accent-orange-dim`, `accent-orange-border`, repeat for green/blue/purple). This is a maintenance hazard. Consolidate to a single accent scale with opacity modifiers: `--t-accent`, `--t-accent-dim` (8% opacity), `--t-accent-border` (20% opacity). Color variants become token overrides per context.

2. **Unused legacy tokens** — `--sidebar`, `--sidebar-foreground`, etc. exist alongside the `--t-sidebar*` tokens. The `.dark` class overrides the old ones but not the `--t-*` ones. Clean up the dead token set.

3. **Typography tokens** declare `Syne` and `Inter` but the font import in `styles.css` loads `Fraunces` and `Manrope` — the `@theme inline` font stacks and the actual `@import` are mismatched. This means the declared fonts never load and the system falls back to `ui-sans-serif`.

### Color & Contrast

- The dark theme is the **primary theme** (default `:root` is dark). This aligns with Linear/Stripe dark-first philosophy.
- Accent orange (`#ff801f`) on dark void (`#000000`) has strong contrast. But `muted-text` (`#888780`) on `surface` (`#0a0a08`) may fail WCAG AA for body text — verify with a contrast checker.
- The light theme exists but appears secondary/underserved — several screenshots are dark-only. If light mode is a supported feature, it needs equal audit attention.

### Visual Language

- The sidebar uses `accent-orange-dim` backgrounds for active states with `accent-orange` text — this is clean and consistent with Stripe/Linear patterns.
- The workflow canvas has a grid background (`.workflow-grid-bg`) — this is a strong visual differentiator.
- Missing: **micro-interactions**. No transition on sidebar collapse, no hover scale on buttons, no skeleton loaders. These are table-stakes for perceived quality in a Linear-benchmarked product.

## Phase 5 — Codebase/Page Artifact Discovery

### Route Map (confirmed)

```text
/                          → Home/landing
/dash                      → Dashboard layout (sidebar + outlet)
  /dash/analytics          → Analytics page
  /dash/content            → Content page
  /dash/prompts            → Prompt templates
  /dash/schedule           → Content calendar
  /dash/settings           → Settings
  /dash/posts              → Posts list
    /dash/posts/new        → Post editor
    /dash/posts/scheduled  → Scheduled posts
  /dash/products           → Products list
    /dash/products/manual-import → Manual import
  /dash/workflows          → Workflow list
    /dash/workflows/$id    → Workflow editor (dynamic)
  /dash/integrations       → Platform integrations
/api/$                     → API proxy
```

### Component Inventory (key primitives)

- **30+ shadcn/ui components** in `src/components/ui/` — dialog, sheet, sidebar, select, dropdown-menu, popover, table, form, command, tooltip, etc.
- **Custom layout components**: `sidebar.tsx`, `theme-toggle.tsx`
- **Feature modules**: workflow (canvas, node registry, property editors), posts, products, contents, prompts, scheduler, dashboard, platform-integrations
- **State**: Zustand stores (canvas, execution) + TanStack Query for server state

### Key Architectural Observations

1. **Well-factored feature modules** — each domain is isolated with its own components/hooks/stores/utils. This is good.
2. **App shell is solid** — `SidebarProvider` → `Sidebar` + `SidebarInset` pattern is clean and follows shadcn conventions.
3. **PageHeaderSlot** pattern exists but is underutilized — most routes don't supply a header, leading to inconsistent page chrome.
4. **No loading skeletons** — routes that fetch data show nothing or a generic spinner during load.

## Phase 6 — Refactor Plan

### Priority Matrix

| Priority | Area                                    | Effort | Impact                |
| -------- | --------------------------------------- | ------ | --------------------- |
| P0       | Empty state system                      | 2 days | Onboarding conversion |
| P0       | Fix typography (font mismatch)          | 1 hour | Visual polish         |
| P0       | Page header consistency                 | 2 days | Navigation clarity    |
| P1       | Token consolidation                     | 2 days | Maintainability       |
| P1       | IA restructuring (group create actions) | 3 days | Operator efficiency   |
| P1       | Skeleton loaders                        | 2 days | Perceived performance |
| P2       | Language consistency (i18n strategy)    | 3 days | Professionalism       |
| P2       | Micro-interactions & transitions        | 3 days | Premium feel          |
| P2       | Light theme audit & fixes               | 2 days | Accessibility         |
| P3       | Bulk actions in list views              | 3 days | Power-user efficiency |
| P3       | Command palette (cmd+k)                 | 3 days | Keyboard navigation   |

### P0 Breakdown

**1. Empty State System**

- Create `<EmptyState>` component in `src/components/ui/`
- Props: `icon?`, `title`, `description`, `primaryAction` (label + onClick), `secondaryAction?`
- Variants: `default` (create-first), `no-results` (filter yielded nothing), `error` (something broke)
- Apply to: posts list, prompts, workflows, schedule, products

**2. Typography Fix**

- Align `@import` fonts with `@theme inline` font stacks — either switch the import to Syne + Inter, or update the tokens to Fraunces + Manrope. Recommend Syne (display) + Inter (body) as they're more established for SaaS.

**3. Page Header Consistency**

- Enforce `PageHeaderSlot` usage on all `/dash/*` routes
- Header should include: page title, breadcrumb (optional), primary action button
- This gives every page a consistent top zone and a predictable place for the main CTA

### P1 Breakdown

**4. Token Consolidation**

- Merge accent color variants: keep one base accent per semantic color (orange, green, red, blue, purple) and derive dim/border via opacity in Tailwind config
- Remove unused `--sidebar*` (non-t-prefixed) tokens from `:root` and `.dark`

**5. IA Restructuring**

- Group "Bài viết", "Nội dung", "Prompts" under a single expandable "Sáng tạo" (Create) section
- Move "Integrations" and "Settings" to a bottom group (setup/admin tier)
- Add a persistent "Tạo bài viết mới" button at the top of the sidebar or as a command bar

**6. Skeleton Loaders**

- Add `<Skeleton>` from shadcn if not already present
- Create loading variants for: table rows, card grids, form fields, workflow canvas

## Phase 7 — Standards & Checklists

### Pre-Implementation Checklist

Before writing any code:

- [ ] Audit all empty states — every route that can be empty has a designed empty state
- [ ] Fix font import mismatch — verify rendered fonts in devtools
- [ ] Run contrast check on `muted-text` / `surface` combinations in both themes
- [ ] Document the token naming convention (what `--t-*` prefix means, when to add new tokens)
- [ ] Decide i18n strategy: Vietnamese-first with English fallbacks, or fully bilingual

### Implementation Standards

- **Component API**: Every new UI component exposes a `className` prop and uses `cn()` for merging
- **Tokens**: New colors are added as `--t-*` tokens in `:root` with light-mode overrides in `:root:not(.dark)` — never hardcode hex values in components
- **Empty states**: Use the shared `<EmptyState>` primitive — no one-off empty states per page
- **Page headers**: Every `/dash/*` route supplies a `<PageHeaderSlot>` with at minimum a `title`
- **Loading states**: Every data-dependent route has a loading skeleton, not a spinner
- **Responsive**: Sidebar collapses to `icon` mode at `<lg` breakpoint (already configured); test all pages at 375px, 768px, 1440px
- **Accessibility**: All interactive elements have visible focus rings (using `--t-ring` token), and form fields have associated labels

### Review Gate

Before merging any UI PR:

1. Does it work in both dark and light themes?
2. Does the loading state look intentional (not broken)?
3. Does the empty state tell the user what to do?
4. Are there hardcoded colors that should use tokens?
5. Does the page have a header with a clear title and primary action?
