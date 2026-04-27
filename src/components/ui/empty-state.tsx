import * as React from 'react'
import {
  BarChart2,
  CalendarDays,
  FileText,
  Package,
  Puzzle,
  SearchX,
  Sparkles,
  Link as LinkIcon,
  FileText as FileTextIcon,
} from 'lucide-react'

import { cn } from '#/shared/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type EmptyStateVariant = 'page' | 'card' | 'no-results' | 'inline'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary CTA — pass a <Button> or any element */
  primaryAction?: React.ReactNode
  /** Secondary/ghost CTA — rendered below or beside primary */
  secondaryAction?: React.ReactNode
  /** Small supporting note rendered below actions */
  note?: React.ReactNode
  /** @deprecated use primaryAction instead */
  action?: React.ReactNode
  variant?: EmptyStateVariant
  className?: string
}

// ─── Page variant ─────────────────────────────────────────────────────────────
// Full-viewport centered state. Use when an entire page has no content.

function PageEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  note,
  className,
}: Omit<EmptyStateProps, 'variant' | 'action'>) {
  const hasActions = primaryAction || secondaryAction
  return (
    <div
      data-slot="empty-state"
      data-variant="page"
      className={cn(
        'relative flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-6 overflow-hidden text-center',
        className,
      )}
    >
      {/* Ambient glow — very subtle, not decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-96 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,158,255,0.05)_0%,transparent_65%)]" />
      </div>

      {icon ? (
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-frost bg-surface/60 text-silver shadow-[rgba(176,199,217,0.145)_0px_0px_0px_1px] [&_svg]:size-7">
          {icon}
        </div>
      ) : null}

      <div className="relative max-w-75 space-y-2">
        <p className="font-display text-xl font-medium tracking-tight text-near-white">
          {title}
        </p>
        {description ? (
          <p className="text-sm leading-relaxed text-silver">{description}</p>
        ) : null}
      </div>

      {hasActions ? (
        <div className="relative flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}

      {note ? <p className="relative text-xs text-muted-text">{note}</p> : null}
    </div>
  )
}

// ─── Card variant ─────────────────────────────────────────────────────────────
// Bordered panel state. Use inside dashboard panels, tabs, or section placeholders.

function CardEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  note,
  className,
}: Omit<EmptyStateProps, 'variant' | 'action'>) {
  const hasActions = primaryAction || secondaryAction
  return (
    <div
      data-slot="empty-state"
      data-variant="card"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-frost bg-surface/30 px-8 py-10 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="flex size-10 items-center justify-center rounded-xl bg-surface-2 text-muted-text [&_svg]:size-5">
          {icon}
        </div>
      ) : null}

      <div className="max-w-60 space-y-1">
        <p className="text-sm font-medium text-near-white">{title}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-text">
            {description}
          </p>
        ) : null}
      </div>

      {hasActions ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}

      {note ? <p className="text-xs text-muted-text">{note}</p> : null}
    </div>
  )
}

// ─── No-results variant ───────────────────────────────────────────────────────
// Compact borderless state. Use inside tables, search results, or filtered lists.

function NoResultsEmptyState({
  icon,
  title,
  description,
  primaryAction,
  note,
  className,
}: Omit<EmptyStateProps, 'variant' | 'action' | 'secondaryAction'>) {
  return (
    <div
      data-slot="empty-state"
      data-variant="no-results"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-4 py-10 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-muted-text [&_svg]:size-4">
          {icon}
        </div>
      ) : null}

      <div className="max-w-55 space-y-1">
        <p className="text-sm font-medium text-near-white">{title}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-text">
            {description}
          </p>
        ) : null}
      </div>

      {primaryAction ? <div>{primaryAction}</div> : null}
      {note ? <p className="text-xs text-muted-text">{note}</p> : null}
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  variant = 'card',
  action,
  primaryAction,
  secondaryAction,
  note,
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  // backward compat: `action` maps to `primaryAction`
  const resolvedPrimary = primaryAction ?? action

  const sharedProps = {
    icon,
    title,
    description,
    primaryAction: resolvedPrimary,
    secondaryAction,
    note,
    className,
  }

  if (variant === 'page') return <PageEmptyState {...sharedProps} />
  if (variant === 'no-results' || variant === 'inline')
    return <NoResultsEmptyState {...sharedProps} />
  return <CardEmptyState {...sharedProps} />
}

// ─── Presets ──────────────────────────────────────────────────────────────────
// Pre-configured icon + copy for each section of Poko.
// Spread into <EmptyState> and supply your own action buttons.
//
// Example:
//   <EmptyState
//     variant="page"
//     {...emptyStatePresets.products}
//     primaryAction={<Button color="orange">Add product</Button>}
//   />

const emptyStatePresets = {
  /** Products page — no products tracked */
  products: {
    icon: <Package />,
    title: 'No products added yet',
    description:
      'Add affiliate products to generate content, track links, and measure performance.',
  },

  /** Posts page — no posts created */
  posts: {
    icon: <FileText />,
    title: 'No posts published',
    description: 'Write a post manually or generate one from a content idea.',
  },

  /** Posts filtered — search or filter returned nothing */
  postsFiltered: {
    icon: <SearchX />,
    title: 'No posts match your filters',
    description: 'Try a different keyword, platform, or status.',
  },

  /** Content ideas page — no ideas generated */
  contentIdeas: {
    icon: <Sparkles />,
    title: 'No content ideas yet',
    description:
      'Generate ideas from your products, or import topics from your niche.',
  },

  /** Content seeds page — no seeds created */
  contentSeeds: {
    icon: <Sparkles />,
    title: 'No content seeds yet',
    description:
      'Create a reusable content direction, then link products to generate multiple post drafts.',
  },

  /** Content seed detail — no products linked */
  noLinkedProducts: {
    icon: <LinkIcon />,
    title: 'No products linked',
    description:
      'Add one or more products so this seed can generate post drafts.',
  },

  /** Content seed detail — no posts generated */
  noGeneratedPosts: {
    icon: <FileTextIcon />,
    title: 'No posts generated yet',
    description:
      'This seed is ready. Choose a generation mode to create your first drafts.',
  },

  /** Schedule page — nothing queued */
  schedule: {
    icon: <CalendarDays />,
    title: 'Schedule is empty',
    description:
      'Queue posts from the content board to plan your publishing calendar.',
  },

  /** Analytics page — no data available */
  analytics: {
    icon: <BarChart2 />,
    title: 'No data yet',
    description:
      'Analytics appear once posts are published and receive traffic.',
    note: 'Data is updated every 24 hours.',
  },

  /** Integrations / pages — no platforms connected */
  integrations: {
    icon: <Puzzle />,
    title: 'No integrations connected',
    description: 'Connect a publishing platform to automate post delivery.',
  },

  /** Generic search / filter no results */
  searchResults: {
    icon: <SearchX />,
    title: 'No results found',
    description: 'Try a different keyword or clear your filters.',
  },
} satisfies Record<
  string,
  Pick<EmptyStateProps, 'icon' | 'title' | 'description' | 'note'>
>

export { EmptyState, emptyStatePresets }
export type { EmptyStateProps, EmptyStateVariant }
