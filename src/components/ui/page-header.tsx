import * as React from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '#/shared/utils'

interface PageHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
  backHref?: string
  backLabel?: React.ReactNode
  actions?: React.ReactNode
}

function PageHeader({
  title,
  description,
  breadcrumb,
  primaryAction,
  secondaryActions,
  backHref,
  backLabel = 'Quay lại',
  actions: legacyActions,
  className,
  ...props
}: PageHeaderProps) {
  const actions = legacyActions ?? (
    <>
      {secondaryActions}
      {primaryAction}
    </>
  )

  return (
    <div
      data-slot="page-header"
      className={cn(
        'sticky top-0 z-10 -mx-4 -mt-4 pt-4 px-4 mb-6 space-y-3',
        'bg-[var(--color-canvas)]',
        className,
      )}
      {...props}
    >
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          <ChevronLeft className="size-3.5" />
          <span>{backLabel}</span>
        </a>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {breadcrumb ? (
            <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              {breadcrumb}
            </div>
          ) : null}
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-[var(--color-muted)]">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

export { PageHeader }
