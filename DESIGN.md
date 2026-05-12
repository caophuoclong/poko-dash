---
version: alpha
name: Twenty
description: A dark-first, developer-native CRM system built on dense data tables, layered near-black surfaces, warm neutral text, and your orange primary accent used to signal action rather than brand spectacle. Twenty’s marketing site frames the product as “building blocks” for technical teams, and that same philosophy shows up visually: composable cards, table-first object views, monospaced code interludes, and interface chrome that feels closer to Linear, Notion, and modern internal tools than to legacy CRM software. Typography is contemporary sans throughout, with bold but not theatrical display sizing, compact body copy, and strong emphasis on structure over decoration. Corners are softly rounded, spacing is compact-to-balanced, and elevation stays subtle so data density remains the focus.

colors:
  primary: '#ff801f'
  primary-active: '#e46f17'
  primary-soft: '#2a1a0d'
  primary-glow: '#ffb36e'
  success: '#57c084'
  warning: '#ffb84d'
  error: '#ff2047'
  ink: '#f0f0f0'
  body: '#d2d2cf'
  muted: '#a1a4a5'
  muted-soft: '#737775'
  hairline: 'rgba(214, 235, 253, 0.19)'
  hairline-soft: 'rgba(214, 235, 253, 0.10)'
  border-strong: 'rgba(214, 235, 253, 0.28)'
  canvas: '#0a0a08'
  surface-soft: '#111110'
  surface-card: '#0a0a08'
  surface-strong: '#1a1a18'
  surface-elevated: '#20201d'
  on-primary: '#1a0f00'
  on-dark: '#ffffff'
  code-bg: '#111110'
  scrim: '#000000'

typography:
  display-xl:
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -1.2px
  display-lg:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.8px
  display-md:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: -0.4px
  display-sm:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
  title-md:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: -0.1px
  title-sm:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.38
    letterSpacing: 0
  body-md:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.53
    letterSpacing: 0
  body-sm:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.38
    letterSpacing: 0
  caption-sm:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: 0.1px
  badge:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.27
    letterSpacing: 0.2px
    textTransform: uppercase
  micro-label:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0.12px
  mono-code:
    fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  button-md:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: 0
  button-sm:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.23
    letterSpacing: 0
  link:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0
  nav-link:
    fontFamily: "'Inter', 'SF Pro Display', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 72px

elevation:
  flat: none
  card: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.28)'
  dropdown: '0 0 0 1px rgba(255,255,255,0.05), 0 16px 40px rgba(0,0,0,0.36)'
  modal: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.48)'

components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
    padding: 10px 16px
    height: 36px
  button-primary-active:
    backgroundColor: '{colors.primary-active}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.md}'
  button-secondary:
    backgroundColor: '{colors.surface-card}'
    textColor: '{colors.ink}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
    padding: 10px 16px
    height: 36px
  button-ghost:
    backgroundColor: transparent
    textColor: '{colors.body}'
    typography: '{typography.button-md}'
    rounded: '{rounded.md}'
  command-input:
    backgroundColor: '{colors.surface-strong}'
    textColor: '{colors.body}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.lg}'
    padding: 12px 16px
    height: 44px
  top-nav:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.nav-link}'
    height: 72px
  sidebar:
    backgroundColor: '{colors.surface-soft}'
    textColor: '{colors.body}'
    typography: '{typography.body-sm}'
    width: 248px
  sidebar-item-active:
    backgroundColor: '{colors.surface-strong}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
  object-table:
    backgroundColor: '{colors.surface-card}'
    textColor: '{colors.body}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.xl}'
  table-header-cell:
    backgroundColor: '{colors.surface-soft}'
    textColor: '{colors.muted}'
    typography: '{typography.caption-sm}'
  table-row:
    backgroundColor: transparent
    textColor: '{colors.body}'
    typography: '{typography.body-sm}'
  object-chip:
    backgroundColor: '{colors.primary-soft}'
    textColor: '{colors.primary-glow}'
    typography: '{typography.badge}'
    rounded: '{rounded.full}'
    padding: 4px 10px
  metric-card:
    backgroundColor: '{colors.surface-card}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: 20px
  code-preview:
    backgroundColor: '{colors.code-bg}'
    textColor: '{colors.ink}'
    typography: '{typography.mono-code}'
    rounded: '{rounded.lg}'
    padding: 16px
  terminal-snippet:
    backgroundColor: '{colors.code-bg}'
    textColor: '{colors.body}'
    typography: '{typography.mono-code}'
    rounded: '{rounded.lg}'
    padding: 16px
  section-card:
    backgroundColor: '{colors.surface-card}'
    textColor: '{colors.body}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: 24px
  testimonial-card:
    backgroundColor: '{colors.surface-card}'
    textColor: '{colors.body}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: 24px
  badge-status-success:
    backgroundColor: 'rgba(87,192,132,0.14)'
    textColor: '{colors.success}'
    typography: '{typography.badge}'
    rounded: '{rounded.full}'
    padding: 4px 8px
  badge-status-warning:
    backgroundColor: 'rgba(255,184,77,0.14)'
    textColor: '{colors.warning}'
    typography: '{typography.badge}'
    rounded: '{rounded.full}'
    padding: 4px 8px
  badge-status-error:
    backgroundColor: 'rgba(255,32,71,0.14)'
    textColor: '{colors.error}'
    typography: '{typography.badge}'
    rounded: '{rounded.full}'
    padding: 4px 8px
  footer-dark:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.muted}'
    typography: '{typography.body-sm}'
    padding: 48px 80px
---

## Overview

Twenty is a dark, technical, object-centric CRM design system that visually communicates extensibility before it communicates sales polish. The public homepage leads with the line “Build your Enterprise CRM at AI Speed,” and the UI shown directly underneath is a dense company table with object fields, relationship data, and action-oriented records rather than decorative marketing panels. That immediately establishes the product’s visual contract: this is a CRM for technical teams who want structure, composability, and speed, not a glossy, low-information sales shell.

The dominant experience is **dark-first**. The page canvas is near-black (`{colors.canvas}`), major surfaces step upward through blue-charcoal layers (`{colors.surface-soft}`, `{colors.surface-card}`, `{colors.surface-strong}`), and text uses a cool hierarchy from bright ink to muted slate. The single accent is your restrained orange primary (`{colors.primary}`), used sparingly on primary actions, interactive chips, and key affordances. Unlike startup-marketing systems that rely on gradients or neon glows, Twenty keeps the color language disciplined so the product screenshot, table density, and code snippets remain the visual anchor.

Typography is modern sans throughout, with a scale calibrated for product software rather than editorial drama. Headlines are bold but compact, body copy is relatively tight, and code examples introduce a monospaced sub-language that reinforces the developer-first posture visible on the marketing page. The result is a system that sits between modern SaaS marketing and internal-tool UX: cleaner than legacy CRM products, but more data-dense and utilitarian than a consumer brand site.

**Key Characteristics:**

- Dark-first product surface: `{colors.canvas}` and `{colors.surface-*}` establish a dense, low-glare enterprise UI where tables and object cards can carry large amounts of information without feeling noisy.
- Single cool accent: `{colors.primary}` is the main action signal. It is used as a precise affordance color, not a decorative brand wash.
- Table-led CRM layout: the homepage hero immediately shows a multi-column object table (Companies, Url, Created By, Account Owner, ARR, Industry, Employees, Opportunities, Added), making structured data the center of the brand expression.
- Developer-native visual cues: code snippets, schema identifiers, object definitions, and monospaced previews are presented as first-class product elements rather than hidden documentation extras.
- Layered, rounded surfaces: cards, code blocks, and content modules use moderate rounding (`{rounded.lg}` to `{rounded.xl}`) and subtle shadows, giving depth without softening the interface into consumer territory.
- Compact-but-breathable density: spacing is tighter than a landing-page system but more generous than a classic admin dashboard, allowing Twenty to feel modern while still supporting operational work.
- Marketing language and product language are aligned: the site repeatedly frames Twenty as “building blocks” and an extensibility toolkit, and the design mirrors that with modular panels, object chips, code blocks, and composable layout sections.

## Colors

### Brand & Accent

- **Primary Orange** (`{colors.primary}` — #ff801f): The core action color used for primary CTAs, active emphasis, interactive pills, and focus-driving UI affordances. In this adapted spec, Twenty’s structure is preserved but the brand voltage is shifted to your warmer orange accent.
- **Primary Active** (`{colors.primary-active}` — #e46f17): Darker press state for primary interactions. Appropriate for pointer-down states on CTA buttons and active command interactions.
- **Primary Soft** (`{colors.primary-soft}` — #2a1a0d): A low-contrast orange-brown backing surface for selected chips, highlighted rows, or inline object tags.
- **Primary Glow** (`{colors.primary-glow}` — #ffb36e): Lighter orange text/icon treatment on soft-primary surfaces. Used where the interface needs a selected state that is visible but not overwhelming.

### Semantic

- **Success** (`{colors.success}` — #44c27a): Positive state for workflow completion, synced records, or healthy automation runs.
- **Warning** (`{colors.warning}` — #f4b74a): Caution tone for pending or attention-needed states.
- **Error** (`{colors.error}` — #ff2047): Error or destructive alert state pulled directly from your token file.

### Surface

- **Canvas** (`{colors.canvas}` — #0a0a08): The global page floor and darkest surrounding surface, taken from your token file.
- **Surface Soft** (`{colors.surface-soft}` — #111110): The first raised layer above canvas, appropriate for sidebars, header bars, or table shells.
- **Surface Card** (`{colors.surface-card}` — #0a0a08): The main panel/card tone in this adapted version. It stays very close to canvas, which gives the system a flatter, more minimal feel.
- **Surface Strong** (`{colors.surface-strong}` — #1a1a18): A slightly brighter layer used for selected items, command surfaces, sticky bars, or denser control chrome.
- **Surface Elevated** (`{colors.surface-elevated}` — #202b40): Highest routine panel layer, useful for dropdowns, flyouts, and high-priority surfaced panels.
- **Code Background** (`{colors.code-bg}` — #0f1625): Dedicated dark mono surface for code excerpts and SDK snippets.

### Hairlines & Borders

- **Hairline** (`{colors.hairline}` — #2b3445): Default border color for tables, cards, and row dividers.
- **Hairline Soft** (`{colors.hairline-soft}` — #202838): Lower-contrast divider for secondary separation inside already dark containers.
- **Border Strong** (`{colors.border-strong}` — #3a455c): Higher-emphasis stroke for focused inputs, sticky overlays, or stronger table segmentation.

### Text

- **Ink** (`{colors.ink}` — #f0f0f0): Bright primary text on dark surfaces. Used for headlines, table cell emphasis, and principal UI labels.
- **Body** (`{colors.body}` — #d2d2cf): Default reading color for paragraph copy and routine row text.
- **Muted** (`{colors.muted}` — #a1a4a5): Secondary labels, metadata, and table headers.
- **Muted Soft** (`{colors.muted-soft}` — #737775): Tertiary copy, low-priority helper text, and non-active navigation.
- **On Primary** (`{colors.on-primary}` — #1a0f00): Text/icon color on orange action surfaces.
- **On Dark** (`{colors.on-dark}` — #ffffff): Inverse token for the darkest surfaces.

### Scrim

- **Scrim** (`{colors.scrim}` — #000000 at variable opacity): Modal and overlay backdrop. On a dark-first system, this is primarily used to deepen focus rather than dim a bright canvas.

## Typography

### Font Family

The public site does not explicitly publish its type stack, but the visual treatment strongly suggests a modern neo-grotesk sans in the Inter / SF Pro class, with monospaced code support for developer-facing surfaces. A practical system reconstruction is:

- Primary UI and marketing type: **Inter** / **SF Pro Display** / system sans.
- Code and schema surfaces: **JetBrains Mono** / **SFMono** / Consolas.

There is no visible separate editorial display face. The same sans family appears to carry headings, labels, and body copy, which fits Twenty’s technical, product-first voice.

### Hierarchy

| Token                     | Size | Weight | Line Height | Letter Spacing | Use |
| ------------------------- | ---- | ------ | ----------- | -------------- | --- |
| `{typography.display-xl}` | 48px | 700    | 1.08        | -1.2px         | Hero statements such as “Build your Enterprise CRM at AI Speed” |
| `{typography.display-lg}` | 36px | 700    | 1.12        | -0.8px         | Major section headings |
| `{typography.display-md}` | 28px | 700    | 1.18        | -0.4px         | Core section headlines and case-study titles |
| `{typography.display-sm}` | 24px | 600    | 1.25        | -0.2px         | Secondary headline level |
| `{typography.title-md}`   | 18px | 600    | 1.33        | -0.1px         | Card titles and important object labels |
| `{typography.title-sm}`   | 16px | 600    | 1.38        | 0              | Table cell emphasis, list heads, compact module titles |
| `{typography.body-md}`    | 15px | 400    | 1.53        | 0              | Primary paragraph and explanatory UI copy |
| `{typography.body-sm}`    | 14px | 400    | 1.5         | 0              | Default product UI text and dense table rows |
| `{typography.caption}`    | 13px | 500    | 1.38        | 0              | Helper labels, field descriptors, compact UI text |
| `{typography.caption-sm}` | 12px | 500    | 1.33        | 0.1px          | Table headers, metadata, small nav labels |
| `{typography.badge}`      | 11px | 600    | 1.27        | 0.2px          | Status pills and object chips |
| `{typography.micro-label}`| 12px | 600    | 1.33        | 0.12px         | Tight UI labels and dense control captions |
| `{typography.mono-code}`  | 12px | 500    | 1.5         | 0              | SDK snippets, object IDs, schema definitions |
| `{typography.button-md}`  | 14px | 600    | 1.29        | 0              | Primary and secondary button labels |
| `{typography.button-sm}`  | 13px | 600    | 1.23        | 0              | Compact pill/button labels |
| `{typography.link}`       | 14px | 500    | 1.43        | 0              | Text links and inline actions |
| `{typography.nav-link}`   | 14px | 500    | 1.29        | 0              | Header navigation and product-level top-nav items |

### Principles

Twenty’s typography is assertive but controlled. The hero copy is bold and high-contrast, but the system avoids exaggerated display flourishes or oversized consumer-style headlines. As soon as the page moves into product proof, the type scale compresses quickly so tables, cards, and code can dominate.

Monospaced text is not decorative here; it is a core secondary language. Schema identifiers, code examples, and generated object definitions are integral to the public story, so any faithful design system for Twenty should treat mono typography as a primary supporting token, not an afterthought.

### Note on Font Substitutes

If Inter is unavailable, **Geist**, **SF Pro**, or **Manrope** are strong substitutes for the UI/messaging layer. For code, **JetBrains Mono** can be replaced by **IBM Plex Mono** or **SFMono-Regular** without materially changing the system feel.

## Layout

### Spacing System

- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 20px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.section}` 72px.
- **Section padding (vertical):** `{spacing.section}` (72px) on major marketing bands. This is roomy enough for modern SaaS storytelling but still disciplined.
- **Card internal padding:** `{spacing.lg}` to `{spacing.xl}` (20–24px) for content cards and code blocks.
- **Dense UI gutters:** `{spacing.sm}` to `{spacing.base}` (8–16px) inside tables, sidebars, field groups, and command-style surfaces.

### Grid & Container

- **Max marketing width:** roughly 1200–1280px centered.
- **Hero composition:** left-aligned headline/copy paired with a large product artifact — in Twenty’s case, a CRM table and then extensibility/code surfaces.
- **Product shell:** left sidebar + central data surface is the dominant composition language in screenshots.
- **Module rhythm:** narrative content sections alternate between explanatory text blocks, proof cards, customer stories, and product surfaces rather than uniform three-up feature marketing.

### Whitespace Philosophy

Twenty uses whitespace to frame complexity, not to create a luxury/editorial mood. That means macro spacing is clean and measured, while micro spacing remains compact enough for enterprise data work. The overall effect is “structured breathing room” rather than airy minimalism.

## Elevation

The system uses subtle elevation rather than dramatic shadows.

- **Flat:** canvas, large page bands, and the broadest product-shell areas.
- **Card:** `{elevation.card}` — default for cards, tables, and section modules.
- **Dropdown:** `{elevation.dropdown}` — stronger for menus, flyouts, and command popovers.
- **Modal:** `{elevation.modal}` — deepest routine layer for modals and foreground overlays.

On Twenty, depth mainly comes from **surface stepping** and border contrast rather than from soft long shadows. This is important: a faithful recreation should prioritize layered dark panels over floating-glass effects.

## Components

### Buttons

**`button-primary`** — Blue fill, white text, 8px radius, 10×16px padding, 36px height. Used for “Get started” and other principal actions.

**`button-primary-active`** — Press state using `{colors.primary-active}`.

**`button-secondary`** — Dark panel fill with bright text, same radius and height as the primary. Used where an action should remain visible without competing with the main CTA.

**`button-ghost`** — Transparent background, body-colored text. Used for low-emphasis header and inline actions.

### Navigation & Shell

**`top-nav`** — Dark top bar, 72px height, compact product navigation, brand on the left and CTA on the right.

**`sidebar`** — Left application rail using `{colors.surface-soft}` with compact row spacing and muted default text.

**`sidebar-item-active`** — Slightly brighter surface with higher text contrast and rounded selection state.

### Inputs & Command Surfaces

**`command-input`** — Rounded dark input surface with subtle border contrast and 44px height. This fits the AI-command / extensibility positioning shown on the homepage.

### Data Views

**`object-table`** — Large rounded data surface with layered dark background, muted header row, and dense structured rows. This is the signature Twenty component because the hero itself is effectively a branded object table.

**`table-header-cell`** — Quiet small-caps / caption-style header treatment in muted text over a darker sub-surface.

**`table-row`** — Transparent or near-transparent row treatment that lets separators and cell density define structure rather than boxed card rows.

**`object-chip`** — Pill treatment for entity types, selected items, tags, or filtered states using soft blue backing and lighter blue text.

### Content & Proof Modules

**`metric-card`** — Rounded analytics or proof card for claims, stats, or operational summaries.

**`section-card`** — General-purpose modular block used in feature and case-study sections.

**`testimonial-card`** — Dark raised quote card with strong title and softer body text.

### Code & Extensibility

**`code-preview`** — Dedicated code block with mono type, slightly raised dark-blue background, and rounded shell. Used for SDK examples and generated object definition snippets.

**`terminal-snippet`** — More utilitarian mono surface for generated text, file trees, or CLI-like command output.

### Status

**`badge-status-success`** — Soft green chip for successful or synced states.

**`badge-status-warning`** — Soft amber chip for caution states.

**`badge-status-error`** — Soft rose-red chip for failures or required action.

### Footer

**`footer-dark`** — Dark footer matching the canvas, with muted body copy and measured spacing. There is no dramatic contrast-footer break; the system stays tonally consistent to the bottom of the page.

## Responsive Behavior

| Name    | Width       | Key Changes |
| ------- | ----------- | ----------- |
| Mobile  | < 768px     | Hero stacks vertically; product table compresses into a horizontally scrollable artifact; header nav simplifies; cards become single-column; code surfaces remain full-width blocks. |
| Tablet  | 768–1024px  | Hero remains stacked or split with tighter copy width; content modules become 2-up where helpful; table density is preserved with horizontal overflow. |
| Desktop | 1024–1440px | Full dark shell, left-aligned hero copy, large product artifact, multi-column proof sections, and visible table structure. |
| Wide    | > 1440px    | Content width caps; extra viewport width is absorbed by margins so the design retains product-tool focus rather than stretching into empty cinematic space. |

### Touch Targets

- Primary CTA controls should remain at least 36–40px tall in desktop contexts and 44px on mobile.
- Sidebar selections and compact chips should still preserve a minimum comfortable hit area even in dense product surfaces.
- Table interactions on mobile should shift toward larger overlay actions rather than tiny inline controls.

### Collapsing Strategy

- Dense tables should overflow horizontally rather than collapse field structure into unreadable stacked cards too early.
- Left navigation should compress into a drawer or top-level menu on small screens.
- Code snippets remain block-level and scroll horizontally when needed.
- Marketing cards collapse from multi-column to a single vertical stack without changing token hierarchy.

## Known Gaps

- **Exact brand palette:** Twenty does not publicly expose a full color token sheet on the surfaces reviewed, so the palette above is a faithful reconstruction from the public dark UI rather than an official export.
- **Exact font family:** The public docs do not publish a definitive brand font stack; the typography tokens here are inferred from visible rendering and reconstructed with practical substitutes.
- **Complete product component inventory:** The docs confirm a Twenty UI component system exists, but the reviewed public overview page does not enumerate every component token or state.
- **Motion states:** Hover, pressed, loading, and empty-state transitions are not fully documented in the reviewed sources.
- **Internal design tokens:** This file is a reverse-engineered design spec shaped from public marketing/product surfaces and docs, not an official internal design-system dump.
