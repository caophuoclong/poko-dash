import * as React from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '#/shared/utils'

interface PageHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: React.ReactNode
  backHref?: string
  backLabel?: React.ReactNode
  actions?: React.ReactNode
}

function PageHeader({
  title,
  subtitle,
  eyebrow,
  backHref,
  backLabel = 'Quay lại',
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn('sticky top-0 z-10 bg-surface -mx-4 -mt-4 pt-4 px-4 mb-6 space-y-3', className)}
      {...props}
    >
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-muted-text transition-colors hover:text-near-white"
        >
          <ChevronLeft className="size-3.5" />
          <span>{backLabel}</span>
        </a>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {eyebrow ? (
            <div className="text-xs font-medium uppercase tracking-wide text-muted-text">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-display text-2xl font-bold tracking-tight text-near-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-text">{subtitle}</p>
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
